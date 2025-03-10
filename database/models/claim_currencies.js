module.exports = (sequelize, DataTypes) => {
    const ClaimCurrencies = sequelize.define(
        "claim_currencies",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            is_active: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '0-Deactive, 1-Active'
            },
        },
        { timestamps: true }
    )
    return ClaimCurrencies;
}