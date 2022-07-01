const router = require("express").Router();
const { signUp, login, logout, forgotPassword, passwordReset, getLoggedInUserDetails, changePassword, updateUserDetails, adminGetAllUsers } = require("../controllers/userController");
const { isLoggedIn } = require("../middlewares/user");

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").post(isLoggedIn, changePassword);
// This route is not giving desired output so please fix it...
router.route("/userdashboard/update").patch(isLoggedIn, updateUserDetails);

router.route("/admin/users").get(isLoggedIn, adminGetAllUsers);

module.exports = router;