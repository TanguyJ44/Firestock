/* eslint-disable linebreak-style */
const nodemailer = require("nodemailer");

// Create a SMTP transporter object
const transporter = nodemailer.createTransport({
  host: "ssl0.ovh.net",
  port: 465,
  secure: true,
  auth: {
    user: "contact@firestock.fr",
    pass: "!Sysadmin44",
  },
});

/**
 * Send account confirmation link
 * @param {String} email Account user email
 * @param {String} pseudo Account user pseudo
 * @param {String} link Confirmation link
 */
function sendEmailVerification(email, pseudo, link) {
  const mailOptions = {
    from: "Firestock <contact@firestock.fr>",
    to: email,
    subject: "Validation de votre adresse e-mail - Firestock",
    html: "Bonjour " + pseudo + ",<br><br>" +
      "Cliquez sur ce lien pour valider votre adresse e-mail :<br><br>" + link +
      "<br><br>Si vous n'avez pas demandé à valider cette adresse, " +
      "vous pouvez ignorer cet e-mail." +
      "<br><br>Merci," +
      "<br>Votre équipe Firestock",
  };

  transporter.sendMail(mailOptions, function(error) {
    if (error) {
      console.log(error);
    }
  });
}

/**
 * Send account recovery link
 * @param {String} email Account user email
 * @param {String} pseudo Account user pseudo
 * @param {String} link Recovery link
 */
function sendEmailResetPassword(email, pseudo, link) {
  const mailOptions = {
    from: "Firestock <contact@firestock.fr>",
    to: email,
    subject: "Récupération de votre compte - Firestock",
    html: "Bonjour " + pseudo + ",<br><br>" +
      "Cliquez sur ce lien pour changer votre mot de passe :<br><br>" + link +
      "<br><br>Si vous n'avez pas demandé à récupérer votre mot de passe, " +
      "vous pouvez ignorer cet e-mail." +
      "<br><br>Merci," +
      "<br>Votre équipe Firestock",
  };

  transporter.sendMail(mailOptions, function(error) {
    if (error) {
      console.log(error);
    }
  });
}

// Export of the components to be used
module.exports = {
  transporter,
  sendEmailVerification,
  sendEmailResetPassword,
};
