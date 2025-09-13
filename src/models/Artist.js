import Sequelize from 'sequelize'

import sequelizeInstance from '../services/sequelize.js'

export default class Artist extends Sequelize.Model {}

Artist.init({
  artist_id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  first_name: {
    type: Sequelize.DataTypes.TEXT(100),
    allowNull: false,
  },
  last_name: {
    type: Sequelize.DataTypes.TEXT(100),
    allowNull: false,
  },
}, {
  sequelize: sequelizeInstance,
  modelName: 'Artist',
  tableName: 'artists',
  timestamps: false,
})
