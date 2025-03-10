/* storing the logs of the apis */
module.exports = (sequelize, DataTypes) => {
  const ApiLogs = sequelize.define(
    "api_logs",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      request_id: {
        type: DataTypes.STRING(255),
        defaultValue: null,
        allowNull: true,
        comment: 'id of the request for the log i.e. proposal_no'
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
        comment: 'name of the module type i.e. quote, proposal, claim, endorsement etc.'
      },
      log_type: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null,
        comment: 'name of the log type i.e. GetCreditScore, AddProposal, AddClaim-${aviso_numero}, RefreshClaim-${aviso_numero}, AddEndorsement-${endorsement_id}'
      },
      ip_address: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
        comment: 'ip address of the user system'
      },
      request_payload: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: null,
        comment: 'request data of api'
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'consequent result of the activity whether it is success or failed'
      },
      response: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: null,
        comment: 'response data of api'
      },
      login_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'user id who made the request',
      },
      uuid: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    { timestamps: true }
  );
  return ApiLogs;
};

