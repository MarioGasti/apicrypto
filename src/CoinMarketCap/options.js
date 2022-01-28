const axios = require("axios");

const reqOptions = (opts) => {
    return {
        method: opts.method,
        url: opts.uri,
        params: opts.qs,
        headers: {
            "X-CMC_PRO_API_KEY": process.env["X-CMC_PRO_API_KEY"],
        },
    };
};

exports.sendReq = async(opts) => {
    return new Promise((resolve, reject) => {
        console.log(reqOptions(opts));
        axios(reqOptions(opts))
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
    });
};