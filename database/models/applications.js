/* storing the roles of the users */
module.exports = (sequelize, DataTypes) => {
    const Applications = sequelize.define(
        "applications",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            uuid: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            proposal_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                comment: "primary key from proposals table"
            },
            // endorsement_id: {
            //     type: DataTypes.INTEGER,
            //     allowNull: true,
            //     defaultValue: null,
            //     comment: "primary key from endorsement table"
            // },
            application_no: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: null,
                comment: 'unique application number as per the proposal number'
            },
            manual_filling: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0,
            },
            document_upload: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0,
            },
            start_date: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: 'date at which policy start'
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: 'date at which policy end'
            },
            source: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                comment: 'id of the city/country selected from the value "origem"'
            },
            destiny: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                comment: 'id of the city/country selected from the value "destino"'
            },
            good_id: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: 'primary key from goods table'
            },
            value_of_goods: {
                type: DataTypes.FLOAT(20, 6),
                allowNull: true,
                defaultValue: null,
                comment: 'value from Valor de los bienes '
            },
            shipping_document_number: {
                type: DataTypes.STRING(64),
                allowNull: true,
                defaultValue: null,
                comment: 'value from "número do documento do embarque"'
            },
            copy_of_shipping_document: {
                type: DataTypes.STRING(225),
                allowNull: true,
                defaultValue: null,
                comment: 'value from "tipo de documento"'
            },
            shipment_limit: {
                type: DataTypes.DOUBLE(20, 6),
                allowNull: true,
                defaultValue: null,
                comment: "shipment limit which should be less then total limit"
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
                comment: '1 - EMITIDO, 2 - CANCELADO'
            },
            cancel_reason: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: null,
                comment: 'reason for cancel the application'
            },
            certificate_pdf: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: null,
                comment: 'application certificate url '
            },
            gross_written_premium: {
                type: DataTypes.DOUBLE(20, 4),
                allowNull: true,
                defaultValue: null
            },
            total_premium: {
                type: DataTypes.DOUBLE(20, 4),
                allowNull: true,
                defaultValue: null
            },
            tax_scvs: {
                type: DataTypes.DOUBLE(20, 4),
                allowNull: true,
                defaultValue: null
            },
            tax_ssc: {
                type: DataTypes.DOUBLE(20, 4),
                allowNull: true,
                defaultValue: null
            },
            tax_emission: {
                type: DataTypes.DOUBLE(20, 4),
                allowNull: true,
                defaultValue: null
            },
            tax_iva: {
                type: DataTypes.DOUBLE(20, 4),
                allowNull: true,
                defaultValue: null
            }
        },
        {
            timestamps: true,
        }
    );
    return Applications;
}