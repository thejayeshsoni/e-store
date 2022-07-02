const router = require("express").Router();
const { signUp, login, logout, forgotPassword, passwordReset, getLoggedInUserDetails, changePassword, updateUserDetails, adminGetAllUsers, managerGetAllUsers, adminGetOneUser, adminUpdateOneUserDetails, adminDeleteOneUser } = require("../controllers/userController");
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").post(isLoggedIn, changePassword);
router.route("/userdashboard/update").patch(isLoggedIn, updateUserDetails);

// admin only Routes
router.route("/admin/users").get(isLoggedIn, customRole("admin"), adminGetAllUsers);
router.route("/admin/user/:id").get(isLoggedIn, customRole("admin"), adminGetOneUser).patch(isLoggedIn, customRole("admin"), adminUpdateOneUserDetails).delete(isLoggedIn, customRole("admin"), adminDeleteOneUser);

// manager only Routes
router.route("/manager/users").get(isLoggedIn, customRole("manager"), managerGetAllUsers);

module.exports = router;