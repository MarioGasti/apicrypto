require("dotenv").config();

const config = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    CMC_PRO_API_KEY: process.env.CMC_PRO_API_KEY,
    PORT: process.env.PORT || 3000,
};

module.exports = { config };