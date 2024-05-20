const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Подключаем модель пользователя
const Building = require("../models/Building"); // Подключаем модель пользователя
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const router = express.Router();

// Получение списка всех пользователей
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "firstName",
        "lastName",
        "department",
        "role",
        "salary",
      ], // Выбор нужных полей
    });
    res.json(users);
  } catch (error) {
    console.error("Ошибка при получении списка пользователей:", error);
    res.status(500).send("Ошибка сервера при получении списка пользователей");
  }
});

// Получение всех пользователей, связанных с определенным зданием
router.get("/building/:buildingId", async (req, res) => {
  try {
    const { buildingId } = req.params;
    const users = await User.findAll({
      include: [
        {
          model: Building,
          where: { id: buildingId },
          through: { attributes: [] }, 
        },
      ],
      attributes: [
        "id",
        "username",
        "firstName",
        "lastName",
        "email",
        "role",
        "department",
      ],
    });
    res.json(users);
  } catch (error) {
    console.error("Ошибка при получении пользователей здания:", error);
    res.status(500).send("Ошибка сервера при получении пользователей здания");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const newPasswordHash = await bcrypt.hash(password, saltRounds);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Здесь можете генерировать JWT или выполнять другие действия для аутентификации пользователя
    const token = jwt.sign({ userId: user.id }, "your_secret_key", {
      expiresIn: "1h",
    });
    res.json({ token, role: user.role, id: user.id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login process" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role, firstName, lastName, department } =
      req.body;

    // Проверка наличия пользователя с таким же username или email
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Создание нового пользователя с хешированным паролем и новыми полями
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      department,
    });
    res.json({
      message: "User created successfully",
      userId: user.id,
      role: user.role,
      department: user.department,
    }); // Возвращаем ID пользователя, роль и отдел
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Получаем userId из параметров маршрута
    const user = await User.findByPk(userId); // Ищем пользователя в базе данных по primaryKey

    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName, // Убедитесь, что эти поля существуют в вашей модели
        lastName: user.lastName,
        department: user.department,
        // Добавьте другие поля, которые хотите вернуть
      });
    } else {
      res.status(404).send("User not found"); // Если пользователь не найден, отправляем 404
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email, department, role, salary, username } =
    req.body;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Обновляем пользователя
    await user.update({
      firstName,
      lastName,
      email,
      department,
      role,
      salary,
      username,
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        role: user.role,
        salary: user.salary,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
