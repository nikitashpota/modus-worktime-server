const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/User");
const Building = require("./models/Building");
const UserBuilding = require("./models/UserBuilding");
const UserSection = require("./models/UserSection");
const ProjectSection = require("./models/ProjectSection");
const WorkTimeLog = require("./models/WorkTimeLog");
const Milestone = require("./models/Milestone");
const buildingsRouter = require("./routes/buildings");
const userRoutes = require("./routes/users");
const userBuildingsRouter = require("./routes/userBuildings");
const workTimeLogsRouter = require("./routes/workTimeLogs");
const sectionsRouter = require("./routes/sections");
const milestonesRouter = require("./routes/milestones");

const sequelize = require("./config/database");
const cors = require("cors");

const app = express();
app.use(express.json());
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use(cors());
app.use(express.json());

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
// Настройка связей для UserSection

UserSection.belongsTo(User, { foreignKey: "userId", as: "user" });
UserSection.belongsTo(ProjectSection, {
  foreignKey: "sectionId",
  as: "section",
});

User.hasMany(UserSection, { foreignKey: "userId", as: "userSections" });
ProjectSection.hasMany(UserSection, {
  foreignKey: "sectionId",
  as: "sectionUsers",
});

User.belongsToMany(ProjectSection, {
  through: UserSection,
  foreignKey: "userId",
  otherKey: "sectionId",
});
ProjectSection.belongsToMany(User, {
  through: UserSection,
  foreignKey: "sectionId",
  otherKey: "userId",
});

ProjectSection.hasMany(WorkTimeLog, { foreignKey: "sectionId" });
WorkTimeLog.belongsTo(ProjectSection, { foreignKey: "sectionId" });

// Ассоциируем ProjectSection с Building для доступа из UserSection
ProjectSection.belongsTo(Building, {
  foreignKey: "buildingId",
  as: "building",
});

Building.hasMany(Milestone, { foreignKey: "buildingId" });
Milestone.belongsTo(Building, { foreignKey: "buildingId" });

// Регистрация маршрутов
app.use("/users", userRoutes);
app.use("/buildings", buildingsRouter);
app.use("/userBuildings", userBuildingsRouter);
app.use("/workTimeLogs", workTimeLogsRouter);
app.use("/sections", sectionsRouter);
app.use("/milestones", milestonesRouter);

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
