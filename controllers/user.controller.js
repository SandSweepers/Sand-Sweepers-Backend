const db = require("../models");
const User = db.user;
const Settings = db.settings;
const utils = require("../utils");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByUsername = async (req, res) => {
  try {
    const q = req.params.username;
    const users = await User.findAll({
      where: { username: { [Op.like]: "%" + q + "%" } },
    });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findOneById = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await User.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `User with id=${id} not found.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving User with id=${id}.`,
    });
  }
};
exports.signUp = async (req, res) => {
  try {
    const { name, password, username, avatar, role } = req.body;

    
    if (role && role === "ADMIN") {
      return res.status(400).send({
        message: "You cannot create an ADMIN user through this endpoint.",
      });
    }

    if (!username || !password || !role) {
      return res.status(400).send({
        message: "Email, password, and role are required!",
      });
    }


    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).send({ message: "This user already exists." });
    }


    const hashedPassword = bcrypt.hashSync(password, 10);


    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
      avatar,
      role: role || "USER", 
    });

    const userObj = utils.getCleanUser(newUser);

    return res.status(201).json({
      user: userObj,
      message: "User created successfully!",
    });
  } catch (err) {
    return res.status(500).send({ message: err.message || "Internal server error" });
  }
};

exports.promoteToAdmin = async (req, res) => {
  const userId = req.params.id;
  const currentUser = req.user;  


  if (currentUser.role !== "ADMIN") {
    return res.status(403).json({ message: "You do not have permission to perform this action." });
  }

  try {
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    if (user.role === "ADMIN") {
      return res.status(400).json({ message: "User is already an ADMIN." });
    }

    
    user.role = "ADMIN";
    await user.save();

    return res.status(200).json({ message: "User promoted to ADMIN successfully!" });
  } catch (error) {
    console.error("Error promoting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.delete = async (req, res) => {
  const deleting = await User.destroy({ where: { id: req.params.id } });
  const status = deleting ? 200 : 404;
  const message = deleting ? "User deleted" : "User not found";
  return res.status(status).json({ message: message });
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, password, name, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (username) {
      const existingUser = await User.findOne({
        where: { username, id: { [Op.ne]: id } },
      });

      if (existingUser) {
        return res.status(409).json({ message: "Email already registered." });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (name) updateData.name = name;

    if (role) updateData.role = role;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const [updated] = await User.update(updateData, { where: { id } });

    if (updated) {
      const updatedUser = await User.findByPk(id);

      return res.status(200).json({
        message: "User updated!",
        updatedUserClean,
        loggedUser: req.session.user,
      });
    } else {
      return res.status(400).json({ message: "No changes were made." });
    }
  } catch (error) {
    console.error("Update error:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while editing the user" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateOwnPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
