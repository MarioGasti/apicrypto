const conn = require("./options").sendReq;
const cache = require("./cache");

const setOpts = (method, uri, qs) => ({
    method,
    uri,
    qs,
});

const loadCache = () => {
    return new Promise((resolve, reject) => {
        if (
            cache.data &&
            Object.keys(cache.data.data).length !== 0 &&
            Object.getPrototypeOf(cache.data) === Object.prototype
        ) {
            console.log("Retrieving from cache.");
            console.log(cache.data.data.length);
            resolve(cache.data);
        } else {
            const opts = setOpts(
                "GET",
                "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", {
                    start: "1",
                    limit: "5000",
                    convert: "USD",
                }
            );
            conn(opts)
                .then((response) => {
                    cache.data.status = response.status;
                    cache.data.data.push(...response.data);
                    const opts = setOpts(
                        "GET",
                        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", {
                            start: "5001",
                            limit: "5000",
                            convert: "USD",
                        }
                    );
                    conn(opts)
                        .then((response) => {
                            cache.data.status = response.status;
                            cache.data.data.push(...response.data);
                            resolve(cache.data);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
};

exports.convert = (req, res) => {
    return new Promise((resolve, reject) => {
        this.mapCrypt({
                params: {
                    mapper: req.params.from,
                },
            })
            .then((response) => {
                const opts = setOpts(
                    "GET",
                    "https://pro-api.coinmarketcap.com/v1/tools/price-conversion", {
                        amount: req.params.amount,
                        convert: req.params.to,
                        id: response.id,
                    }
                );
                conn(opts)
                    .then((response) => {
                        if (res) res.status(200).json(response);
                        resolve(response);
                    })
                    .catch((err) => {
                        if (res) res.status(400).json(err);
                        reject(err);
                    });
            })
            .catch((err) => {
                if (res) res.json(err);
                reject(err);
            });
    });
};

exports.mapCrypt = (req, res) => {
    return new Promise((resolve, reject) => {
        loadCache()
            .then((response) => {
                const fullRes = [];
                response.data.forEach((crypt) => {
                    if (Object.values(crypt).includes(req.params.mapper))
                        fullRes.push(crypt);
                });
                if (res)
                    fullRes.length === 1 ?
                    res.json(fullRes[0]) :
                    res.json({ list: fullRes });
                resolve(fullRes.length === 1 ? fullRes[0] : { list: fullRes });
            })
            .catch((err) => {
                if (res) res.status(400).json(err);
                reject(err);
            });
    });
};

exports.getAllCurrencies = async(req, res) => {
    loadCache()
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
};