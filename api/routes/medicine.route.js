import express from "express";
import {
  addMedicine,
  getAllMedicine,
  getMedicineByNameOrId,
} from "../controllers/medicine.controller.js";
const router = express.Router();

router.post("/add", addMedicine);
router.get("/all", getAllMedicine);
router.get("/:medicineName", getMedicineByNameOrId);
export default router;
