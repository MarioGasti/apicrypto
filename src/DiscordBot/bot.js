const { Client, Intents, MessageEmbed } = require("discord.js");
const requests = require("../CoinMarketCap/requests");
const dolar = require("../DolarSi/service");
const config = require("../../config").config;

const commandsDictionary = (command) => {
    let newCommand;
    switch (command) {
        case "c":
            newCommand = "convert";
            break;
        default:
            newCommand = command;
            break;
    }
    return newCommand;
};

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
        let command = args.shift().toLowerCase();

        command = commandsDictionary(command);

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
                        } else {
                            message.reply(JSON.stringify(response, null, 2));
                            //                         const embed = buildEmbed({
                            //                             color: "#122561",
                            //                             title: "USD to ARS",
                            //                             url: "https://www.dolarsi.com/",
                            //                             author: {
                            //                                 name: "USD Bot",
                            //                                 iconURL: "https://i.imgur.com/AfFp7pu.png",
                            //                                 url: "https://discord.js.org",
                            //                             },
                            //                             description: "USD to ARS conversion",
                            //                             thumbnail: "https://i.imgur.com/AfFp7pu.png",
                            //                             fields: [{
                            //                                     name: "Oficial",
                            //                                     value: `**Compra**: $${result.Oficial.Compra}
                            // **Venta**: $${result.Oficial.Venta}`,
                            //                                 },
                            //                                 {
                            //                                     name: "Blue",
                            //                                     value: `**Compra**: $${result.Blue.Compra}
                            // **Venta**: $${result.Blue.Venta}`,
                            //                                 },
                            //                             ],
                            //                             image: "https://i.imgur.com/AfFp7pu.png",
                            //                             footer: {
                            //                                 text: "Some footer text here",
                            //                                 iconURL: "https://i.imgur.com/AfFp7pu.png",
                            //                             },
                            //                         });
                            //                         message.reply({ embeds: [embed] });
                        }
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
                        const embed = new MessageEmbed()
                            .setColor("#FFFF00")
                            .setTitle("Conversion")
                            .addFields({
                                name: `${response.data.data.amount} ${response.data.data.symbol}s to ${args[2]}`,
                                value: `${
                  response.data.data.quote[args[2].toUpperCase()].price
                } ${args[2]}`,
                            })
                            .setTimestamp();
                        message.reply({ embeds: [embed] });
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
                        const embed = new MessageEmbed()
                            .setColor("#228B22")
                            .setTitle("USD to ARS")
                            .addFields({
                                name: "Oficial",
                                value: `**Compra**: $${result.Oficial.Compra}
**Venta**: $${result.Oficial.Venta}`,
                            }, {
                                name: "Blue",
                                value: `**Compra**: $${result.Blue.Compra}
**Venta**: $${result.Blue.Venta}`,
                            })
                            .setTimestamp();
                        message.reply({ embeds: [embed] });
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

// const embed = new MessageEmbed()
// .setColor(color)
// .setTitle(title)
// .setURL(url)
// .setAuthor(author)
// .setDescription(description)
// .setThumbnail(thumbnail)
// .addFields({})
// .setImage(image)
// .setTimestamp()
// .setFooter(footer);