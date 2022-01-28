const rp = require("request-promise");

const reqOptions = (opts) => {
    return {
        method: opts.method,
        uri: opts.uri,
        qs: opts.qs,
        headers: {
            "X-CMC_PRO_API_KEY": process.env["X-CMC_PRO_API_KEY"],
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