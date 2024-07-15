const express = require("express");
const bodyParser = require("body-parser");
const buildingsRouter = require("./routes/buildings");
const userRoutes = require("./routes/users");
const userBuildingsRouter = require("./routes/userBuildings");
const workTimeLogsRouter = require("./routes/workTimeLogs");
const sectionsRouter = require("./routes/sections");
const milestonesRouter = require("./routes/milestones");
const subcontractorsRouter = require("./routes/subcontractors");
const setupModelAssociations = require("./associations");
const sequelize = require("./config/database");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
const port = 3000;

// Настройка ассоциаций моделей
setupModelAssociations();

app.use(bodyParser.json());
app.use(cors());

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// Регистрация маршрутов
app.use("/users", userRoutes);
app.use("/buildings", buildingsRouter);
app.use("/userBuildings", userBuildingsRouter);
app.use("/workTimeLogs", workTimeLogsRouter);
app.use("/sections", sectionsRouter);
app.use("/milestones", milestonesRouter);
app.use("/subcontractors", subcontractorsRouter);


// Импорт и запуск cron job
require('./jobs/checkAndSetPendingStatus');

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
