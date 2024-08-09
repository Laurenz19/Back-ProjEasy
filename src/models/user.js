const { DataTypes } = require('sequelize');
const db = require('../utils/database');
const bcrypt = require('bcryptjs');

const User = db.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please enter the user's last name"
            },
            notEmpty: {
                msg: "Last name cannot be empty"
            },
            len: {
                args: [3, 20],
                msg: "Last name must be between 3 and 20 characters"
            }
        }
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            notEmpty: {
                msg: "Please enter the user's first name"
            },
            len: {
                args: [3, 50],
                msg: "First name must be between 3 and 50 characters"
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "Email cannot be empty"
            },
            notNull: {
                msg: "Please enter the user's email"
            },
            isEmail: {
                args: true,
                msg: "Please enter a valid email address"
            }
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'normal'),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Role cannot be empty"
            },
            isIn: {
                args: [['admin', 'normal']],
                msg: "Role must be either 'admin' or 'normal'"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Password cannot be empty"
            },
            notNull: {
                msg: "Please enter the user's password"
            }
        }
    }
}, {
    hooks: {
        beforeCreate: async (user, options) => {
            if (user.password) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                user.password = hashedPassword;
            }
        }
    }
});

module.exports = User;
