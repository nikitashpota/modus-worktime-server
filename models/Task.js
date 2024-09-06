const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define(
  "Task",
  {
    buildingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Buildings",
        key: "id",
      },
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Sections",
        key: "id",
      },
    },
    issuerId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    urgency: {
      type: DataTypes.ENUM("Обычная", "Срочная"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "Выдано",
        "Принято в работу",
        "Выполнено",
        "Проверено",
        "Закрыто"
      ),
      allowNull: false,
    },
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    acceptedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: true, // ID пользователя, который принял задачу в работу
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: true, // ID пользователя, который выполнил задачу
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    closedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: true, // ID пользователя, который закрыл задачу
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Task;
