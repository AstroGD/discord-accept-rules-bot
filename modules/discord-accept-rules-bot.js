/**
 * Discord Accept Rules Bot
 * @version 1.0.0
 * @author AstroGD - https://www.astrogd.eu
 * @since 2018-07-15
 */

var scriptName = "modules.discord-accept-rules-bot.js",
    version = "1.0.0",
    mainframeMinVersion = "1.0.1";

module.exports = function (client, fs, tools, dir) {

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

        this.db = JSON.parse(fs.readFileSync(`${dir}/db/discord-accept-rules-bot.db`, "utf-8"));
        this.config = require(`${dir}/config/discord-accept-rules-bot.json`);

        if (!client.guilds.get(this.config.guildid)) {
            tools.log(scriptName, `The guild specified in the modules config was not found. Please check the config file. Verifymessage could not be sent.`, 1);
            this.initialized = false;
            return;
        }

        if (!this.db.messageid) {
            tools.log(scriptName, `There is no Welcome Message saved. Please add one using "addverifymessage <Channelid>" in the command line`, 2);
        } else {
            let guild = client.guilds.get(this.config.guildid);
            if (guild) {
                let channel = guild.channels.get(this.db.messagechannelid);
                if (!channel) {
                    tools.log(scriptName, `There is no Welcome Message saved. Please add one using "addverifymessage <Channelid>" in the command line`, 2);
                } else {
                    try {
                        await channel.fetchMessage(this.db.messageid);
                    } catch (e) {
                        tools.log(scriptName, `There is no Welcome Message saved. Please add one using "addverifymessage <Channelid>" in the command line`, 2);
                    }
                }
            }

        }

        client.on("messageReactionAdd", async (reaction, user) => {
            if (user.bot) return;
            if (reaction.emoji.name == this.config.verifyMessageReaction && reaction.message.id == this.db.messageid) {
                let member = reaction.message.guild.members.get(user.id);
                if (!member) return;

                if (!member.roles.get(this.config.roleid)) {
                    let role = reaction.message.guild.roles.get(this.config.roleid);
                    if (!role) {
                        tools.log(scriptName, `The specified role was not found on the server. Please check modules config.`, 1);
                        return;
                    }
                    
                    if (!isNaN(config.waitUntilVerifiedInSeconds) && config.waitUntilVerifiedInSeconds > 0) {
                        let waitDuration = Number(config.waitUntilVerifiedInSeconds) * 1000;
                        
                        tools.log(scriptName, `Timeout set - Waiting ${waitDuration} Seconds before verifying`);
                        
                        await new Promise((resolve, reject) => {
                           setTimeout(() => {
                                resolve();
                           },waitDuration); 
                        });
                    }

                    try {
                        await member.addRole(role);
                    } catch (e) {
                        tools.log(scriptName, `Couldn't add Verify Role to ${member.user.tag}: ${e.message}`, 1);
                        return;
                    }

                    tools.log(scriptName, `${member.user.tag} has verified`);
                    return;
                }
            }
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
                this.config = JSON.parse(fs.readFileSync(`${dir}/config/discord-accept-rules-bot.json`, "utf-8"));
                tools.log(scriptName, `Config successfully reloaded`);
                return true;
            case "addverifymessage":
                if (!args[0]) {
                    tools.log(scriptName, `Please specify a channel ID to send the message to.`, 1);
                    return true;
                }

                let guild2 = client.guilds.get(this.config.guildid);
                if (!guild2) {
                    tools.log(scriptName, `The guild specified in the modules config was not found. Please check the config file. Verifymessage could not be sent.`, 1);
                    return true;
                }

                let channel = guild2.channels.get(args[0]);
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
                    var msg = await channel.send({
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

                let guild3 = client.guilds.get(this.config.guildid);
                if (!guild3) {
                    tools.log(scriptName, `The guild specified in the modules config was not found. Please check the config file.`, 1);
                    return true;
                }

                let member2 = guild3.members.get(args[0]);
                if (!member2) {
                    tools.log(scriptName, `The specified user was not found on the server.`, 1);
                    return true;
                }

                if (member2.roles.get(this.config.roleid)) {
                    tools.log(scriptName, `The specified user is already verified.`, 1);
                    return true;
                }

                let role = guild3.roles.get(this.config.roleid);
                if (!role) {
                    tools.log(scriptName, `The specified role was not found on the server. Please check modules config.`, 1);
                    return true;
                }

                try {
                    await member2.addRole(role);
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

                let guild4 = client.guilds.get(this.config.guildid);
                if (!guild4) {
                    tools.log(scriptName, `The guild specified in the modules config was not found. Please check the config file.`, 1);
                    return true;
                }

                let member3 = guild4.members.get(args[0]);
                if (!member3) {
                    tools.log(scriptName, `The specified user was not found on the server.`, 1);
                    return true;
                }

                if (!member3.roles.get(this.config.roleid)) {
                    tools.log(scriptName, `The specified user is not verified.`, 1);
                    return true;
                }

                let role2 = guild4.roles.get(this.config.roleid);
                if (!role2) {
                    tools.log(scriptName, `The specified role was not found on the server. Please check modules config.`, 1);
                    return true;
                }

                try {
                    await member3.removeRole(role2);
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

    return {
        init,
        activate,
        deactivate,
        command
    }
}
