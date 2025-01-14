import db from "../models/index";

const getTopDoctor = async (limitInput) => {
  try {
    let users = await db.User.findAll({
      limit: limitInput,
      order: [["createdAt", "DESC"]],
      where: { roleId: "R2" },
      raw: true,
      nest: true, // để nhóm các key giống nhau thành 1 object
      attributes: { exclude: ["password"] },
      include: [
        {
          model: db.AllCode, // Truy cập trực tiếp từ db
          as: "positionData", // Sử dụng alias đã đặt
          attributes: ["valueEn", "valueVi"], // Chỉ lấy các cột cần thiết
        },
        {
          model: db.AllCode, // Truy cập trực tiếp từ db
          as: "roleData", // Sử dụng alias đã đặt
          attributes: ["valueEn", "valueVi"], // Chỉ lấy các cột cần thiết
        },
      ],
    });
    // cover type buffer to base64
    users = users.map((user) => ({
      ...user,
      image: user.image
        ? `data:image/jpeg;base64,${user.image.toString("base64")}`
        : null,
    }));
    return {
      errCode: 0,
      message: "Get top doctors successfully",
      data: users,
    };
  } catch (error) {
    console.error("Error in getTopDoctor:", error);
    throw error;
  }
};
export { getTopDoctor };
