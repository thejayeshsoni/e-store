const User = require("../models/user");
const BigPromise = require("./bigPromise");
const CustomErros = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ", '');

    if (!token) {
        return next(new CustomErros("Login first to acess this page..!!", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
});

exports.customRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new CustomErros("You're Not allowed for this Resource", 403));
        }
        next();
    };
};