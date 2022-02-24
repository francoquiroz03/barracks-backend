const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
const {dbEmpty} = require("./helpers/data");
const device = require('express-device');
require("dotenv").config();

(async()=>{
    const authRoutes = require("./routes/auth");
    const userRoutes = require("./routes/user");
    const movieRoutes = require("./routes/movie");
    const recordRoutes = require("./routes/record");

    const app = express();

    await mongoose
        .connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
        .then(() => console.log("DB Connected"))
        .catch((error) => console.error(error));

    app.use(morgan("dev"));
    app.use(bodyParser.json({limit: '100mb'}));
    app.use(cookieParser());
    app.use(expressValidator());
    app.use(device.capture());
    app.use(cors());

    app.use("/api", authRoutes);
    app.use("/api", userRoutes);
    app.use("/api", movieRoutes);
    app.use("/api", recordRoutes);

    const port = process.env.PORT || 8000;

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    dbEmpty();

})();