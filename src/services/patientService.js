import db from "../models/index";
import { sendSimpleEmail } from "./emailService";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

const UrlEmail = (token, doctorId) => {
  let result = `${process.env.POST_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

const patientBookingAppointments = async (data) => {
  try {
    // check email
    if (!data.email) {
      return {
        errCode: 1,
        message: "Please choose email",
      };
    }

    if (!data.doctorId || !data.timeType || !data.date) {
      return {
        errCode: 1,
        message: "Missing parameter",
      };
    }

    let token = uuidv4();
    sendSimpleEmail({
      receiverEmail: data.email,
      patientName: data.fullName,
      time: `${data.time}-${data.dateLabel}-${data.dateString}`,
      doctorName: data.doctorName,
      redirectLink: UrlEmail(token, data.doctorId),
    });

    // upsert
    const [user] = await db.User.findOrCreate({
      where: { email: data.email },
      defaults: {
        email: data.email,
        roleId: "R3",
      },
      raw: true,
    });

    // create appointment
    if (user) {
      await db.Booking.create({
        statusId: "S1",
        doctorId: data.doctorId,
        patientId: user.id,
        date: data.date,
        timeType: data.timeType,
        tokens: token,
      });
    }
    return {
      errCode: 0,
      message: "Booking appointment successfully",
    };
  } catch (error) {
    console.error("Error in patientBookingAppointments:", error);
    throw error;
  }
};

const verifyBookingAppointments = async (data) => {
  try {
    if (!data.token || !data.doctorId) {
      return {
        errCode: 1,
        message: "Missing parameters",
      };
    }
    let checkParameter = await db.Booking.findOne({
      where: {
        tokens: data.token,
        doctorId: data.doctorId,
      },
    });

    if (!checkParameter) {
      return {
        errCode: 3,
        message: "Token or doctor doctorId not found",
      };
    }

    let appointment = await db.Booking.findOne({
      where: {
        tokens: data.token,
        doctorId: data.doctorId,
        statusId: "S1",
      },
      raw: false,
    });

    if (appointment) {
      appointment.statusId = "S2";
      await appointment.save();
      return {
        errCode: 0,
        message: "Booking appointment successfully",
      };
    } else {
      return {
        errCode: 2,
        message: "Appointment has been activated or dose not exist",
      };
    }
  } catch (error) {
    console.error("Error in verifyBookingAppointments:", error);
    throw error;
  }
};

export { patientBookingAppointments, verifyBookingAppointments };
