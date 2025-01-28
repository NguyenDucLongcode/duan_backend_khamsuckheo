import db from "../models/index";

const createNewSpecialist = async (data) => {
  try {
    if (
      !data.name ||
      !data.image ||
      !data.descriptionHTML ||
      !data.descriptionMarkdown
    ) {
      return {
        errCode: 1,
        message: "Please input all required fields",
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

    let checkNameSpecialist = await db.Specialist.findOne({
      where: { name: data.name },
    });
    if (checkNameSpecialist) {
      return {
        errCode: 3,
        message:
          "Specialist name already exists! Please create a different name.",
      };
    }
    // create specialist
    await db.Specialist.create({
      name: data.name,
      image: imageBuffer,
      descriptionHTML: data.descriptionHTML,
      descriptionMarkdown: data.descriptionMarkdown,
    });
    return {
      errCode: 0,
      message: "Create new specialist successfully",
    };
  } catch (error) {
    console.error("Error in createNewSpecialist:", error);
    throw error;
  }
};

const getAllSpecialists = async () => {
  try {
    let specialists = await db.Specialist.findAll();

    specialists = specialists.map((item) => {
      // Chuyển sang JSON thuần
      item = item.toJSON();

      return {
        ...item,
        image: item.image
          ? `data:image/jpeg;base64,${item.image.toString("base64")}`
          : null,
      };
    });

    return {
      errCode: 0,
      message: "Get all specialists successfully",
      data: specialists,
    };
  } catch (error) {
    console.error("Error in getAllSpecialists:", error);
    throw error;
  }
};

const getDoctorByIdSpecialist = async (id, type) => {
  try {
    if (!id) {
      return {
        errCode: 1,
        message: "Please choose specialistId",
      };
    }
    if (!type) {
      type = "all";
    }
    let dataDoctors;
    if (type === "all") {
      dataDoctors = await db.Doctor_infor.findAll({
        where: { specialistId: id },
      });
    } else {
      dataDoctors = await db.Doctor_infor.findAll({
        where: { specialistId: id, provinceId: type },
      });
    }

    return {
      errCode: 0,
      message: "Get doctors by specialist successfully",
      data: dataDoctors,
    };
  } catch (error) {
    console.error("Error in getDoctorByIdSpecialist:", error);
    throw error;
  }
};

const getSpecialistsById = async (specialistId) => {
  try {
    if (!specialistId) {
      return {
        errCode: 1,
        message: "Please choose specialistId",
      };
    }
    let dataSpecialist = await db.Specialist.findOne({
      where: { id: specialistId },
      raw: true,
      attributes: { exclude: ["image"] },
    });
    if (!dataSpecialist) {
      return {
        errCode: 2,
        message: "Specialist not found",
      };
    }
    return {
      errCode: 0,
      message: "Get specialist by id successfully",
      data: dataSpecialist,
    };
  } catch (error) {
    console.error("Error in getSpecialistsById:", error);
    throw error;
  }
};

export {
  createNewSpecialist,
  getAllSpecialists,
  getDoctorByIdSpecialist,
  getSpecialistsById,
};
