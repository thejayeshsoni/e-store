const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/emailHelper");

exports.signUp = BigPromise(async (req, res, next) => {
    if (!req.files) {
        return next(new CustomError("Photo is required for sign up", 400));
    };

    const { name, email, password } = req.body;

    if (!email || !name || !password) {
        return next(new CustomError("Name, email and Password are required..!!", 400));
    };

    let file = req.files.photo;
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "t-shirt-store-users",
        width: 150,
        crop: "scale"
    });
    const user = await User.create({ name, email, password, photo: { id: result.public_id, secure_url: result.secure_url } });
    cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
    const { email, password } = req.body;

    // check for presence of email and password
    if (!email || !password) {
        return next(new CustomError("Please provide email and password", 400));
    }

    // get user from DB
    const user = await User.findOne({ email }).select("+password");

    // if user not found in DB
    if (!user) {
        return next(new CustomError("Email or password does not match or not exist", 400));
    }

    // match the password
    const isPasswordCorrect = await user.isValidPassword(password);

    // if password does not match
    if (!isPasswordCorrect) {
        return next(new CustomError("Email or password does not match or not exist", 400));
    }

    // if all goes good and we send the token
    cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "Logout Success"
    });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // if user not found in DB
    if (!user) {
        return next(new CustomError("Email not found as Registered", 400));
    }

    // get token from user model methods
    const forgotPasswordToken = user.getForgotPasswordToken();

    // save user fields in DB
    await user.save({ validateBeforeSave: false });

    // create a URL
    const myURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotPasswordToken}`;

    // craft a message
    const message = `Copy Paste this link in your URL and hit enter \n\n ${myURL}`;

    // attempt to send an email
    try {
        await mailHelper({
            toEmail: user.email,
            subject: "Password Reser Email",
            message
        });

        // json response if email is success
        res.status(200).json({
            success: true,
            message: "Email sent successfully...!!"
        });
    } catch (error) {
        // reset user fields if things goes wrong
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new CustomError(error.message, 500));
    }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
    const token = req.params.token;

    const encryptedToken = require("crypto").createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        encryptedToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return next(new CustomError("Token is invalid or expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new CustomError("Password and confirem Password doen't match", 400));
    }

    user.password = req.body.password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    // send a json response or send TOKEN
    cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
    // req.user will be added by the middleware
    // find user by id
    const user = await User.findById(req.user.id);

    // send response and user data
    res.status(200).json({
        success: true,
        user
    });
});

exports.changePassword = BigPromise(async (req, res, next) => {
    const userId = req.user.id;

    const user = await User.findById(userId).select("+password");

    const isOldPasswordCorrect = await user.isValidPassword(req.body.oldPassword);

    if (!isOldPasswordCorrect) {
        return next(new CustomError("Old password is incorrect..!!"), 400);
    }

    user.password = req.body.password;

    await user.save();

    cookieToken(user, res);
});

// TODO : Update this function as this doesn't updating the photo of the user... 
/*
exports.updateUserDetails = BigPromise(async (req, res, next) => {

    const email = req.body.email;

    if (!email) {
        return next(new CustomError("Please provide an email", 400))
    }

    const newData = {
        name: req.body.name,
        email: email
    };

    if (req.files) {
        const user = await User.findById(req.user.id);

        const imageId = user.photo.id;

        // delete photo on cloudinary
        const resp = await cloudinary.v2.uploader.destroy(imageId);

        // upload the new photo
        const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
            folder: "t-shirt-store-users",
            width: 150,
            crop: "scale"
        });
        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }
    
    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
});
*/

exports.updateUserDetails = BigPromise(async (req, res, next) => {

    const email = req.body.email;

    if (!email) {
        return next(new CustomError("Please provide an email", 400))
    }

    const newData = {
        name: req.body.name,
        email: email,
    };

    if (req.files) {
        const user = await User.findById(req.user.id);

        const imageId = user.photo.id; // user is already found so no need of await again

        // delete photo on cloudinary
        const resp = await cloudinary.v2.uploader.destroy(imageId);

        // upload the new photo
        const result = await cloudinary.v2.uploader.upload(
            req.files.photo.tempFilePath,
            {
                folder: "t-shirt-store-users",
                width: 150,
                crop: "scale"
            }
        );

        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }

    // one check to do
    console.log(newData); // see if all three keys are present or not name, email & photo in the log

    // if the photo field is coming as undefined/null then something is wrong with cloudinary folder that you created

    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
});

exports.adminGetAllUsers = BigPromise(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
});