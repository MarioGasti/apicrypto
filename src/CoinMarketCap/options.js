const rp = require("request-promise");
const config = require("../../config.json");

const reqOptions = (opts) => {
    return {
        method: opts.method,
        uri: opts.uri,
        qs: opts.qs,
        headers: {
            "X-CMC_PRO_API_KEY": config["X-CMC_PRO_API_KEY"],
        },
        json: true,
        gzip: true,
    };
};

exports.sendReq = async(opts) => {
    return new Promise((resolve, reject) => {
        rp(reqOptions(opts))
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
    });
};