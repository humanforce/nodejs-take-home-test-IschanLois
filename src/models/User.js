import Sequelize from 'sequelize'

import sequelizeInstance from '../services/sequelize.js'

export default class User extends Sequelize.Model {
  static findUserByUsername (username) {
    return sequelizeInstance.query(
      `SELECT username
      FROM users
      WHERE username = :username`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { username },
        plain: true,
      },
    )
  }
}

User.init({
  username: {
    type: Sequelize.DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  user_password: {
    type: Sequelize.DataTypes.TEXT,
    allowNull: false,
  },
  user_role: {
    type: Sequelize.DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  }
}, {
  sequelize: sequelizeInstance,
  modelName: 'User',
  tableName: 'users',
  timestamps: false,
})
