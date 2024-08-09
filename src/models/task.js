const { DataTypes } = require('sequelize');
const db = require("../utils/database");
const User = require("./user")

const Task = db.define('tasks', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Name cannot be null",
            },
            notEmpty: {
                msg: "Name cannot be empty",
            },
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('To do', 'In progress', 'Done'),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Status cannot be empty",
            },
            isIn: {
                args: [['To do', 'In progress', 'Done']],
                msg: "Status must be either 'to do', 'in progress', or 'Done'",
            }
        }
    },
    Pid_person: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: {
                msg: "Owner ID must be an integer",
            }
        }
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

User.hasMany(Task, {
    foreignKey:{
        name: 'Pid_person'
    }
});

Task.belongsTo(User, { foreignKey: 'Pid_person', as: 'owner' });

module.exports = Task;