const axios = require('axios')
export const sendSlackMessage = async (data) => {
  await axios.post(`${process.env.SLACK_WEBHOOK_URL}`, data, {
    headers: { 'Content-Type': 'application/json' }
  })
    .then(function (response) {
      /* handle success */
      // console.log("Slack notification", response.data)
    })
    .catch(function (error) {
      /* handle error */
      // console.log(error);
    })
  return;
}
