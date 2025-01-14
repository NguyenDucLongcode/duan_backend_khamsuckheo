import { getTopDoctor } from "../services/doctorService";

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
export { handleGetTopDoctor };
