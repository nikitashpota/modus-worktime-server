const express = require("express");
const bodyParser = require("body-parser");
// const User = require("./models/User");
// const Building = require("./models/Building");
// const UserBuilding = require("./models/UserBuilding");
// const UserSection = require("./models/UserSection");
// const ProjectSection = require("./models/ProjectSection");
// const WorkTimeLog = require("./models/WorkTimeLog");
// const Milestone = require("./models/Milestone");
const buildingsRouter = require("./routes/buildings");
const userRoutes = require("./routes/users");
const userBuildingsRouter = require("./routes/userBuildings");
const workTimeLogsRouter = require("./routes/workTimeLogs");
const sectionsRouter = require("./routes/sections");
const milestonesRouter = require("./routes/milestones");
const setupModelAssociations = require("./associations");
const sequelize = require("./config/database");
const cors = require("cors");

const app = express();
app.use(express.json());
const port = 3000;

// Настройка ассоциаций моделей
setupModelAssociations();

app.use(bodyParser.json());
app.use(cors());

app.use(cors());
app.use(express.json());

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
