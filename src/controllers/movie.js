const Movie = require("../models/movie");
const path = require("path");
const fs = require("fs");

exports.list = async(req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 15;

    await Movie.find()
        .sort([
            [sortBy, order]
        ])
        .limit(limit)
        .exec((err, movies) => {
            if (err) {
                return res.status(400).json({
                    error: "Movies not found"
                });
            }
            let data = [];
            movies.map((m) => {
                const bitmap = fs.readFileSync(path.resolve(__dirname, '../../data', m.photo));
                data.push({
                    title: m.title,
                    link: m.link,
                    photo: `${new Buffer.from(bitmap).toString('base64')}`
                });
            });
            return res.json(data);
        });
};

exports.create = (req, res) => {
    const movie = new Movie(req.body);
    movie.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        return res.json({ data });
    });
};