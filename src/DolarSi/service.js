const convert = require("xml-js");
const axios = require("axios");

getInfoDolar = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const dataDolar = await axios.get(
                "https://www.dolarsi.com/api/dolarSiInfo.xml"
            );
            const json = convert.xml2json(dataDolar.data, {
                compact: true,
                spaces: 4,
            });
            const jsonParsed = JSON.parse(json);
            resolve(jsonParsed);
        } catch (e) {
            reject(e);
        }
    });
};

exports.get = (req, res) => {
    console.log("getUSD");
    return new Promise((resolve, reject) => {
        getInfoDolar()
            .then((result) => {
                const dolar = result.cotiza.Dolar;
                const info = {
                    Oficial: {
                        Compra: dolar.casa344.compra._text,
                        Venta: dolar.casa344.venta._text,
                    },
                    Blue: {
                        Compra: dolar.casa380.compra._text,
                        Venta: dolar.casa380.venta._text,
                    },
                };
                if (res) res.send(info);
                resolve(info);
            })
            .catch((err) => {
                if (res) res.send(err);
                reject(err);
            });
    });
};