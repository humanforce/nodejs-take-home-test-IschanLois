import Sequelize from 'sequelize'

import sequelizeInstance from '../services/sequelize.js'

export default class MovieReview extends Sequelize.Model {}

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
