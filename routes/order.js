const router = require("express").Router();
const { isLoggedIn, customRole } = require("../middlewares/user");
const { createOrder, getOneOrder, getLoggedInOrders, adminGetAllOrders, adminUpdateOrder, adminDeleteOneOrder } = require("../controllers/orderController");

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, getOneOrder);
router.route("/myorders").get(isLoggedIn, getLoggedInOrders);

// admin Routes
router.route("/admin/orders").get(isLoggedIn, customRole("admin"), adminGetAllOrders);
router.route("/admin/order/:id").put(isLoggedIn, customRole("admin"), adminUpdateOrder).delete(isLoggedIn, customRole("admin"), adminDeleteOneOrder);

module.exports = router;