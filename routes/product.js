const router = require("express").Router();
const { addProduct, getAllProduct, adminGetAllProducts, getOneProduct, adminUpdateOneProduct, adminDeleteOneProduct, addReview, deleteReview, getOnlyReviewsForOneProduct } = require("../controllers/productController");
const { isLoggedIn, customRole } = require("../middlewares/user");

// user routes
router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getOneProduct);
router.route("/review").put(isLoggedIn, addReview);
router.route("/review").delete(isLoggedIn, deleteReview);
router.route("/reviews").get(isLoggedIn, getOnlyReviewsForOneProduct);

// admin routes
router.route("/admin/product/add").post(isLoggedIn, customRole("admin"), addProduct);
router.route("/admin/products").get(isLoggedIn, customRole("admin"), adminGetAllProducts);
router.route("/admin/product/:id").patch(isLoggedIn, customRole("admin"), adminUpdateOneProduct).delete(isLoggedIn, customRole("admin"), adminDeleteOneProduct);

module.exports = router;