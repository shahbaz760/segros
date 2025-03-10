/* storing the Companies */
import bcrypt from "bcrypt";
import { saltRounds } from "../../config/keys";
module.exports = (sequelize, DataTypes) => {
  const Companies = sequelize.define(
    "companies",
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
      ruc: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      microsoft_group_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
        comment: 'id which is get from get broker company(third party) '
      },
      company_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      company_email: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      company_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      company_reg_no: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null
      },
      municipal_registration: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
      },
      state_registration: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
      },
      customer_score: {
        type: DataTypes.FLOAT(20, 2),
        allowNull: true,
        defaultValue: null,
        comment: "score of the customer on the basis of his/her total premium and claims"
      },
      total_premium: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: "associated with the customer"
      },
      total_claim_amount: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: "claimed by the customer"
      },
      is_customer_blacklisted: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: "flag taken to check whether a customer/client is blacklisted or not"
      },
      responsible_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'id from the user table'
      },
      agency_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'assigned agency to the company'
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 2,
        comment: '1-PENDING, 2-ACTIVE, 3-INACTIVE, 4-REJECTED'
      },
      customer_type: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: '1- ADD WITH RUC, 2- MANUAL ADD'
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      gender: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0- NOT SELECTED, 1- MALE, 2- FEMALE'
      },
      marital_status: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0- NOT SELECTED,1- MARRIED, 2- UNMARRIED'
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: 'value from field fecha nacimiento'
      },
      home_telephone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
      }
    },
    {
      timestamps: true,
      hooks: {
        beforeCreate: async (company) => {
          if (company && company.dataValues && company.dataValues.company_email) {
            company.dataValues.company_email = company.dataValues.company_email.toLowerCase();
          }
        },
      }
    }
  );
  return Companies;
};
