import { RESPONSE_CODES } from "../../config/constants";
const validator = async (data, schema) => {
  try {
    await schema.validateAsync(data, { abortEarly: true });
    return {
      isError: false,
      errors: [],
    };
  } catch (error) {
    return {
      isError: true,
      errors: error,
    };
  }
};
function schemaValidator(schema) {
  /* schema for check validation */
  return [
    async (req, res, next) => {
      // const decryptedData = await decryptData(req);
      // const { password } = req;
      const CommonMessages = req.CommonMessages.schemaValidator

      const { isError, errors } = await validator(req.body, schema);
      let getError = errors.toString("");
      let errorMessages = getError.split(": ")[1];
      if (isError) {
        return res.json({
          status: 0,
          message: CommonMessages[errorMessages],
          code: RESPONSE_CODES.BAD_REQUEST,
        });
      }
      return next();
    },
  ];
}

module.exports = schemaValidator;