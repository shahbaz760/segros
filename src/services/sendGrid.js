const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
/* send email */
export const sendMail = async (detail, apiLogId) => {
    sgMail.send(detail).then(
        async (res) => {
        },
        async (error) => {
            console.log('error :>> ', error);
            if (error.response) {
                console.error(error.response.body);
            }
        }
    );
};
/* end */