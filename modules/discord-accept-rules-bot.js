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
            tools.log(scriptName, `This Module requires a Mainframe Version of ${mainframeMaxVersion} or higher. Please update your Mainframe. This Module is not being activated.`,2);
            return;
        }
        if (!deactivated) {
            this.activated = true;
        }
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
            case "help":
                console.log(`===== Discord Accept Rules Module Commands\n\nverify <DiscordID>:           Adds the specified role to the user\nunverify <DiscordID>:         Removes the specified role from the user\n`);
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