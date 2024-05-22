const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Building = require("../models/Building");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const saltRounds = 10;
const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).send("Пользователь с таким email не найден.");
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Токен истекает через 1 час
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.msndr.net",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "nikitashpota@ya.ru", // замените на ваш 'email'
        pass: "343c497ce256bc8fe46a61940dce689d", // API ключ от Brevo
      },
    });

    const mailOptions = {
      to: email,
      from: "nikitashpota@ya.ru", // должно соответствовать подтвержденному email в Brevo
      subject: "Сброс пароля",
      text:
        `Вы получили это письмо, потому что вы (или кто-то другой) запросили сброс пароля для вашего аккаунта.\n\n` +
        `Пожалуйста, перейдите по следующей ссылке, или скопируйте ее в адресную строку вашего браузера, чтобы завершить процесс:\n\n` +
        `${process.env.CLIENT_URL}reset-password/${token}\n\n` +
        `Если вы не запрашивали это, пожалуйста, проигнорируйте это письмо и ваш пароль останется прежним.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.send("Ссылка для сброса пароля отправлена на указанный email.");
  } catch (error) {
    console.error("Ошибка при сбросе пароля:", error);
    res.status(500).send("Ошибка при отправке письма: " + error.message);
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() } // Используйте Sequelize оператор для сравнения дат
      }
    });

    if (!user) {
      return res.status(400).send("Ссылка для сброса пароля недействительна или устарела.");
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Хэшируем новый пароль
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.send("Пароль успешно изменен.");
  } catch (error) {
    console.error("Ошибка при сбросе пароля:", error);
    res.status(500).send("Внутренняя ошибка сервера.");
  }
});

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
