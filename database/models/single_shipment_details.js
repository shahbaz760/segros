/* storing the detail of the shipment for flow 1 selected of the quote */
module.exports = (sequelize, DataTypes) => {
  const single_shipment_details = sequelize.define(
    "single_shipment_details",
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
      boarding_document_number: {
        type: DataTypes.STRING(64),
        allowNull: true,
        defaultValue: null,
        comment: 'value from "número do documento do embarque"'
      },
      boarding_document_type: {
        type: DataTypes.STRING(225),
        allowNull: true,
        defaultValue: null,
        comment: 'value from "tipo de documento"'
      },
      landing_city: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'value from "cidade de desembarque"'
      },
      landing_place: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'value from "local de desembarque"'
      },
      destination_city: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'value from "cidade de destino"'
      },
      destination_place: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'value from "local de destino"'
      },
      shipping_company: {
        type: DataTypes.STRING(225),
        allowNull: true,
        defaultValue: null,
        comment: 'value from "transportadora"'
      },
      complementary_land_route: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'value from "informe os detalhes da rota", 0 : false, 1 : true'
      },
    },
    {
      timestamps: true,
    }
  );
  return single_shipment_details;
};
