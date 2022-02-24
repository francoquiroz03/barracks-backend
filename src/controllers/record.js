const Record = require("../models/record");
const moment = require("moment");

exports.recordAll = async(req, res) => {

    await Record.find()
            .populate("user")
            .exec((err, records) => {
                if (err) {
                    return res.status(400).json({
                        error: "Record not found"
                    });
                }
            let data = [];
            records.map((r) => {
                data.push({
                    fecha: moment.utc(r.createdAt).format("DD/MM/YYYY "),
                    hora: moment.utc(r.createdAt).format("HH:mm:ss"),
                    dispositivo: r.device,
                    usuario: r.user.email,
                    rol: r.user.role
                });
            });
            return res.json(data);
            });
};