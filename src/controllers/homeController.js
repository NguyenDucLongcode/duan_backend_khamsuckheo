import {
  createNewUser,
  getAllUsers,
  getDataUserById,
  updateDataUser,
  deleteDataUser,
} from "../services/CRUDService";

const getHomepage = async (req, res) => {
  return res.render("homepage.ejs");
};

const getCRUD = async (req, res) => {
  return res.render("crud.ejs");
};

const postCreateUser = async (req, res) => {
  let message = await createNewUser(req.body);
  return res.send("Alo");
};

const getReadUser = async (req, res) => {
  let data = await getAllUsers();
  return res.render("displayCRUD.ejs", { data: data });
};

const getUserById = async (req, res) => {
  let userId = req.params.id;
  let data = await getDataUserById(userId);
  return res.render("editCRUD.ejs", { data: data });
};

const postEditUser = async (req, res) => {
  let data = req.body;
  await updateDataUser(data);
  res.redirect("/read-user");
};

const postDeleteUser = async (req, res) => {
  let userId = req.params.id;
  await deleteDataUser(userId);
  res.redirect("/read-user");
};

module.exports = {
  getHomepage,
  getCRUD,
  postCreateUser,
  getReadUser,
  getUserById,
  postEditUser,
  postDeleteUser,
};
