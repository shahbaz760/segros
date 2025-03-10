/* storing the user detail */
module.exports = (sequelize, DataTypes) => {
  const user_accesses = sequelize.define(
    "user_accesses",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      administrator: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0 - NON-ACCESS, 1- ACCESS'
      },
      quotes: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0 - NON-ACCESS, 1- ACCESS'
      },
      proposals: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0 - NON-ACCESS, 1- ACCESS'
      },
      claims: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0 - NON-ACCESS, 1- ACCESS'
      },
      payments: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: '0 - NON-ACCESS, 1- ACCESS'
      },
    },
    { timestamps: true }
  );
  return user_accesses;
};
