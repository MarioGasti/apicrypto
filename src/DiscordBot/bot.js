const { Client, Intents, MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const requests = require("../CoinMarketCap/requests");
const dolar = require("../DolarSi/service");

exports.login = (req, res) => {
    const client = new Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });
    const prefix = "-";

    client.on("message", function(message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(" ");
        const command = args.shift().toLowerCase();

        console.log(command);

        switch (command) {
            case "ping":
                const timeTaken = Date.now() - message.createdTimestamp;
                message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
                console.log(`ping detected!`);
                break;
            case "map":
                map(args.join(""))
                    .then((response) => {
                        console.log(JSON.stringify(response, null, 2));
                        if (JSON.stringify(response, null, 2).length > 2000) {
                            message.reply("Too much text. Sorry!");
                        } else message.reply(JSON.stringify(response, null, 2));
                    })
                    .catch((err) => {
                        if (JSON.stringify(err, null, 2).length > 2000) {
                            message.reply("Too much text. Sorry!");
                        } else message.reply(JSON.stringify(err, null, 2));
                    });
                break;
            case "convert":
                convert({
                        amount: args[0],
                        from: args[1],
                        to: args[2],
                    })
                    .then((response) => {
                        if (
                            `${response.data.amount} ${response.data.symbol}s = ${
                response.data.quote[args[2].toUpperCase()].price
              }`.length > 2000
                        )
                            message.reply("Too much text.");
                        else
                            message.reply(
                                `${response.data.amount} ${response.data.symbol}s = ${
                  response.data.quote[args[2].toUpperCase()].price
                }`
                            );
                    })
                    .catch((err) => {
                        if (JSON.stringify(err, null, 2).length > 2000) {
                            message.reply("Too much text. Sorry!");
                        } else message.reply(JSON.stringify(err, null, 2));
                    });
                break;
            case "usd":
                getUsd()
                    .then((result) => {
                        // message.reply(JSON.stringify(result, null, 2));

                        const exampleEmbed = new MessageEmbed()
                            .setColor("#122561")
                            .setTitle("USD to ARS")
                            // .setURL("https://www.dolarsi.com/")
                            // .setAuthor({
                            // name: "USD Bot",
                            // iconURL: "https://i.imgur.com/AfFp7pu.png",
                            // url: "https://discord.js.org",
                            // })
                            // .setDescription("USD to ARS conversion")
                            // .setThumbnail("https://i.imgur.com/AfFp7pu.png")
                            .addFields({
                                name: "Oficial",
                                value: `**Compra**: $${result.Oficial.Compra}
**Venta**: $${result.Oficial.Venta}`,
                            }, {
                                name: "Blue",
                                value: `**Compra**: $${result.Blue.Compra}
**Venta**: $${result.Blue.Venta}`,
                            })
                            // .addField("Inline field title", "Some value here", true)
                            // .setImage("https://i.imgur.com/AfFp7pu.png")
                            .setTimestamp();
                        // .setFooter({
                        //     text: "Some footer text here",
                        //     iconURL: "https://i.imgur.com/AfFp7pu.png",
                        // });

                        message.reply({ embeds: [exampleEmbed] });
                    })
                    .catch((err) => {
                        message.reply(JSON.stringify(err, null, 2));
                    });
                break;
            default:
                message.reply(`What does ${command} means?`);
                break;
        }
    });
    client.login(config.BOT_TOKEN);
    res.send("Bot logged in!");
};

const map = (mapper) => {
    return new Promise((resolve, reject) => {
        requests
            .mapCrypt({
                params: {
                    mapper,
                },
            })
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const convert = (params) => {
    return new Promise((resolve, reject) => {
        requests
            .convert({
                params,
            })
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const getUsd = () => {
    return new Promise((resolve, reject) => {
        dolar
            .get()
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    });
};