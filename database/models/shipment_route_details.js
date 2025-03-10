/* storing the detail of the shipment route selected of the quote */
module.exports = (sequelize, DataTypes) => {
  const shipment_route_details = sequelize.define(
    "shipment_route_details",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      quote_shipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from quote_shipments table'
      },
      source: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'id of the city/country selected from the value "origem"'
      },
      destiny: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'id of the city/country selected from the value "destino"'
      },
      departure_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'value from "data de saída / início da viagem"'
      },
      arrival_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'value from "data prevista de chegada no destino"'
      },
      percentage: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'percentage only for flow 2 routes',
      },
    },
    {
      timestamps: true,
    }
  );
  return shipment_route_details;
};
