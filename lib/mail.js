let nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  port: process.env.SMTP_PORT,
  host: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  secure: true,
  tls: { rejectUnauthorized: false },
});

const sendEmail = async (team, data, all = false) => {
  const mailData = {
    from: `Fantalcio Bravetta ${process.env.SMTP_USER}@gmail.com`,
    to: team.email,
    subject: all ? `Rose Squadre` : `Rosa Squadra ${team.name}`,
    text: `Salve ${team.president}, in allegato ${
      all ? "le Rose delle squadre" : "la Rosa della tua squadra"
    }`,
    attachments: {
      filename: all ? "Rose Squadre.xlsx" : `${team.name}.xlsx`,
      content: data,
    },
  };

  let result = await transporter.sendMail(mailData);
};

export { sendEmail };

export default sendEmail;
