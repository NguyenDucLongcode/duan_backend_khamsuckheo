import { patientBookingAppointments } from "../services/patientService";

const handlePatientBookingAppointments = async (req, res) => {
  try {
    let message = await patientBookingAppointments(req.body);
    res.status(200).json(message);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
export { handlePatientBookingAppointments };
