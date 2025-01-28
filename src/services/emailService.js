const nodemailer = require("nodemailer");
import "dotenv/config";

const sendSimpleEmail = async (dataSend) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // sử dụng 587 cho TLS
      secure: false, // false cho 587, true nếu dùng 465
      auth: {
        user: process.env.EMAIL_APP, // địa chỉ Gmail
        pass: process.env.EMAIL_APP_PASSWORD, // App Password
      },
    });
    console.log("EMAIL_APP:", process.env.EMAIL_APP);
    console.log("EMAIL_APP_PASSWORD:", process.env.EMAIL_APP_PASSWORD);
    // Gửi email
    const info = await transporter.sendMail({
      from: `"Long handsome 👻" <${process.env.EMAIL_APP}>`, // Địa chỉ email người gửi
      to: dataSend.receiverEmail, // Danh sách email nhận
      subject: "Thông tin đặt lịch khám bệnh", // Tiêu đề email
      html: `<h3>Xin chào ${dataSend.patientName}<h3/>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online của bác sĩ long handsome</p>
      <p>Thông tin đặc lịch khám bệnh:</p>
       <div><b>Thời gian: ${dataSend.time}</b></div>
      <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
      <p>Nếu thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới
        để xác nhận và hoàn tất các thủ tục đặt lịch khám bệnh.
      </p>
      <div>
      <a href = ${dataSend.redirectLink} target="_blank">Click here</a>
      </div>
      `,
    });

    console.log("Message sent: %s", info.messageId); // Log ID email đã gửi
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Ném lỗi để xử lý bên ngoài nếu cần
  }
};

export { sendSimpleEmail };
