import Sequelize from 'sequelize'

import sequelizeInstance from '../services/sequelize.js'

export default class Movie extends Sequelize.Model {
  static getTopMoviesByRating(limit) {
    return sequelizeInstance.query(
      `SELECT m.movie_id, m.title, AVG(r.rating) AS average_rating
        FROM movies m
        JOIN reviews r ON m.movie_id = r.movie_id
        WHERE m.is_deleted = false
        GROUP BY m.movie_id
        ORDER BY average_rating DESC
        LIMIT :limit;
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { limit }
      }
    )
  }
}

Movie.init({
  movie_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  release_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cover_url: {
    type: Sequelize.STRING,
    allowNull: true
  },
  synopsis: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  director_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  writer_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  is_deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  }
}, {
  sequelize: sequelizeInstance,
  modelName: 'Movie',
  tableName: 'movies',
  timestamps: false,
})
