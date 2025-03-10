/* storing the roles of the users */
module.exports = (sequelize, DataTypes) => {
  const roles = sequelize.define(
    "roles",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: '0-INACTIVE, 1-ACTIVE'
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      }
    },
    { timestamps: true }
  );
  return roles;
};
