/* storing the cities */
module.exports = (sequelize, DataTypes) => {
    const ClaimCausaCode = sequelize.define(
        "claim_causa_codeS",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(100),
                defaultValue: null,
                allowNull: true,
            },
            causa_id: {
                type: DataTypes.INTEGER,
                defaultValue: null
            },
            imp_exp: {
                type: DataTypes.INTEGER,
                defaultValue: null
            },
            is_active: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '0-Deactive, 1-Active'
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null
            }
        },
        { timestamps: true }
    );
    return ClaimCausaCode;
};

