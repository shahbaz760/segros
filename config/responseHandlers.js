const { encryptData } = require("../src/helpers/commonFunction");

/* function for return Success Response */
const successResponse = (msg, data, code, tokenization) => ({
  status: 1,
  message: msg,
  code,
  data: encryptData(tokenization, data) || null,
});
/* end */

/* function for return Error Response */
const errorResponse = (msg, data, code, tokenization) => ({
  status: 0,
  message: msg,
  code,
  data: encryptData(tokenization, data) || null,
});
/* end */

/* function for return success response with pagination */
const successResponseWithPagination = (msg, data, code, recordsTotal, recordsFiltered, tokenization) => ({
  status: 1,
  message: msg,
  code,
  recordsTotal,
  recordsFiltered,
  data: encryptData(tokenization, data) || null,
});
/* end */
module.exports = { successResponse, errorResponse, successResponseWithPagination }