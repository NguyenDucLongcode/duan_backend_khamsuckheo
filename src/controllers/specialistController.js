import {
  createNewSpecialist,
  getAllSpecialists,
  getDoctorByIdSpecialist,
  getSpecialistsById,
} from "../services/specialistService";

const handleCreateNewSpecialist = async (req, res) => {
  try {
    let message = await createNewSpecialist(req.body);
    res.status(200).json(message);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

const handleGetAllSpecialists = async (req, res) => {
  try {
    let message = await getAllSpecialists();
    res.status(200).json(message);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

const handleGetDoctorByIdSpecialist = async (req, res) => {
  try {
    let message = await getDoctorByIdSpecialist(req.query.id, req.query.type);
    res.status(200).json(message);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

const handleGetSpecialistsById = async (req, res) => {
  try {
    let message = await getSpecialistsById(req.query.id);
    res.status(200).json(message);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

export {
  handleCreateNewSpecialist,
  handleGetAllSpecialists,
  handleGetDoctorByIdSpecialist,
  handleGetSpecialistsById,
};
