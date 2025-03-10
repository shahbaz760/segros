/* storing the addresses of users */
module.exports = (sequelize, DataTypes) => {
  const company_addresses = sequelize.define(
    "company_addresses",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(225),
        allowNull: true,
        defaultValue: null
      },
      address_number: {
        type: DataTypes.STRING(125),
        allowNull: true,
        defaultValue: null
      },
      zipcode: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: null
      },
      neighborhood: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
      },
      city: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: "primary key from ecuador cities table"
      },
      state: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: "primary key from states table"
      },
      floor: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
        comment: 'value from field piso'
      },
      cross: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
        comment: 'value from field transversal'
      },
      reference: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
        comment: 'value from field referencia'
      },
      country_of_origin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'value from field País de Origen'
      },
      reference_country: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'value from field Páis de Referencia'
      }

    },
    { timestamps: true }
  );
  return company_addresses;
};
