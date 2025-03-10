/* storing the shipments of the quote */
module.exports = (sequelize, DataTypes) => {
  const quote_shipments = sequelize.define(
    "quote_shipments",
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
      additional_information: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'if select outras (mercadorias especificas não listadas na tabela) from the goods',
      },
      road_used: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'value from "camion"'
      },
      road_percentage: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'road percentage',
      },
      maritime_used: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: ' value from "marítimo"'
      },
      maritime_percentage: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'meritime percentage',
      },
      air_used: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'value from "aéreo"'
      },
      air_percentage: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'road percentage',
      },
    },
    {
      timestamps: true,
    }
  );
  return quote_shipments;
};
