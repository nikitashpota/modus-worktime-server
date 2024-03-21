const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/User"); // Подключаем модель пользователя
const Building = require("./models/Building");
const UserBuilding = require("./models/UserBuilding");
const buildingsRouter = require("./routes/buildings");
const userRoutes = require("./routes/users");
const userBuildingsRouter = require("./routes/userBuildings");
const workTimeLogsRouter = require("./routes/workTimeLogs");
// const bcrypt = require("bcryptjs"); // Для хеширования паролей
// const saltRounds = 10;

const sequelize = require("./config/database");
// const { Op } = require("sequelize");
const cors = require("cors");
// const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Синхронизация с базой данных
sequelize.sync().then(() => console.log("DB is ready"));

User.belongsToMany(Building, {
  through: UserBuilding,
  foreignKey: "userId", // Явно указываем, какое поле использовать в UserBuilding для пользователя
  otherKey: "buildingId", // Явно указываем, какое поле использовать в UserBuilding для здания
});
Building.belongsToMany(User, {
  through: UserBuilding,
  foreignKey: "buildingId", // То же самое для обратной связи
  otherKey: "userId",
});

UserBuilding.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

UserBuilding.belongsTo(Building, {
  foreignKey: "buildingId",
  as: "building",
});

Building.hasMany(UserBuilding, {
  foreignKey: "buildingId",
  as: "userBuildings",
});
User.hasMany(UserBuilding, { foreignKey: "userId", as: "userBuildings" });

// Регистрация маршрутов
app.use("/users", userRoutes);
app.use("/buildings", buildingsRouter);
app.use("/userBuildings", userBuildingsRouter);
app.use("/workTimeLogs", workTimeLogsRouter);
// app.listen(port, () => console.log(`Server running on port ${port}`));

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("DB is synchronized");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to synchronize DB:", error);
  });
