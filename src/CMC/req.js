const rp = require('request-promise');

const conn = require('./options').reqOptions;

exports.test = (req, res) => {
    rp(conn).then(response => {
        res.status(200).json(response);
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
}