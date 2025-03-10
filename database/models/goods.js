/* storing the Goods */
module.exports = (sequelize, DataTypes) => {
    const Goods = sequelize.define(
        "goods",
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
                comment: 'name of the good'
            },
            group: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            percentage: {
                type: DataTypes.FLOAT(10, 4),
                defaultValue: null,
            },
            imp_exp_percentage: {
                type: DataTypes.DECIMAL(20, 4),
                defaultValue: null,
            },
            is_moderate: {
                type: DataTypes.TINYINT,
                allowNull: false,
            },
            obs: {
                type: DataTypes.STRING(40),
                allowNull: true,
                defaultValue: null,
            },
            type_of_risk: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: null,
                comment: 'Normal - 1, Alto - 2, Excluido - 3'
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
    return Goods;
};

