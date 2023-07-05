const nodeMailer = require("nodemailer");
//create email transport
const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // options for sending mail
  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: message,
  };

  // send mail

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log(info);
  });
};

module.exports = sendEmail;
