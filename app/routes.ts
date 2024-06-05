import express from "express";
const router = express.Router();

// import controller
const UserRoutes = require("../controllers/users");
const verifyToken = require("./utils").verifyToken;

// index

router.get("/user", verifyToken, UserRoutes.list);
router.post("/user", verifyToken, UserRoutes.addUser);
router.put("/user/:id", verifyToken, UserRoutes.changeUser);
router.get("/user/:id", verifyToken, UserRoutes.getById);
router.post("/login", UserRoutes.login);

export default router;