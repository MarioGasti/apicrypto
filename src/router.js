const express = require("express");
const router = express.Router();

const coinMarketCap = require("./CoinMarketCap/requests");
const discordBot = require("./DiscordBot/bot");
const dolarSi = require("./DolarSi/service");

router.get("/crypt/getAllCurrencies", coinMarketCap.getAllCurrencies);
router.get("/crypt/mapCrypt/:mapper", coinMarketCap.mapCrypt);
router.get("/crypt/convert/:from/:to/:amount", coinMarketCap.convert);
router.get("/discordBot/login", discordBot.login);
router.get("/usd", dolarSi.get);
// router.post('/post', coinMarketCap.helloWorldPost);

module.exports = router;