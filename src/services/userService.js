import bcrypt from "bcrypt";
import db from "../models/index";

const handleLoginUser = async (password, email) => {
  try {
    const data = {};

    // find data user
    let dataUser = await db.User.findOne({
      attributes: ["email", "roleId", "password"],
      where: { email: email },
      raw: true,
    });

    // check email
    if (!dataUser) {
      data.errCode = 2;
      data.message = "Email not found!";
      return data;
    }

    //compare passwords
    const comparePassword = await bcrypt.compare(password, dataUser.password);
    if (!comparePassword) {
      data.errCode = 3;
      data.message = "Password incorrect!";
      return data;
    }

    // delete password from request
    const { email: userEmail, roleId } = dataUser;

    // login success
    data.errCode = 0;
    data.message = "Login successful";
    data.user = { email: userEmail, roleId };
    return data;

    // end login
  } catch (error) {
    console.error("Error in handleLoginUser:", error);
    throw error;
  }
};

const handleGetDataAllUser = async (userId) => {
  if (userId === "ALL") {
    return await db.User.findAll({
      raw: true,
      attributes: { exclude: ["password"] },
    }); // Return all users directly
  }

  return await db.User.findOne({
    where: { id: userId },
    raw: true,
    attributes: { exclude: ["password"] },
  }); // Return the user data directly or null if not found
};

const handleDeleteDataUser = async (userId) => {
  try {
    // Check if the user exists
    let dataUser = await db.User.findOne({
      where: { id: userId },
    });

    if (!dataUser) {
      return {
        errCode: 1,
        message: "UserId not found! Please try again.",
      };
    }

    // Delete the user
    await db.User.destroy({ where: { id: userId } });
    return {
      errCode: 0,
      message: "Deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      errCode: -1,
      message:
        "An error occurred while deleting the user. Please try again later.",
    };
  }
};

const handleCreateDataUser = async (data) => {
  console.log(">> check", data);
  try {
    // check email already
    const checkFindEmail = await db.User.findOne({
      where: { email: data.email },
    });
    if (checkFindEmail) {
      return {
        errCode: 1,
        message: "Email already exists! Please choose another one.",
      };
    }
    // create user
    const hashedPassword = await hashPassword(data.password);
    await db.User.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phoneNumber: data.phoneNumber,
      gender: data.sex === 1 ? "true" : "false",
      roleId: data.role,
    });
    return {
      errCode: 0,
      message: "User created successfully!",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      errCode: -1,
      message:
        "An error occurred while create the user. Please try again later.",
    };
  }
};

// hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const updateDataUser = async (data) => {
  try {
    // check userId already
    const checkUserId = await db.User.findOne({
      where: { id: data.id },
    });
    if (!checkUserId) {
      return {
        errCode: 1,
        message: "UserId already exists! Please choose another one.",
      };
    }
    // update user
    await db.User.update(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
      },
      {
        where: { id: data.id },
        returning: true,
      }
    );
    return {
      errCode: 0,
      message: "User edit successfully!",
    };
    // end update user
  } catch (error) {
    console.error("Error editing user:", error);
    return {
      errCode: -1,
      message: "An error occurred while edit the user. Please try again later.",
    };
  }
};

module.exports = {
  handleLoginUser,
  handleGetDataAllUser,
  handleDeleteDataUser,
  handleCreateDataUser,
  updateDataUser,
};
