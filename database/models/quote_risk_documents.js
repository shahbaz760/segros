/* storing quote risk documents added at the quote risk screen */
module.exports = (sequelize, DataTypes) => {
  const quote_risk_documents = sequelize.define(
    "quote_risk_documents",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      quote_risk_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'the primary key from quote_risks table.'
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
  return quote_risk_documents;
};
