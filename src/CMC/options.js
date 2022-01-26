exports.reqOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
    qs: {
        // 'start': '1',
        // 'limit': '5000',
        'amount': 1,
        'id': '15250',
        'convert': 'USD',
    },
    headers: {
        'X-CMC_PRO_API_KEY': 'ea915361-800e-4099-b35a-21b5eadb7ba3'
    },
    json: true,
    gzip: true
};