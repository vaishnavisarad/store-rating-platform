const adminModel = require("../models/adminModel");
const bcrypt = require("bcryptjs");

exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await adminModel.getDashboard();

    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await adminModel.createUser({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    res.status(201).json({
      message: "User Created",
      userId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStore = async (req, res) => {
  try {
    const storeId = await adminModel.createStore(req.body);

    res.status(201).json({
      message: "Store Created",
      storeId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await adminModel.getUsers(req.query);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await adminModel.getUserById(req.params.id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStores = async (req, res) => {
  try {
    const stores = await adminModel.getStores(req.query);

    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};