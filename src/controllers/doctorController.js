import {
  getTopDoctor,
  getAllDoctor,
  addInforDoctor,
  getDoctorById,
} from "../services/doctorService";

const handleGetTopDoctor = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) {
    limit = 10;
  }
  try {
    let message = await getTopDoctor(+limit);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

const handleGetAllDoctor = async (req, res) => {
  try {
    let message = await getAllDoctor();
    res.status(200).json(message);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

const handleAddInforDoctor = async (req, res) => {
  try {
    let message = await addInforDoctor(req.body);
    res.status(200).json(message);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

const handleGetDoctorById = async (req, res) => {
  try {
    let message = await getDoctorById(req.query.id);
    res.status(200).json(message);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

export {
  handleGetTopDoctor,
  handleGetAllDoctor,
  handleAddInforDoctor,
  handleGetDoctorById,
};
