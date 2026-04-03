import { Medicine } from "../models/Medicine.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.utils.js";

export const addMedicine = asyncHandler(async (req, res, next) => {
  const { medicineName, avaliableStock } = req.body;

  if (!(medicineName, avaliableStock))
    return next(new ErrorHandler("all fields are required ", 500));
  const medicine = await Medicine.create({ medicineName, avaliableStock });
  return res.status(200).json({
    success: true,
    medicine,
  });
});

export const getAllMedicine = asyncHandler(async (req, res, next) => {
  const medicine = await Medicine.find();
  return res.status(200).json({
    success: true,
    medicine,
  });
});
export const getMedicineByNameOrId = asyncHandler(async (req, res, next) => {});
