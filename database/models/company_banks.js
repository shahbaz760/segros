/* storing the addresses of users */
module.exports = (sequelize, DataTypes) => {
  const company_banks = sequelize.define(
    "company_banks",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bank_number: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
      },
      bank_agency_number: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
      },
      bank_account_code: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
      },
      bank_account_number: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
      },
    },
    { timestamps: true }
  );
  return company_banks;
};
