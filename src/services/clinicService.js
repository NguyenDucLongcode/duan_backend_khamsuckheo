import db from "../models/index";

const createClinic = async (data) => {
  console.log(">> >check data", data);
  try {
    if (
      !data.name ||
      !data.address ||
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
    await db.Clinic.create({
      name: data.name,
      address: data.address,
      image: imageBuffer,
      descriptionHTML: data.descriptionHTML,
      descriptionMarkdown: data.descriptionMarkdown,
    });
    return {
      errCode: 0,
      message: "Create new clinic successfully",
    };
  } catch (error) {
    console.error("Error in postCreateDoctorSchedule:", error);
    throw error;
  }
};

const getAllClinic = async () => {
  try {
    let clinics = await db.Clinic.findAll();

    clinics = clinics.map((item) => {
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
      message: "Get all clinic successfully",
      data: clinics,
    };
  } catch (error) {
    console.error("Error in getAllSpecialists:", error);
    throw error;
  }
};

export { createClinic, getAllClinic };
