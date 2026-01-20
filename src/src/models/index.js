import sequelize from "../config/db.js";

// MODELS
import RoleAccessRight from "./roleAccessRight.model.js";
import AuditLog from './auditLog.model.js';

import User from "./user.model.js";

import Otp from "./otp.model.js";

import AuthenticationType from "./authenticationType.model.js";

import Role from "./role.model.js";

import Corporate from "./corporate.model.js";

import Company from "./company.model.js";

import RefreshToken from "./refreshToken.model.js";

import AccessRight from "./accessRight.model.js";

import UserAccessRight from "./userAccessRight.model.js";
import UserCompany from "./userCompany.model.js";

/* =====================================================

   ASSOCIATIONS

===================================================== */

/* 1. USER ↔ REFRESH TOKEN (One-to-Many) */

User.hasMany(RefreshToken, {

  foreignKey: "user_id",

  as: "refreshTokens",

});

RefreshToken.belongsTo(User, {

  foreignKey: "user_id",

  as: "user",

});

/* 2. USER ↔ OTP (One-to-Many) */

User.hasMany(Otp, {

  foreignKey: "user_id",

  as: "otps",

});

Otp.belongsTo(User, {

  foreignKey: "user_id",

  as: "user",

});

/* 3. USER ↔ AUTHENTICATION TYPE (Many-to-One) */

AuthenticationType.hasMany(User, {

  foreignKey: "auth_type_id",

  as: "users",

});

User.belongsTo(AuthenticationType, {

  foreignKey: "auth_type_id",

  as: "authType",

});

/* 4. USER ↔ ROLE (Many-to-One) */

Role.hasMany(User, {

  foreignKey: "role_id",

  as: "users",

});

User.belongsTo(Role, {

  foreignKey: "role_id",

  as: "role",

});

/* 5. USER ↔ CORPORATE (Many-to-One) */

Corporate.hasMany(User, {

  foreignKey: "client_group_id",

  as: "users",

});

User.belongsTo(Corporate, {

  foreignKey: "client_group_id",

  as: "corporate",

});

// /* 6. USER ↔ COMPANY (Many-to-One)  ✅ NEW */


User.belongsToMany(Company, {
  through: UserCompany,
  foreignKey: "user_id",
  otherKey: "client_id",
  as: "companies",
});

Company.belongsToMany(User, {
  through: UserCompany,
  foreignKey: "client_id",
  otherKey: "user_id",
  as: "users",

});

// /* 7. USER ↔ ACCESS RIGHTS (Many-to-Many) */

User.belongsToMany(AccessRight, {

  through: UserAccessRight,

  foreignKey: "user_id",

  otherKey: "access_right_id",

  as: "accessRights",

});

AccessRight.belongsToMany(User, {

  through: UserAccessRight,

  foreignKey: "access_right_id",

  otherKey: "user_id",

  as: "users",

});


/* Corporate to Company */

Corporate.hasMany(Company, {
  foreignKey: "client_group_id",
  as: "companies"
})

Company.belongsTo(Corporate, {
  foreignKey: "client_group_id",
  as: "corporate"
})



/* ROLE TYPE ↔ ACCESS RIGHTS */
AccessRight.hasMany(RoleAccessRight, {
  foreignKey: "access_right_id",
  as: "roleMappings",
});
RoleAccessRight.belongsTo(AccessRight, {
  foreignKey: "access_right_id",
  as: "accessRight",
});
/* =====================================================

   EXPORT DB

===================================================== */

const db = {

  sequelize,

  User,

  Otp,

  RefreshToken,

  AuthenticationType,

  Role,

  Corporate,

  Company,

  AccessRight,

  UserAccessRight,
  RoleAccessRight,
  AuditLog,

};

export default db;
await sequelize.sync();