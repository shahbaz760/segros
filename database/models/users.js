/* storing the users */
import bcrypt from "bcrypt";
import { saltRounds } from "../../config/keys";
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'primary key from companies table'
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '1-ADMIN,2-SUBADMIN,3-AGENCY,4-SUBAGENCY,5-BROKER,6-SUBBROKER,7-CUSTOMER,'
      },
      ruc: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      email: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: null,
      },
      profile_pic: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      created_by_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: '1-PENDING, 2-ACTIVE, 3-INACTIVE, 4-REJECTED'
      },
      authority_level_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        references: {
          model: 'authority_levels',
          key: 'id',
        },
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
    },
    {
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          /* password encryption */
          if (user && user.password) {
            user.password = await bcrypt.hash(user.password, saltRounds);
          }
          if (user && user && user.email) {
            user.email = user.email.toLowerCase();
          }
        },
        beforeBulkUpdate: async (user) => {
          if (user && user.attributes && user.attributes.password) {
            user.attributes.password = await bcrypt.hash(
              user.attributes.password,
              saltRounds
            );
          }
          if (user && user.attributes && user.attributes.email) {
            user.attributes.email = user.attributes.email.toLowerCase();
          }
        },
      },
    }
  );
  return users;
};
