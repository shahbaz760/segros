/* storing quote documents added at the screen 2 */
module.exports = (sequelize, DataTypes) => {
  const quote_documents = sequelize.define(
    "quote_documents",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      quote_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'the primary key of the quote table.'
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
  return quote_documents;
};
