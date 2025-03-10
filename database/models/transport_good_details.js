/* storing the transport_good_details of the quote */
module.exports = (sequelize, DataTypes) => {
  const transport_good_details = sequelize.define(
    "transport_good_details",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      transport_good_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'primary key from transport_goods table'
      },
      good_id: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'primary key from goods table'
      },
      group_id: {
        type: DataTypes.STRING(5),
        allowNull: false,
        comment: 'good group from goods table'
      },
      good_group_percentage: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true,
        defaultValue: null,
        comment: ' for flow 2 only',
      },
      group_percentage: {
        type: DataTypes.DOUBLE(10, 4),
        allowNull: true,
        defaultValue: null,
        comment: ' for flow 2 only',
      },
      additional_information: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'only for flow 1. if selected "other" type of good',
      },
      in_bulk: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'for flow 1 only (a granel) in step 3 >> 0: not applicable, 1: applicable'
      },
      chilled: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'for flow 1 only (refrigerada) in step 3 >> 0: not applicable, 1: applicable'
      },
      frozen: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'for flow 1 only (congelada) in step 3 >> 0: not applicable, 1: applicable'
      },
      boxes: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'for flow 1 only (Cajas) in step 3 >> 0: not applicable, 1: applicable'
      },
      container: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: 'for flow 1 only (Contenedor) in step 3 >> 0: not applicable, 1: applicable'
      },
      incoterm: {
        type: DataTypes.STRING(5),
        allowNull: true,
        defaultValue: null,
        comment: 'for flow 1 only in step 3'
      },
      type_of_good: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: 'for flow 1 only. 1: nova, 2: usada'
      },
      valor_da_mercadoria: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'for flow 1 only >> value from "valor da mercadoria"',
      },
      freight: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'for flow 1 only >> value from "frete"',
      },
      expenses_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'for flow 1 only >> value from "despesas"'
      },
      expenses: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'for flow 1 only',
      },
      total_amount: {
        type: DataTypes.DOUBLE(20, 4),
        allowNull: true,
        defaultValue: 0.0,
        comment: 'for flow 1 only >> value from valor total"',
      },
      good_text: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'for flow 2 only'
      },
    },
    {
      timestamps: true,
    }
  );
  return transport_good_details;
};
