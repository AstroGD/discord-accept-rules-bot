/**
 * Tools js
 * @author AstroGD - https://www.astrogd.eu
 * @since 2018-07-15
 */
var scriptName = "tools.js";
const path = require("path");

module.exports = function (Discord, client, fs, dir) {
    const package = require(path.join(__dirname, "../package.json"));

    async function init() {
        let currdate = new Date();
        this.startupdate = `${currdate.getUTCFullYear()}-${currdate.getUTCMonth() + 1}-${currdate.getUTCDate()}-${currdate.getUTCHours()}-${currdate.getUTCMinutes()}-${currdate.getUTCSeconds()}`;

        await fs.ensureDirSync(`${dir}/log/`);
        this.stream = await fs.createWriteStream(`${dir}/log/${this.startupdate}.log`);

        this.initialized = true;

        this.stream.write(`[${this.startupdate}] INFO [${scriptName}] ${scriptName} V${package.version} initialized\n`);
        console.log(`[${this.startupdate}] INFO [${scriptName}] ${scriptName} V${package.version} initialized`);
    }

    function log(x, msg, state) {
        if (!this.initialized) return;

        let currdate = new Date();
        let timestampCurrent = `${currdate.getUTCFullYear()}-${currdate.getUTCMonth() + 1}-${currdate.getUTCDate()}-${currdate.getUTCHours()}-${currdate.getUTCMinutes()}-${currdate.getUTCSeconds()}`;

        switch (state) {
            case 1: //ERROR
                state = "ERROR";
                break;
            case 2: //WARN
                state = "WARN";
                break;
            default: //INFO
                state = "INFO";
                break;
        }

        let logCurrent = `[${timestampCurrent}] ${state} [${x}] ${msg}`;
        this.stream.write(logCurrent + '\n');
        console.log(logCurrent);
    }

    function logFile(x, msg, state) {
        if (!this.initialized) return;

        let currdate = new Date();
        let timestampCurrent = `${currdate.getUTCFullYear()}-${currdate.getUTCMonth() + 1}-${currdate.getUTCDate()}-${currdate.getUTCHours()}-${currdate.getUTCMinutes()}-${currdate.getUTCSeconds()}`;

        switch (state) {
            case 1: //ERROR
                state = "ERROR";
                break;
            case 2: //WARN
                state = "WARN";
                break;
            default: //INFO
                state = "INFO";
                break;
        }

        let logCurrent = `[${timestampCurrent}] ${state} [${x}] ${msg}`;
        this.stream.write(logCurrent + '\n');
    }

    async function command(cmd, _args) {
        if (!this.initialized) return;
        switch (cmd) {
            case "help":
                console.log(`===== Help Commands from Modules and Mainframe\n\n`);
                break;

            default:
                break;
        }
    }

    function isVersionLower(base, check) {
        base = base.split(".");
        check = check.split(".");

        if (check[0] < base[0]) return true;
        if (check[0] == base[0] && check[1] < base[1]) return true;
        if (check[0] == base[0] && check[1] == base[1] && check[2] < base[2]) return true;

        return false;
    }

    function makeEmbed(author, color, title, description, fields) {
        try {
            var embed = new Discord.MessageEmbed();
            embed.setColor(color)
                .setFooter(`AstroGD Discord Mainframe System V${mainframeversion}`, client.user.avatarURL)
                .setTimestamp(new Date())
                .setTitle(title)
                .setDescription(description);

            if (author) {
                embed.setAuthor(author.username, author.avatarURL);
            }

            if (fields) {
                for (var i = 0; i < fields.length; i++) {
                    if (!fields[i].inline) fields[i].inline = false;
                    if (!fields[i].empty) {
                        embed.addField(fields[i].title, fields[i].value, fields[i].inline);
                    } else {
                        embed.addField('\u200b', '\u200b', fields[i].inline);
                    }
                }
            }
            return embed;
        } catch (e) {
            throw e;
        }
    }

    function getServerVersionPack() {
        return new Promise((resolve, reject) => {
            const https = require('follow-redirects').https;

            var options = {
                'method': 'GET',
                'hostname': 'software.astrogd.eu',
                'path': '/accept-rules/version.json',
                'headers': {},
                'maxRedirects': 20
            };

            var req = https.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    resolve(body);
                });

                res.on("error", function (error) {
                    reject(error);
                });
            });

            req.end();
        });
    }

    async function checkVersion() {
        let versionInfo = null;
        try {
            versionInfo = await getServerVersionPack();
        } catch (error) {
            this.log(scriptName, `Version couldn't be checked! Make sure to allow network access to software.astrogd.eu`, 1);
            return null;
        }

        if (!versionInfo) {
            this.log(scriptName, `Version couldn't be checked! Make sure to allow network access to software.astrogd.eu`, 1);
            return null;

        }

        try {
            versionInfo = JSON.parse(versionInfo.toString());
        } catch (error) {
            this.log(scriptName, `Something went wrong while checking for a newer version. Please check the repository manually to see if there is a new version available.`, 1);
            return null;
        }

        return versionInfo;
    }

    return {
        init,
        log,
        logFile,
        command,
        makeEmbed,
        checkVersion,
        isVersionLower
    }
}