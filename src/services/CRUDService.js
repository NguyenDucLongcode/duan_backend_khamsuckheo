import bcrypt from "bcrypt";
import db from "../models/index";

const createNewUser = async (data) => {
  try {
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
    return { message: "User created successfully!" };
  } catch (error) {
    throw error;
  }
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const getAllUsers = async () => {
  try {
    return await db.User.findAll({ raw: true });
  } catch (error) {
    throw error;
  }
};

const getDataUserById = async (userId) => {
  try {
    return await db.User.findOne({
      where: { id: userId },
      raw: true,
    });
  } catch (error) {
    throw error;
  }
};

const updateDataUser = async (data) => {
  try {
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
    return "Updated successfully";
  } catch (error) {
    throw error;
  }
};

const deleteDataUser = async (userId) => {
  await db.User.destroy({
    where: {
      id: userId,
    },
  });
};

module.exports = {
  createNewUser,
  getAllUsers,
  getDataUserById,
  updateDataUser,
  deleteDataUser,
};
