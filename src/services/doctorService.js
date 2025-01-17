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

const getAllDoctor = async () => {
  try {
    let users = await db.User.findAll({
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
    console.log(">>> ", users);
    return {
      errCode: 0,
      message: "Get All doctors successfully",
      data: users,
    };
  } catch (error) {
    console.error("Error in getAllDoctor:", error);
    throw error;
  }
};

const addInforDoctor = async (data) => {
  try {
    // validate id
    if (!data.doctorId) {
      return {
        errCode: 1,
        message: "Please select a doctor ",
      };
    }
    // check id doctor
    let checkId = await db.User.findOne({
      where: { id: data.doctorId },
    });
    if (!checkId) {
      return {
        errCode: 1,
        message: "Doctor not found! Please try again.",
      };
    }
    // update
    // if (checkId) {
    //   await db.Markdown.update(
    //     {
    //       contentHTML: data.contentHTML,
    //       contentMarkdown: data.contentMarkdown,
    //       description: data.description,
    //       doctorId: data.doctorId,
    //       specialistId: data.specialistId,
    //       clinicId: data.clinicId,
    //     },
    //     {
    //       where: { doctorId: data.doctorId },
    //     }
    //   );
    //   return(
    //     errCode: 0,
    //     message: "Update information doctor successfully",
    //   )
    // }
    // check markdown
    let checkMarkdown = await db.Markdown.findOne({
      where: { doctorId: data.doctorId },
    });

    if (checkMarkdown) {
      return {
        errCode: 1,
        message:
          "Information of this doctor has already been added! Please try again.",
      };
    }

    let res = await db.Markdown.create({
      contentHTML: data.contentHTML,
      contentMarkdown: data.contentMarkdown,
      description: data.description,
      doctorId: data.doctorId,
      specialistId: data.specialistId,
      clinicId: data.clinicId,
    });
    return {
      errCode: 0,
      message: "Add information doctor successfully",
    };
  } catch (error) {
    console.error("Error in add Information Doctor:", error);
    throw error;
  }
};

const getDoctorById = async (doctorId) => {
  try {
    if (!doctorId) {
      return {
        errCode: 1,
        message: "Please select a doctor ",
      };
    }
    let user = await db.User.findOne({
      where: { id: doctorId },
      raw: true,
      nest: true,
      attributes: { exclude: ["password"] },
      include: [
        {
          model: db.AllCode,
          as: "positionData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.AllCode,
          as: "roleData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Markdown,
          as: "MarkdownData",
          attributes: ["contentHTML", "contentMarkdown", "description"],
        },
      ],
    });
    // cover type buffer to base64
    user.image = user.image
      ? `data:image/jpeg;base64,${user.image.toString("base64")}`
      : null;

    return {
      errCode: 0,
      message: "Get doctor by id successfully",
      data: user,
    };
  } catch (error) {
    console.error("Error in getDoctorById:", error);
    throw error;
  }
};

export { getTopDoctor, getAllDoctor, addInforDoctor, getDoctorById };
