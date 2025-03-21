/* storing the roles of the users */
module.exports = (sequelize, DataTypes) => {
  const AdditionalCoverages = sequelize.define(
    "additional_coverages",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true,
        comment: 'Primary key from products tables'
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'name of the coverage'
      },
      standard: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: null,
        comment: '0-False, 1-True'
      },
      is_moderate: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: null,
        comment: '0-False, 1-True'
      },
      is_default: {
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
  return AdditionalCoverages;
};

