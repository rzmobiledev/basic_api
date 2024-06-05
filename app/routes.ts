import express from "express";
const router = express.Router();

// import controller
const UserRoutes = require("../controllers/users");

// index

router.get("/user", UserRoutes.list);
router.post("/user", UserRoutes.addUser);
router.put("/user/:id", UserRoutes.changeUser);
router.get("/user/:id", UserRoutes.getById);
router.post("/login", UserRoutes.login);

export default router;