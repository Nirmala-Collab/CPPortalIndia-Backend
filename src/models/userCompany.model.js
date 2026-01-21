import { DataTypes } from 'sequelize';

import sequelize from '../config/db.js';

const UserCompany = sequelize.define(
  'UserCompany',

  {
    id: {
      type: DataTypes.UUID,

      defaultValue: DataTypes.UUIDV4,

      primaryKey: true,
    },

    user_id: {
      type: DataTypes.UUID,

      allowNull: false,
      field: 'user_id',
    },

    client_id: {
      type: DataTypes.STRING,

      allowNull: true,
      field: 'client_id',
    },
  },

  {
    tableName: 'user_companies',

    underscored: true,

    timestamps: true,
  }
);

export default UserCompany;
