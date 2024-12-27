import db from "../models/index";

const getHomepage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    res.render("homepage.ejs", { data: JSON.stringify(data) });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getHomepage,
};
