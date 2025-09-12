import Sequelize from 'sequelize'

import sequelizeInstance from '../services/sequelize.js'

export default class MovieReview extends Sequelize.Model {
  /**
   * Using separate queries here for these reasons:
   * 1. Average tend to changes less often for larger datasets, hence a good candidate for caching
   * 2. Average is reasonably cheap to query for smaller datasets
   * 3. Have some decoupling with list of reviews, so that we can paginate reviews
   */
  static async getMovieRatingAndReviews (movieId, limit, offset) {
    const movieRatingQuery = sequelizeInstance.query(
      `SELECT m.movie_id, m.title, m.is_deleted, AVG(r.rating) AS average_rating
        FROM movies m
        JOIN reviews r ON m.movie_id = r.movie_id
        WHERE m.movie_id = :movie_id
        GROUP BY m.movie_id
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { movie_id: movieId },
      },
    )

    const movieReviewsQuery = sequelizeInstance.query(
      `SELECT *
      FROM reviews
      WHERE movie_id = :movie_id
      ORDER BY rating DESC
      LIMIT :limit
      OFFSET :offset`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { movie_id: movieId, limit, offset},
      },
    )

    const [[movieRating], reviews] = await Promise.all([movieRatingQuery, movieReviewsQuery])

    return {
      ...movieRating,
      reviews,
    }
  }
}

MovieReview.init({
  review_id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  movie_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: 'INTEGER',
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  heading: {
    type: Sequelize.DataTypes.STRING(255),
    allowNull: true,
  },
  body: {
    type: Sequelize.DataTypes.TEXT,
    allowNull: true,
  },
  likes: {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  dislikes: {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  username: {
    type: Sequelize.DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  sequelize: sequelizeInstance,
  modelName: 'Review',
  tableName: 'reviews',
  timestamps: false,
})
