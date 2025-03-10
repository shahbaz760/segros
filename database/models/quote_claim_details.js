/* storing the detail of the past claims taken by that customer */
module.exports = (sequelize, DataTypes) => {
  const quote_claim_details = sequelize.define(
    "quote_claim_details",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      quote_claim_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from quote_claims table'
      },
      claim_value: {
        type: DataTypes.FLOAT(20, 2),
        allowNull: true,
        defaultValue: 0.00,
        comment: 'value from "valor sinistro" of claim added in step 6'
      },
      franchise: {
        type: DataTypes.FLOAT(20, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'value from "franquia" of claim added in step 6'
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'value from "data de occurrencia" of claim added in step 6'
      },
      claim_cause_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'primary key of quote_claim_causes table'
      },
      claim_status_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'primary key of quote_claim_statuses table'
      },
      currency: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: '1: real (r$), 2: dólar americano (us$)'
      },
    },
    {
      timestamps: true,
    }
  );
  return quote_claim_details;
};
