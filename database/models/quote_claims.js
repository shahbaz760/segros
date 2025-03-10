/* storing the detail of the past claims taken by that customer */
module.exports = (sequelize, DataTypes) => {
  const quote_claims = sequelize.define(
    "quote_claims",
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
        comment: 'primary key from quotes table'
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from users table represents the broker id of the quote'
      },
      created_by_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from users table represents which user created the quote claims'
      },
      is_past_claims: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'value from "houve sinistros nos últimos 36 meses?", 0: not selected, 1: selected'
      },
      approximate_value: {
        type: DataTypes.FLOAT(20, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'total value of "valor sinistro" of all claims added in step 6'
      },
      currency: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: '1: real (r$), 2: dólar americano (us$)'
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: 'date at which quote claim deleted'
      },
    },
    {
      timestamps: true,
    }
  );
  return quote_claims;
};
