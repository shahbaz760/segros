/* storing the detail of the basic coverages selected while adding the quote */
module.exports = (sequelize, DataTypes) => {
  const quote_basic_coverages = sequelize.define(
    "quote_basic_coverages",
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
        comment: 'primary key from basic_coverages table'
      },
    },
    {
      timestamps: true,
    }
  );
  return quote_basic_coverages;
};
