/* storing the company roles to check how many roles a company have */
module.exports = (sequelize, DataTypes) => {
    const company_roles = sequelize.define(
        "company_roles",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                comment: 'id from the company table'
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        { timestamps: true }
    )
    return company_roles;
}