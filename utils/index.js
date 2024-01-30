require("dotenv").config();
const nodemailer = require("nodemailer");

const ImageKit = require("imagekit");

const { USER, PASS } = process.env;
// const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
// oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

module.exports = {
  sendEmail: async (to, subject, text) => {
    try{
      const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: USER,
          pass: PASS,
        },
      });

      const mailOptions = {
        from: USER,
        to,
        subject,
        text,
      };

      await new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });
    } catch(error){
      console.log(error);
    }
  },
  imageKit:
    // eslint-disable-next-line no-new
    new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_SECRET_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    }),
};
