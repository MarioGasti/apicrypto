const axios = require("axios");
const config = require("../../config").config;

const reqOptions = (opts) => {
    return {
        method: opts.method,
        url: opts.uri,
        params: opts.qs,
        headers: {
            "X-CMC_PRO_API_KEY": config["X-CMC_PRO_API_KEY"],
        },
    };
};

exports.sendReq = async(opts) => {
    return new Promise((resolve, reject) => {
        axios(reqOptions(opts))
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
    });
};