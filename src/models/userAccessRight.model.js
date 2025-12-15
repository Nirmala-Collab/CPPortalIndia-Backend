import { DataTypes } from "sequelize";

import sequelize from "../config/db.js";

const UserAccessRight = sequelize.define(

  "UserAccessRight",

  {

    id: {

      type: DataTypes.UUID,

      defaultValue: DataTypes.UUIDV4,

      primaryKey: true,

    },

    user_id: {

      type: DataTypes.UUID,

      allowNull: false,

    },

    access_right_id: {

      type: DataTypes.UUID,

      allowNull: false,

    },

  },

  {

    tableName: "user_access_rights",

    underscored: true,

    timestamps: true,

  }

);

export default UserAccessRight;
 