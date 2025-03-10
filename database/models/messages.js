/* storing the messages added from the moderation popup in "analise" tab */
module.exports = (sequelize, DataTypes) => {
  const messages = sequelize.define(
    "messages",
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
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      timestamps: true,
    }
  );
  return messages;
};
