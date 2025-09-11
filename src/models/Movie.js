import Sequelize from 'sequelize'

import sequelizeInstance from '../services/sequelize.js'

export default class Movie extends Sequelize.Model {}

Movie.init({
  movie_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
