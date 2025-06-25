const CaptainModel = require("../models/captain.model");
const CaptainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blacklistToken = require("../models/blacklistToken.model");
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
module.exports.loginCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const Captain = await CaptainModel.findOne({ email }).select("+password");
  if (!Captain) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isMatch = await Captain.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const token = await Captain.generateAuthToken();
  res.cookie("token", token);
  res.status(200).json({
    message: "Captain logged in successfully",
    captain: {
      _id: Captain._id,
      fullname: Captain.fullname,
      email: Captain.email,
      vehicle: Captain.vehicle,
      token,
    },
  });
}

module.exports.getCaptainProfile = async (req, res) => {
  res.status(200).json({
    message: "Captain profile fetched successfully",
    captain: req.captain,
  });
};

module.exports.logoutCaptain = async (req, res) => {
  const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  await blacklistToken.create({ token });
  res.clearCookie("token");
  res.status(200).json({
    message: "Captain logged out successfully",
  });
};