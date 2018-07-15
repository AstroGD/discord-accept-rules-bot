/**
 * Tools js
 * @version 1.0.0
 * @author AstroGD - https://www.astrogd.eu
 * @since 2018-07-15
 */
var scriptName = "tools.js",
version = "1.0.0",
mainframeMinVersion = "1.0.1";

module.exports = function (Discord, client, fs, dir, mainframeversion) {

    async function init() {
        let currdate = new Date();
        this.startupdate = `${currdate.getUTCFullYear()}-${currdate.getUTCMonth() + 1}-${currdate.getUTCDate()}-${currdate.getUTCHours()}-${currdate.getUTCMinutes()}-${currdate.getUTCSeconds()}`;

        await fs.ensureDirSync(`${dir}/log/`);
        this.stream = await fs.createWriteStream(`${dir}/log/${this.startupdate}.log`);

        let mainframeversion_check = mainframeversion.split(".");
        let mainframeversion_min = mainframeMinVersion.split(".");
        let mainframeversion_allowed = false;

        if (mainframeversion_check[0] > mainframeversion_min[0]) mainframeversion_allowed = true;
        if (mainframeversion_check[0] == mainframeversion_min[0] && mainframeversion_check[1] > mainframeversion_min[1]) mainframeversion_allowed = true;
        if (mainframeversion_check[0] == mainframeversion_min[0] && mainframeversion_check[1] == mainframeversion_min[1] && mainframeversion_check[2] > mainframeversion_min[2]) mainframeversion_allowed = true;
        if (mainframeversion_check[0] == mainframeversion_min[0] && mainframeversion_check[1] == mainframeversion_min[1] && mainframeversion_check[2] == mainframeversion_min[2]) mainframeversion_allowed = true;

        if (!mainframeversion_allowed) {
            this.stream.write(`[${scriptName}] WARN This Module requires a Mainframe Version of ${mainframeversion_min.join(".")} or higher. Please update your Mainframe. This Module is not being activated.`);
            throw new Error(`[${scriptName}] This Module requires a Mainframe Version of ${mainframeversion_min.join(".")} or higher. Please update your Mainframe. This Module is not being activated.`);
        } else {
            this.initialized = true;
        }

        this.stream.write(`[${this.startupdate}] INFO [${scriptName}] ${scriptName} V${version} initialized\n`);
        console.log(`[${this.startupdate}] INFO [${scriptName}] ${scriptName} V${version} initialized`);
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

    async function command(cmd, args) {
        if (!this.initialized) return;
        switch (cmd) {
            case "help":
                console.log(`===== Help Commands from Modules and Mainframe\n\n`);
                break;
        
            default:
                break;
        }
    }

    function checkMainframeVersion(minVersion) {
        let mainframeversion_check = mainframeversion.split(".");
        let mainframeversion_min = minVersion.split(".");
        let mainframeversion_allowed = false;

        if (mainframeversion_check[0] > mainframeversion_min[0]) mainframeversion_allowed = true;
        if (mainframeversion_check[0] == mainframeversion_min[0] && mainframeversion_check[1] > mainframeversion_min[1]) mainframeversion_allowed = true;
        if (mainframeversion_check[0] == mainframeversion_min[0] && mainframeversion_check[1] == mainframeversion_min[1] && mainframeversion_check[2] > mainframeversion_min[2]) mainframeversion_allowed = true;
        if (mainframeversion_check[0] == mainframeversion_min[0] && mainframeversion_check[1] == mainframeversion_min[1] && mainframeversion_check[2] == mainframeversion_min[2]) mainframeversion_allowed = true;

        if (!mainframeversion_allowed) {
            return false;
        } else {
            return true;
        }
    }

    function makeEmbed(author, color, title, description, fields) {
        try {
            var embed = new Discord.RichEmbed();
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
                    embed.addBlankField(fields[i].inline);
                }
            }
        }
        return embed;
        } catch (e) {
            throw e;
        }
    }

    return {
        init,
        log,
        logFile,
        command,
        checkMainframeVersion,
        makeEmbed
    }
}