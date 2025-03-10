/* storing quote claim documents added at the quote claim screen */
module.exports = (sequelize, DataTypes) => {
  const quote_claim_documents = sequelize.define(
    "quote_claim_documents",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      quote_claim_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'the primary key from quote_claims table.'
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
  return quote_claim_documents;
};
