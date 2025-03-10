module.exports = (sequelize, DataTypes) => {
    const AuthorityLevels = sequelize.define(
        'authority_levels',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            // name: {
            //     type: DataTypes.STRING(50),
            //     allowNull: true,
            // },
            imp_exp_limit: {
                type: DataTypes.FLOAT(20, 2),
                allowNull: true,
            },
            microsoft_group_id: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            microsoft_group_name: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            commission: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            access_type: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },
            type: {
                type: DataTypes.TINYINT,
                allowNull: true,
                comment: '1- SDP/ADMIN, 2- BROKER'
            },
            is_active: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null
            }
        },
        {
            tableName: 'authority_levels',
            timestamps: true,
        }
    );
    return AuthorityLevels;
};
