import db from "../models/index";

const patientBookingAppointments = async (data) => {
  try {
    // check email
    if (!data.email) {
      return {
        errCode: 1,
        message: "Please choose email",
      };
    }
    // upsert
    const [user] = await db.User.findOrCreate({
      where: { email: data.email },
      defaults: {
        email: data.email,
        roleId: "R3",
      },
      raw: true,
    });

    console.log(">> check user", user);
    // create appointment
    if (user) {
      await db.Booking.create({
        statusId: "S1",
        doctorId: data.doctorId,
        patientId: user.id,
        date: data.date,
        timeType: data.timeType,
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
export { patientBookingAppointments };
