import express from "express";
import upload from "../config/multer";
import {
  handleLogin,
  handleGetAllUser,
  handleDeleteUser,
  handleCreateUser,
  handleEditUser,
  handleGetAllCode,
} from "../controllers/userController";
import {
  handleGetTopDoctor,
  handleGetAllDoctor,
  handleAddInforDoctor,
  handleGetDoctorById,
  handlePostCreateDoctorSchedule,
  handleGetDoctorScheduleById,
  handleAddTableDoctorInfo,
  handleGetTableDoctorInfor,
} from "../controllers/doctorController";

import {
  handlePatientBookingAppointments,
  handleVerifyBookingAppointments,
} from "../controllers/patientsController";

import {
  handleCreateNewSpecialist,
  handleGetAllSpecialists,
  handleGetDoctorByIdSpecialist,
  handleGetSpecialistsById,
} from "../controllers/specialistController";

import {
  handleCreateClinic,
  handleGetAllClinic,
} from "../controllers/clinicController";

const router = express.Router();
router.post("/api/v1/login", handleLogin);
router.post("/api/v1/create-user", upload.single("image"), handleCreateUser);
router.get("/api/v1/get-All-User", handleGetAllUser);
router.delete("/api/v1/delete-user", handleDeleteUser);
router.put("/api/v1/edit-user", upload.single("image"), handleEditUser);
// doctor
router.get("/api/v1/get-topDoctor", handleGetTopDoctor);
router.get("/api/v1/getAllDoctor", handleGetAllDoctor);
router.post("/api/v1/addInforDoctor", handleAddInforDoctor);
router.get("/api/v1/getDoctorById", handleGetDoctorById);
router.post("/api/v1/postCreateDoctorSchedule", handlePostCreateDoctorSchedule);
router.get("/api/v1/getDoctorScheduleById", handleGetDoctorScheduleById);

// doctor of table doctor_info
router.post("/api/v1/addTableDoctorInfo", handleAddTableDoctorInfo);
router.get("/api/v1/getTableDoctorInfor", handleGetTableDoctorInfor);

// specialist
router.post(
  "/api/v1/createNewSpecialist",
  upload.single("image"),
  handleCreateNewSpecialist
);
router.get("/api/v1/getAllSpecialists", handleGetAllSpecialists);
router.get("/api/v1/getSpecialistsById", handleGetSpecialistsById);
router.get("/api/v1/getDoctorByIdSpecialist", handleGetDoctorByIdSpecialist);

// patients
router.post(
  "/api/v1/Patient-booking-appointments",
  handlePatientBookingAppointments
);
router.post(
  "/api/v1/verify-booking-appointments",
  handleVerifyBookingAppointments
);
// clinic
router.post("/api/v1/createClinic", upload.single("image"), handleCreateClinic);
router.get("/api/v1/getAllClinic", handleGetAllClinic);

// allCode
router.get("/api/v1/get-allCode", handleGetAllCode);

export default router;
