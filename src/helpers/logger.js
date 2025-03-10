import path from 'path';
import { API_LOG_MESSAGES, DEFAULT_ENUM } from '../../config/constants';
import { updateApilogs } from './commonFunction';
import { sendSlackMessage } from './slackNotification';
const { createLogger, transports, format } = require('winston');
/* create a custom format that sends an error message to slack */
const slackErrorFormat = format((info) => {
  if (info.level == 'error') {
    /* extract additional parameters (apiLogId and apiLogModel) */
    const additionalParams = info[Symbol.for('splat')] || [];
    const [refrenceError, apiLogId, apiLogModel] = additionalParams;
    /* get slack message */
    const slackMessage = { text: `Server: ${process.env.IS_PROD == DEFAULT_ENUM.TRUE ? "PRODUCTION" : "STAGING"} \n Message: ${info.message} \n Error: ${info.stack}` }
    /* update the apilog if apilog id exists */
    if (apiLogId) {
      /* update apilog payload */
      const updateApiLogPayload = {
        query: { id: apiLogId },
      }
      updateApiLogPayload.payload = { response: JSON.stringify(slackMessage), message: API_LOG_MESSAGES.FAILED };
      updateApilogs(updateApiLogPayload, apiLogModel)
    };
    sendSlackMessage(slackMessage);
  }
  return info;
});
/* create a logger instance */
const logger = createLogger({
  /* format provides various formatting utilities for log messages. */
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    slackErrorFormat(),
    format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} ${level}: ${message}, ${stack}`; // Define the log format
    })
  ),
  /* transports contain different types of logging mechanisms (e.g., file, console) */
  transports: [
    new transports.File({ filename: path.join(__dirname, '../../', 'logs/pichincha.error.log') }), // Log errors to a file
  ],
});
module.exports = logger