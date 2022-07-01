const router = require("express").Router();

const { home } = require("../controllers/homeController");


// hey Router...!! you will be having a Route being defined.
router.route("/").get(home);

module.exports = router;