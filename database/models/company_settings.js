/* storing the addresses of users */
module.exports = (sequelize, DataTypes) => {
  const company_settings = sequelize.define(
    "company_settings",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      moderation_notification: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '1-ON, 0-OFF'
      },
      moderation_notification_emails: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: null,
      },
      billing_endorsement_notification: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '1-ON, 0-OFF'
      },
      billing_endorsement_notification_emails: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: null,
      },
      sporadic_notification: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '1-ON, 0-OFF'
      },
      sporadic_notification_emails: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: null,
      },
    },
    { timestamps: true }
  );
  return company_settings;
};
