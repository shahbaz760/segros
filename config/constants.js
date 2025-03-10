export const RESPONSE_CODES = {
  GET: 200,
  POST: 201,
  DELETE: 204,
  PUT: 204,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

export const PAGINATION = {
  START: 0,
  LIMIT: 10,
};

export const USER_STATUS = {
  PENDING: 1,
  ACTIVE: 2,
  INACTIVE: 3,
  REJECTED: 4,
};

export const IS_ACTIVE = {
  TRUE: 1,
  FALSE: 0,
};

export const IS_DELETED = {
  TRUE: 1,
  FALSE: 0,
};

export const IS_MODERATE = {
  TRUE: 1,
  FALSE: 0,
};

export const ROLES = {
  ADMIN: 1,
  SUB_ADMIN: 2,
  AGENCY: 3,
  SUB_AGENCY: 4,
  BROKER: 5,
  SUB_BROKER: 6,
  CUSTOMER: 7,
  QUOTE: 8,
};
export const SORTING = {
  COMMON_SORTING: 'id',
  TYPE: "desc",
}
export const QUOTE_STATUS = {
  ACTIVE: 1,
  INACTIVE: 2,
  EMITIDO: 3,
  RASCUNHO: 4,
  MODERAÇÃO: 5,
  EM_EMISSÃO: 6,
  DECLINADA: 7,
  CANCELADO: 8,
  PENDENTE: 9,
  REVISÃO: 10,
};
export const CURRENCY_ID = {
  REAL$: 1,
  USD$: 2,
};

export const CURRENCY_NAME = {
  REAL$: "R$-Real",
  USD$: "USD-Dólar",
};

export const PRODUCT_ID = {
  // TN: 1,
  IMP: 2,
  EXP: 3,
};

export const INSURANCE_TYPE_ID = {
  SINGLE: 1,
  ANNUAL: 2,
};

export const DEFAULT_ENUM = {
  TRUE: 1,
  FALSE: 0,
};

export const DOCUMENT_TYPE = {
  SHIPMENT: 1,
  QUOTE: 2,
  RISK: 3,
  QUOTE_CLAIM: 4,
  APPLICATION: 6
};

export const CURRENCY_EXCHANGE_RATE = {
  STANDARD: 5.4,
};

export const GR_TYPE = {
  STANDARD: 1,
  PERSONALIZED: 2,
  MANUALLY_UPLOADED: 3,
};

export const PREMIUM_CALCULATION_TYPE = {
  AJUSTAVEL: 1,
  AVERBAVEL: 2,
};

export const PREMIUM_CALCULATION_TYPE_NAME = {
  AJUSTAVEL: "Ajustável",
  AVERBAVEL: "Averbável",
};

export const PROPOSAL_STATUS = {
  EMITIDO: 1,
  EXPIRADO: 2,
  EM_EMISSAO: 3,
  CANCELDO: 4
}

/* proposal payment status */
export const PROPOSAL_PAYMENT_STATUS = {
  EMITIDO: 1,
  EXPIRADO: 2,
  EM_EMISSAO: 3,
  VENCIDO: 4,
  NOT_APPLICABLE: 5,
  PENDENTE: 6,
  CANCELADO: 7,
}
/* end */

/* socket events name */
export const SOCKET_EVENTS = {
  QUOTE_TARGETED_TO_MODERATION: "QuoteTargetedToModeration",
  QUOTE_CREATE_SUCCESS: "QuoteCreateSuccess",
  QUOTE_APPROVE_SUCCESS: "QuoteApproveSuccess",
  QUOTE_STATUS_UPDATE_SUCCESS: "QuoteStatusUpdateSuccess",
  ADD_UPDATE_QUOTE_CALCULATION: "AddUpdateQuoteCalculation",
  CLAIM_ADDED_SUCCESS: "ClaimAddedSuccess",
  PROPOSAL_CREATED_SUCCESS: "CreateProposalSuccess",
  PROPOSAL_STATUS_UPDATED_SUCCESS: "ProposalUpdatedSuccess",
  PROPOSAL_APPROVAL_SUCCESS: "ProposalApprovalSuccess",
  ENDORSEMENT_CREATED_SUCCESS: "EndorsementCreatedSuccess",
  ENDORSEMENT_APPROVE_SUCCESS: "EndorsementApproveSuccess"
}
/* end */

/* socket events name */
export const CLAIM_STATUS = {
  PENDENTE: 1,
  ENCERRADO: 2,
  LIQUIDADO: 3,
}
/* end */

/* company status */
export const COMPANY_STATUS = {
  PENDING: 1,
  ACTIVE: 2,
  INACTIVE: 3,
  REJECTED: 4,
}
/* end */

/* proposal new status */
export const PROPOSAL_NEW_STATUS = {
  ACTIVO: 1,
  GANADO: 2
}
/* end */

/* application status */
export const APPLICATION_STATUS = {
  EMITIDO: 1,
  CANCELADO: 2
}
/* end */

/* parent log type */
export const PARENT_LOG_TYPE = {
  COMPANY: "Company",
  QUOTE: "Quote",
  PROPOSAL: "Proposal",
  CLAIM: "Claim",
  USER: "User",
  CLAIM_PARTNER: "ClaimPartner",
  APPLICATION: "Application"
}
/* end */

/* child log type */
export const CHILD_LOG_TYPE = {
  /* user module */
  SAML_USER_OBJECT: "SamlUserObject",
  GET_BROKER_COMPANY: "GetBrokerCompany",
  GET_CREDIT_SCORE: "GetCreditScore",
  GENERATE_TOKEN_FOR_OFAC: "GenrateTokenForOFAC",
  VERIFY_OFAC_RUC_API: "VerifyOfacRucApi",
  ADD_SUB_ADMIN: "AddSubAdmin",
  UPDATE_SUB_ADMIN: "UpdateSubAdmin",
  ADD_AGENCY: "AddAgency",
  QUOTE_ASSIGN_TO_SUB_ADMIN: "QuoteAssignToSubAdmin",
  RENEW_POLICY: "RenewPolicy",
  UPDATE_AGENCY: "UpdateAgency",
  SIGNUP: "Signup",
  FORGOT_PASSWORD: "ForgotPassword",
  RESET_PASSWORD: "ResetPassword",
  UPDATE_BROKER: "UpdateBroker",
  BROKER_APPROVE_REJECT: "BrokerApproveReject",
  ADD_CUSTOMER: "AddCustomer",
  UPDATE_CUSTOMER: "UpdateCustomer",
  USER_ACTIVE_INACTIVE: "UserActiveInactive",
  USER_DELETE: "UserDelete",
  ADD_SUB_BROKER_OR_SUB_AGENCY: "AddSubBrokerOrSubAgency",
  UPDATE_SUB_BROKER_OR_SUB_AGENCY_BY_UUID: "UpdateSubBrokerOrSubAgencyByUUID",
  UPDATE_USER_PROFILE: "UpdateUserProfile",
  UPLOAD: "Upload",
  UPDATE_COMPANY: "UpdateCompany",
  COMPANY_ACTIVE_INACTIVE: "CompanyActiveInactive",
  COMPANY_DELETE: "CompanyDelete",
  /* quote module */
  CREATE_QUOTE: "CreateQuote",
  ADD_COMPANY_DETAIL: "AddCompanyDetail",
  CREATE_SINGLE_TRANSPORT_GOODS: "CreateSingleTransportGoods",
  ADD_LMG_NOTES: "AddLmgNotes",
  ADD_SINGLE_SHIPMENT_DETAIL: "AddSingleShipmentDetail",
  CREATE_SINGLE_COVERAGES: "CreateSingleCoverages",
  ADD_UPDATE_QUOTE_CALCULATION: "AddUpdateQuoteCalculation",
  DELETE_TRANSPORT_GOOD_DETAIL: "DeleteTransportGoodDetail",
  CREATE_ANNUAL_TRANSPORT_GOODS: "CreateAnnualTransportGoods",
  ADD_UPDATE_ANNUAL_SHIPMENT_DETAIL: "AddUpdateAnnualShipmentDetail",
  ADD_UPDATE_ANNUAL_QUOTE_RISK: "AddUpdateAnnualQuoteRisk",
  ADD_UPDATE_ANNUAL_QUOTE_CLAIMS_FROM_SHEET: "AddUpdateAnnualQuoteClaimsFromSheet",
  SAVE_ANNUAL_QUOTE_CLAIM_SHEET_FROM_SHEET: "SaveAnnualQuoteClaimSheetFromSheet",
  CREATE_ANNUAL_COVERAGES: "CreateAnnualCoverages",
  APPROVE_REJECT: "ApproveReject",
  UPDATE_QUOTE_STATUS: "UpdateQuoteStatus",
  DUPLICATE_QUOTE: "DuplicateQuote",
  ADD_MESSAGE: "AddMessage",
  DELETE_QUOTE_DOCUMENT: "DeleteQuoteDocument",
  /* proposal module */
  CREATE_PROPOSAL: "CreateProposal",
  UPDATE_PROPOSAL_STATUS: "UpdateProposalStatus",
  ADD_SINGLE_POLICY_TO_INSURANCE_COMPANY: "AddSinglePolicyToInsuranceCompany",
  ADD_ANNUAL_POLICY_TO_INSURANCE_COMPANY: "AddAnnualPolicyToInsuranceCompany",
  GET_POLICY_NUMBER_FROM_INSURANCE_COMPANY: "GetPolicyNumberFromInsuranceCompany",
  ADD_APPLICATION_TO_INSURANCE_COMPANY: "AddApplicationToInsuranceCompany",
  /* claim module */
  CREATE_CLAIMS: "CreateClaims",
  ADD_UPDATE_CLAIM_PARTNER: "AddUpdateClaimPartner",
  /* insurance company module */
  PROPOSAL_APPROVAL_FROM_INSURANCE_COMPANY: "ProposalApprovalFromInsuranceCompany",
  GET_INSURANCE_COMPANY_ACCESS_TOKEN: "GetInsuranceCompanyAccessToken",
  /* application module */
  CREATE_APPLICATION: "CreateApplication"
}
/* end */

/* api log message */
export const API_LOG_MESSAGES = {
  SUCCESS: "Success",
  FAILED: "Failed",
};
/* end */

/* insurance status */
export const INSURANCE_STATUS = {
  PENDING: 1,
  CLOSED: 2,
  SETTLED: 3
}
/* end */

/* transaction status */
export const TRANSACTION_DOC_TYPE = {
  POLICY: 1,
  FACTURA: 2
}
/* end */

/* report payment type */
export const TRANSACTION_PAYMENT_TYPE = {
  CHARGE: 1
}
/* end */

/* transpotation type */
export const TRANSPOTATION_TYPE = {
  AIR_USED: 1,
  MARITIME_USED: 2,
  ROAD_USED: 3
}
/* end */