/* storing the currency exchange rate for currency conversion real$ to usd$ and vice versa */
module.exports = (sequelize, DataTypes) => {
    const currency_exchange_rates = sequelize.define(
        "currency_exchange_rates",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            rate: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'currency exchange rate for currency conversion from real$ to usd$ and vice versa'
            },
            is_active: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '1-ACTIVE, 0:INACTIVE'
            }
        },
        { timestamps: true }
    )
    return currency_exchange_rates;
}