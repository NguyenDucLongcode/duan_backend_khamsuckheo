import {
  handleLoginUser,
  handleGetDataAllUser,
  handleDeleteDataUser,
  handleCreateDataUser,
  updateDataUser,
  getAllCode,
} from "../services/userService";

const handleLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // validate input
  if (!email || !password) {
    return res.status(400).json({
      errCode: 1,
      message: "Username or password are required",
    });
  }

  let data = await handleLoginUser(password, email);
  res.status(200).json({
    errCode: data.errCode,
    message: data.message,
    user: data.user || {},
  });
};

const handleGetAllUser = async (req, res) => {
  const userId = req.query.id;
  let data = await handleGetDataAllUser(userId);
  // check data wrong id
  if (!data) {
    res.status(400).json({
      errCode: 1,
      message: "wrong Id",
      users: [],
    });
  }
  res.status(200).json({
    errCode: 0,
    message: "get user successfully",
    users: data,
  });
};

const handleDeleteUser = async (req, res) => {
  const userId = req.query.id;
  let message = await handleDeleteDataUser(userId);
  res.status(200).json(message);
};

const handleCreateUser = async (req, res) => {
  let message = await handleCreateDataUser(req.body);
  res.status(200).json(message);
};

const handleEditUser = async (req, res) => {
  try {
    let message = await updateDataUser(req.body);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleGetAllCode = async (req, res) => {
  let message = await getAllCode(req.query.type);
  res.status(200).json(message);
};

module.exports = {
  handleLogin,
  handleGetAllUser,
  handleDeleteUser,
  handleCreateUser,
  handleEditUser,
  handleGetAllCode,
};
