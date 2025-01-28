import { createClinic, getAllClinic } from "../services/clinicService";

const handleCreateClinic = async (req, res) => {
  try {
    let message = await createClinic(req.body);
    res.status(200).json(message);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
const handleGetAllClinic = async (req, res) => {
  try {
    let message = await getAllClinic();
    res.status(200).json(message);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

export { handleCreateClinic, handleGetAllClinic };
