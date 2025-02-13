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
          as: "positionData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.AllCode, // Truy cập trực tiếp từ db
          as: "roleData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Doctor_infor, // Truy cập trực tiếp từ db
          as: "infoSpecialistData",
          attributes: ["specialistId", "clinicId"],
          include: [
            {
              model: db.Specialist, // Truy cập bảng Specialist
              as: "specialistData",
              attributes: ["name"],
            },
          ],
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

    //  update markdown
    let checkMarkdown = await db.Markdown.findOne({
      where: { doctorId: data.doctorId },
    });

    if (checkMarkdown) {
      await db.Markdown.update(
        {
          contentHTML: data.contentHTML,
          contentMarkdown: data.contentMarkdown,
          description: data.description,
          doctorId: data.doctorId,
          specialistId: data.specialistId,
          clinicId: data.clinicId,
        },
        {
          where: { doctorId: data.doctorId },
        }
      );
      return {
        errCode: 0,
        message: "Update information doctor successfully",
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

const postCreateDoctorSchedule = async (data) => {
  try {
    let checkSchedule = await db.Schedule.findOne({
      where: { doctorId: data[0]?.doctorId, date: data[0]?.date },
    });
    if (checkSchedule) {
      console.log("check destroy");
      await db.Schedule.destroy({
        where: { doctorId: data[0]?.doctorId, date: data[0]?.date },
      });
    }

    // Sau khi lọc, thực hiện bulkCreate
    await db.Schedule.bulkCreate(data, {
      ignoreDuplicates: true,
      logging: console.log,
    });

    return {
      errCode: 0,
      message: "Create doctor schedule successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error in postCreateDoctorSchedule:", error);
    throw error;
  }
};

const getDoctorScheduleById = async (doctorId, scheduleDate) => {
  try {
    if (!doctorId || !scheduleDate) {
      return {
        errCode: 1,
        message: "Please select a doctor and scheduleDate",
      };
    }
    let schedule = await db.Schedule.findAll({
      where: { doctorId: doctorId, date: scheduleDate },
      raw: true,
      nest: true, // để nhóm các key giống nhau thành 1 object
      include: [
        {
          model: db.AllCode, // Truy cập trực tiếp từ db
          as: "timeTypeValue", // Sử dụng alias đã đặt
          attributes: ["valueEn", "valueVi"], // Chỉ lấy các cột cần thiết
        },
      ],
    });
    return {
      errCode: 0,
      message: "Get doctor schedule by id successfully",
      data: schedule,
    };
  } catch (error) {
    console.error("Error in getDoctorScheduleById:", error);
    throw error;
  }
};

const addTableDoctorInfo = async (data) => {
  // check id
  if (!data.doctorId) {
    return {
      errCode: 1,
      message: "Please select doctorId",
    };
  }
  // validate data
  if (
    !data.priceId ||
    !data.provinceId ||
    !data.paymentId ||
    !data.addressClinic ||
    !data.nameClinic ||
    !data.note ||
    !data.specialistId
  ) {
    return {
      errCode: 1,
      message: "Please input all required fields",
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

  //  update table Doctor_info
  let checkDataInTable = await db.Doctor_infor.findOne({
    where: { doctorId: data.doctorId },
  });

  if (checkDataInTable) {
    await db.Doctor_infor.update(
      {
        priceId: data.priceId,
        provinceId: data.provinceId,
        specialistId: data.specialistId,
        clinicId: data.clinicId,
        paymentId: data.paymentId,
        addressClinic: data.addressClinic,
        nameClinic: data.nameClinic,
        note: data.note,
      },
      {
        where: { doctorId: data.doctorId },
      }
    );
    return {
      errCode: 0,
      message: "Update information doctor successfully",
    };
  }

  // create
  try {
    await db.Doctor_infor.create({
      doctorId: data.doctorId,
      priceId: data.priceId,
      specialistId: data.specialistId,
      clinicId: data.clinicId,
      provinceId: data.provinceId,
      paymentId: data.paymentId,
      addressClinic: data.addressClinic,
      nameClinic: data.nameClinic,
      note: data.note,
    });
    return {
      errCode: 0,
      message: "Add table doctor info successfully",
    };
  } catch (error) {
    console.error("Error in addTableDoctorInfo:", error);
    throw error;
  }
};

const getTableDoctorInfor = async (doctorId) => {
  try {
    if (!doctorId) {
      return {
        errCode: 1,
        message: "Please choose  doctorId ",
      };
    }
    let doctorInfor = await db.Doctor_infor.findOne({
      where: { doctorId: doctorId },
      raw: true,
      nest: true,
      include: [
        {
          model: db.AllCode,
          as: "pricedData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.AllCode,
          as: "provinceData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.AllCode,
          as: "paymentData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
    });
    return {
      errCode: 0,
      message: "Get table doctor infor successfully",
      data: doctorInfor,
    };
  } catch (error) {
    console.error("Error in getTableDoctorInfor:", error);
    throw error;
  }
};

export {
  getTopDoctor,
  getAllDoctor,
  addInforDoctor,
  getDoctorById,
  postCreateDoctorSchedule,
  getDoctorScheduleById,
  addTableDoctorInfo,
  getTableDoctorInfor,
};
