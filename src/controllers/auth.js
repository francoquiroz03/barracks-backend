const User = require("../models/user");
const Record = require("../models/record");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            console.log("err");
            console.log(err);
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

exports.signin = async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            error: "User with that emails does not exist. Please signup"
        });
    }
    if (!user.authenticate(password)) {
        return res.status(401).json({
            error: "Email and password dont match"
        });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: '7d'});

    const record = new Record({
        token: token,
        device: req.device.type.toUpperCase(),
        user: user
    });
    await record.save();
    
    res.cookie("token-7-days", token, { expire: new Date() + 604800 });
    const role = user.role;
    return res.json({token, user: {role}});
};

exports.signout = (req, res) => {
    res.clearCookie("token-7-days");
    res.json({ message: "Signout success" });
};

exports.requireSignIn = async(req, res, next) => {

    const token = req.headers['authorization'];

    const recordUser = await Record.findOne({}, {'token': token}).select('user');

    const recordToken = await Record.findOne({}, 
        {'user': recordUser.user})
        .select('_id createdAt token')
        .sort({'createdAt':-1});

    if(recordToken.token !== token){
        return res.status(401).json({
            error: errorHandler('Session Finish')
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {      
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        } else {
            req.decoded = decoded;
            next();
        }
    });
}

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            err: "Access denied"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === "USER_ROLE") {
        return res.status(403).json({
            error: "Admin resource! Access denied"
        });
    }
    next();
};