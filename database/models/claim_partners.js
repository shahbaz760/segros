/* storing the claim_partners */
import bcrypt from "bcrypt";
import { saltRounds } from "../../config/keys";
module.exports = (sequelize, DataTypes) => {
    const ClaimPartners = sequelize.define(
        "claim_partners",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(150),
                default: null,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(70),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(255),
                default: null
            },
            is_active: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                comment: '0-Deactive, 1-Active'
            },
        },
        {
            timestamps: true,
            hooks: {
                beforeCreate: async (user) => {
                    /* password encryption */
                    if (user && user.password) {
                        user.password = await bcrypt.hash(user.password, saltRounds);
                    }
                },
                beforeBulkUpdate: async (user) => {
                    if (user && user.attributes && user.attributes.password) {
                        user.attributes.password = await bcrypt.hash(
                            user.attributes.password,
                            saltRounds
                        );
                    }
                    if (user && user.attributes && user.attributes.email) {
                        user.attributes.email = user.attributes.email.toLowerCase();
                    }

                },

            },
        }
    )
    return ClaimPartners;
}