import bcrypt from "bcrypt";
import db from "../models/index";

const handleLoginUser = async (password, email) => {
  try {
    const data = {};

    // find data user without password
    let dataUser = await db.User.findOne({
      attributes: { exclude: ["password"] },
      where: { email: email },
      raw: true,
    });

    // check email
    if (!dataUser) {
      data.errCode = 2;
      data.message = "Email not found!";
      return data;
    }

    // Fetch the hashed password for comparison
    const hashedPassword = await db.User.findOne({
      attributes: ["password"],
      where: { email: email },
      raw: true,
    });

    //compare passwords
    const comparePassword = await bcrypt.compare(
      password,
      hashedPassword.password
    );
    if (!comparePassword) {
      data.errCode = 3;
      data.message = "Password incorrect!";
      return data;
    }
    // covert image buffer to base64
    dataUser.image = dataUser.image
      ? `data:image/jpeg;base64,${dataUser.image.toString("base64")}`
      : null;

    // login success
    data.errCode = 0;
    data.message = "Login successful";
    data.user = dataUser;
    return data;
  } catch (error) {
    console.error("Error in handleLoginUser:", error);
    throw error;
  }
};

const handleGetDataAllUser = async (userId) => {
  try {
    if (userId === "ALL") {
      let users = await db.User.findAll({
        raw: true,
        attributes: { exclude: ["password"] },
      });
      // cover all fields from buffer to base64
      users = users.map((user) => ({
        ...user,
        image: user.image
          ? `data:image/jpeg;base64,${user.image.toString("base64")}`
          : null,
      }));

      return users;
    }

    const user = await db.User.findOne({
      where: { id: userId },
      raw: true,
      attributes: { exclude: ["password"] },
    });
    // cover type buffer to base64
    if (user) {
      user.image = user.image
        ? `data:image/jpeg;base64,${user.image.toString("base64")}`
        : null;
    }
    return user;
    // end code
  } catch (error) {
    console.error("Error in handleGetDataAllUser:", error);
    throw error;
  }
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
    // Kiểm tra và xử lý image (Base64)
    let imageBuffer = null;
    if (data.image) {
      const isBase64 = /^data:image\/\w+;base64,/.test(data.image);
      if (!isBase64) {
        return {
          errCode: 2,
          message: "Invalid image format! Please upload a valid Base64 image.",
        };
      }
      // Chuyển Base64 thành Buffer
      imageBuffer = Buffer.from(data.image.split(",")[1], "base64");
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
      gender: data.gender,
      roleId: data.roleId,
      positionId: data.positionId,
      image: imageBuffer,
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
    // Kiểm tra và xử lý image (Base64)
    let imageBuffer = null;
    if (data.image) {
      const isBase64 = /^data:image\/\w+;base64,/.test(data.image);
      if (!isBase64) {
        return {
          errCode: 2,
          message: "Invalid image format! Please upload a valid Base64 image.",
        };
      }
      // Chuyển Base64 thành Buffer
      imageBuffer = Buffer.from(data.image.split(",")[1], "base64");
    }
    // update user
    await db.User.update(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        image: data.image,
        roleId: data.roleId,
        positionId: data.positionId,
        image: imageBuffer,
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

const getAllCode = async (type) => {
  try {
    if (type) {
      const data = await db.AllCode.findAll({
        where: { type: type },
        raw: true,
      });
      return {
        errCode: 0,
        message: "Get all code successfully",
        data: data,
      };
    } else {
      return {
        errorCode: 1,
        message: "Type is required",
      };
    }
  } catch (error) {
    console.error("Error getting all code:", error);
    return {
      errorCode: -1,
      message:
        "An error occurred while getting all code. Please try again later.",
    };
  }
};

module.exports = {
  handleLoginUser,
  handleGetDataAllUser,
  handleDeleteDataUser,
  handleCreateDataUser,
  updateDataUser,
  getAllCode,
};
