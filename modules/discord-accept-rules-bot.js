/**
 * Discord Accept Rules Bot
 * @version 2.1.0
 * @author AstroGD - https://www.astrogd.eu
 * @since 2018-07-15
 */

var scriptName = "modules.discord-accept-rules-bot.js",
    version = "2.1.0",
    mainframeMinVersion = "2.0.0";

const path = require("path");

module.exports = function (client, fs, tools, dir) {

    var config;

    async function init(deactivated) {
        tools.log(scriptName, `Initializing ${scriptName} V${version}`);

        if (tools.checkMainframeVersion(mainframeMinVersion)) {
            this.initialized = true;
        } else {
            tools.log(scriptName, `This Module requires a Mainframe Version of ${mainframeMaxVersion} or higher. Please update your Mainframe. This Module is not being activated.`, 2);
            return;
        }
        if (!deactivated) {
            this.activated = true;
        }

        if (tools.isVersionLower(VERSIONINFO.packages.acceptRulesBot, version)) tools.log(scriptName, `Theres a new version available for Discord Accept Rules Module (${version} --> ${VERSIONINFO.packages.acceptRulesBot})`, 2);

        this.db = JSON.parse(fs.readFileSync(`${dir}/db/discord-accept-rules-bot.db`, "utf-8"));
        this.config = checkConfigVersion(require(`${dir}/config/discord-accept-rules-bot.json`));
        config = this.config;

        if (!await client.guilds.fetch(this.config.guildid)) {
            tools.log(scriptName, `The guild specified in the modules config was not found. Please check the config file. Verifymessage could not be sent.`, 1);
            this.initialized = false;
            return;
        }

        if (!this.db.messageid) {
            tools.log(scriptName, `There is no Welcome Message saved. Please add one using "addverifymessage <Channelid>" in the command line`, 2);
        } else {
            let guild = await client.guilds.fetch(this.config.guildid);
            if (guild) {
                let channel = guild.channels.resolve(this.db.messagechannelid);
                if (!channel) {
                    tools.log(scriptName, `There is no Welcome Message saved. Please add one using "addverifymessage <Channelid>" in the command line`, 2);
                } else {
                    try {
                        await channel.messages.fetch(this.db.messageid);
                    } catch (e) {
                        tools.log(scriptName, `There is no Welcome Message saved. Please add one using "addverifymessage <Channelid>" in the command line`, 2);
                    }
                }
            }

        }

        client.on("messageReactionAdd", async (reaction, user) => {
            if (user.bot) return;
            if (reaction.emoji.name == this.config.verifyMessageReaction && reaction.message.id == this.db.messageid) {
                let member = await reaction.message.guild.members.fetch(user.id);
                if (!member) return;

                if (!member.roles.cache.get(this.config.roleid)) {
                    let role = reaction.message.guild.roles.cache.get(this.config.roleid);
                    if (!role) {
                        tools.log(scriptName, `The specified role was not found on the server. Please check modules config.`, 1);
                        return;
                    }
                    
                    if (!isNaN(this.config.waitUntilVerifiedInSeconds) && this.config.waitUntilVerifiedInSeconds > 0) {
                        let waitDuration = Number(this.config.waitUntilVerifiedInSeconds) * 1000;
                        
                        tools.log(scriptName, `Timeout set - Waiting ${waitDuration} Seconds before verifying`);
                        
                        await new Promise((resolve, _reject) => {
                           setTimeout(() => {
                                resolve();
                           },waitDuration); 
                        });
                    }

                    try {
                        await member.roles.add(role);
                    } catch (e) {
                        tools.log(scriptName, `Couldn't add Verify Role to ${member.user.tag}: ${e.message}`, 1);
                        return;
                    }

                    tools.log(scriptName, `${member.user.tag} has verified`);
                    return;
                }
            }
        });

        client.on("message", (message) => {
            if (message.author.bot || message.author.id == client.user.id) return;
            if (!message.content.startsWith(this.config.prefix)) return;

            const SplitMessage = message.content.split(" ");
            const Command = SplitMessage[0].toLowerCase().slice(this.config.prefix.length);
            const Args = SplitMessage.slice(1);

            checkCommand(message, Command, Args).catch(e => {
                message.channel.send(`:x: Whoops - An error occurred during your request. Please check logs for additional information`).catch(e => {});
                tools.log(scriptName, `An error occurred while processing command "${Command}" from "${message.author.tag}":\n${e.stack}`, 1);
            });
        });
    }

    function activate() {
        if (this.activated) return;

        tools.log(scriptName, `${scriptName} V${version} was reactivated`);
        this.activated = true;
    }

    function deactivate() {
        if (!this.activated) return;

        tools.log(scriptName, `${scriptName} V${version} was deactivated`);
        this.activated = false;
    }

    async function command(cmd, args) {
        if (!this.activated || !this.initialized) return;
        switch (cmd) {
            case "shutdown":
                tools.log(scriptName, `${scriptName} V${version} was deactivated`);
                this.activated = false;
                return true;
            case "reloaddb":
                this.db = JSON.parse(fs.readFileSync(`${dir}/db/discord-accept-rules-bot.db`, "utf-8"));
                tools.log(scriptName, `Database successfully reloaded`);
                return true;
            case "reloadconfig":
                this.config = checkConfigVersion(JSON.parse(fs.readFileSync(`${dir}/config/discord-accept-rules-bot.json`, "utf-8")));
                config = this.config;
                tools.log(scriptName, `Config successfully reloaded`);
                return true;
            case "addverifymessage":
                if (!args[0]) {
                    tools.log(scriptName, `Please specify a channel ID to send the message to.`, 1);
                    return true;
                }

                let guild2 = await client.guilds.fetch(this.config.guildid);
                if (!guild2) {
                    tools.log(scriptName, `The guild specified in the modules config was not found. Please check the config file. Verifymessage could not be sent.`, 1);
                    return true;
                }

                let channel = guild2.channels.resolve(args[0]);
                if (!channel) {
                    tools.log(scriptName, `The specified channel could not be found in the guild.`, 1);
                    return true;
                }

                try {
                    var embed = tools.makeEmbed(client.user, this.config.embedColor, this.config.verifyMessageTitle, this.config.verifyMessageDescription, this.config.verifyMessageFields);
                } catch (e) {
                    tools.log(scriptName, `Couldn't create Embed with config values: ${e.message}`, 1);
                    return true;
                }

                try {
                    var msg = await channel.send("",{
                        embed: embed
                    });
                } catch (e) {
                    tools.log(scriptName, `Couldn't send message to ${channel.name}: ${e.message}`, 1);
                    return true;
                }
                tools.log(scriptName, `Message was sent with ID ${msg.id}`);

                try {
                    await msg.react(this.config.verifyMessageReaction);
                } catch (e) {
                    tools.log(scriptName, `Couldn't add reaction to verify message in ${channel.name}: ${e.message}`, 1);
                    return true;
                }
                tools.log(scriptName, `Reaction was added`);

                this.db.messageid = msg.id;
                this.db.messagechannelid = msg.channel.id;
                fs.writeFileSync(`${dir}/db/discord-accept-rules-bot.db`, JSON.stringify(this.db));

                tools.log(scriptName, `Settings saved`);
                return true;
            case "verify":
                if (!args[0]) {
                    tools.log(scriptName, `Please provide the user ID of the person to verify`, 1);
                    return true;
                }

                let guild3 = await client.guilds.fetch(this.config.guildid);
                if (!guild3) {
                    tools.log(scriptName, `The guild specified in the modules config was not found. Please check the config file.`, 1);
                    return true;
                }

                let member2 = await guild3.members.fetch(args[0]);
                if (!member2) {
                    tools.log(scriptName, `The specified user was not found on the server.`, 1);
                    return true;
                }

                if (member2.roles.cache.has(this.config.roleid)) {
                    tools.log(scriptName, `The specified user is already verified.`, 1);
                    return true;
                }

                let role = guild3.roles.cache.get(this.config.roleid);
                if (!role) {
                    tools.log(scriptName, `The specified role was not found on the server. Please check modules config.`, 1);
                    return true;
                }

                try {
                    await member2.roles.add(role);
                } catch (e) {
                    tools.log(scriptName, `Couldn't add Verify Role to ${member2.user.tag}: ${e.message}`, 1);
                    return true;
                }

                tools.log(scriptName, `${member2.user.tag} was manually verified.`);
                return true;
            case "unverify":
                if (!args[0]) {
                    tools.log(scriptName, `Please provide the user ID of the person to verify`, 1);
                    return true;
                }

                let guild4 = await client.guilds.fetch(this.config.guildid);
                if (!guild4) {
                    tools.log(scriptName, `The guild specified in the modules config was not found. Please check the config file.`, 1);
                    return true;
                }

                let member3 = await guild4.members.fetch(args[0]);
                if (!member3) {
                    tools.log(scriptName, `The specified user was not found on the server.`, 1);
                    return true;
                }

                if (!member3.roles.cache.has(this.config.roleid)) {
                    tools.log(scriptName, `The specified user is not verified.`, 1);
                    return true;
                }

                let role2 = guild4.roles.cache.get(this.config.roleid);
                if (!role2) {
                    tools.log(scriptName, `The specified role was not found on the server. Please check modules config.`, 1);
                    return true;
                }

                try {
                    await member3.roles.remove(role2);
                } catch (e) {
                    tools.log(scriptName, `Couldn't remove Verify Role from ${member3.user.tag}: ${e.message}`, 1);
                    return true;
                }

                tools.log(scriptName, `${member3.user.tag} was manually unverified.`);
                return true;
            case "help":
                console.log(`===== Discord Accept Rules Module Commands\n\naddverifymessage <channelid>: Sends a verify message to the specified channel\nverify <DiscordID>:           Adds the specified role to the user\nunverify <DiscordID>:         Removes the specified role from the user\n`);
                return true;
            default:
                return;
        }
    }

    function checkVersion() {
        if (tools.isVersionLower(VERSIONINFO.packages.acceptRulesBot, version)) {
            tools.log(scriptName, `Theres a new version available for Discord Accept Rules Module (${version} --> ${VERSIONINFO.packages.acceptRulesBot})`, 2);
            return true;
        }

        return false;
    }

    function checkConfigVersion(config) {
        if (config.hasOwnProperty("version") && config.version >= 2) return config;
        config.version = 2;
        config.prefix = "/";
        config.disableGetEmojiCommand = false;

        fs.writeFileSync(path.join(__dirname, "../config/discord-accept-rules-bot.json"), JSON.stringify(config));
        tools.log(scriptName, "Config has been updated to version 2. Check your discord-accept-rules-bot.json to adjust the new options", 2);

        return config;
    }

    async function checkCommand(message, cmd, args) {
        if (!Commands.hasOwnProperty(cmd)) {
            return;
        }

        if (await Commands[cmd](message, args)) {
            tools.log(scriptName, `"${cmd}" executed successfully for "${message.author.tag}"`);
        }
    }

    const Commands = {
        getemoji: async (message, args) => {
            if (config.disableGetEmojiCommand) {
                tools.log(scriptName, "GetEmoji command was called but it is disabled in the config. Check your settings and try again.", 2);
                return;
            }
            if (!args[0]) {
                message.channel.send(`:x: Missing argument! - Usage: ${config.prefix}getEmoji [Emoji]`).catch(e => {});
                return false;
            }

            message.channel.send(`Here's your Emoji identifier:\n\`${args[0].split("<").join("").split(">").join("")}\``).catch(e => {});
            return true;
        }
    }

    return {
        init,
        activate,
        deactivate,
        command,
        checkVersion
    }
}
