/* storing the quote_additional_customers while adding quote */
/* for now this functionality is hidden from the add customer detail screen */
module.exports = (sequelize, DataTypes) => {
  const quote_additional_customers = sequelize.define(
    "quote_additional_customers",
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
      customer_ruc: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
        comment: 'value from ruc from tab "informar empresas do mesmo grupo" while adding quote'
      },
      customer_name: {
        type: DataTypes.STRING(225),
        allowNull: true,
        defaultValue: null,
        comment: 'value from nome from tab "informar empresas do mesmo grupo" while adding quote',
      },
    },
    {
      timestamps: true,
    }
  );
  return quote_additional_customers;
};
