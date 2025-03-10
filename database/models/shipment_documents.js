/* storing shipment documents added at the screen 4 */
module.exports = (sequelize, DataTypes) => {
  const shipment_documents = sequelize.define(
    "shipment_documents",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      quote_shipment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'the primary key from quote_shipments table.'
      },
      path: {
        type: DataTypes.STRING(225),
        allowNull: true,
        comment: 'path of the document.'
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'type of the document.'
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'name of the document.'
      },
    },
    {
      timestamps: true,
    }
  );
  return shipment_documents;
};
