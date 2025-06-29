import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Rao,s Group <raosgroup@resend.dev>", // ✅ Recommended format for 'from'
      to: sendTo,
      subject: subject,
      html: html,
    });

    if (error) {
      console.log("Error sending email:", error);
      return null;
    }

    return data;

  } catch (err) {
    console.log("Unexpected error while sending email:", err);
    return null;
  }
};
