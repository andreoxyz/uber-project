const CaptainModel = require("../models/captain.model");
const CaptainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
module.exports.registerCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, vehicle } = req.body;
  const iscaptainAlreadyExists = await CaptainModel.findOne({
    email: email,
  });
  if (iscaptainAlreadyExists) {
    return res.status(400).json({ message: "Captain already exists" });
  }
  const hashPassword = await CaptainModel.hashPassword(password);
  const Captain = await CaptainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });
  const token = await Captain.generateAuthToken();
  res.status(201).json({
    message: "Captain registered successfully",
    captain: {
      _id: Captain._id,
      fullname: Captain.fullname,
      email: Captain.email,
      vehicle: Captain.vehicle,
      token,
    },
  });
};
