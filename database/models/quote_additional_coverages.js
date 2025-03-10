/* storing the detail of the additional coverages selected while adding the quote */
module.exports = (sequelize, DataTypes) => {
  const quote_additional_coverages = sequelize.define(
    "quote_additional_coverages",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      quote_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from quotes table'
      },
      coverage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from additional_coverages table'
      },
      sub_limit: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
        comment: 'sub limits or desired threshold of the coverage, value from coverage screen while adding quote'
      },
      minimum_deductible: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
        comment: 'minimum_deductible of the coverage, value from coverage screen while adding quote'
      },
      deductible: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
        comment: 'franchise of the coverage, value from the coverage screen while adding quote'
      },
      rate: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
        comment: 'rate of the coverage, value from the coverage screen while adding quote'
      },
    },
    {
      timestamps: true,
    }
  );
  return quote_additional_coverages;
};
