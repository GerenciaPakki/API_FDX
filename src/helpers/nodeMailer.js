const nodemailer = require('nodemailer');

function createTransporter() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tecnologia@yotraigo.com',
      pass: 'Santiago23*'
    }
  });
  return transporter;
}


module.exports = {
    createTransporter,
};