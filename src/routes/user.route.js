const { Router } = require("express");
const router = Router();
const userController = require("../controllers/user.controller");
const { authenticateToken } = require("../middleware/authentication");


router.get('/users', authenticateToken, userController.getAllUsers);
router.get('/users/:id', authenticateToken, userController.getUser);
router.patch("/users/:id", authenticateToken, userController.updateUser);
router.delete('/users/:id', userController.deleteUser);


router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", authenticateToken, userController.logout);
router.get("/refreshToken", authenticateToken, userController.refreshToken);

module.exports = router;
