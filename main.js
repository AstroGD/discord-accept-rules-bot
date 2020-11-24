/**
 * Discord Bot Mainframe
 * @version 2.0.0
 * @author AstroGD - https://www.astrogd.eu
 * @since 2018-07-15
 */

const scriptName = 'main.js',
    version = '2.0.0';

//Required Modules and Files
const Discord = require("discord.js");
const config = require(`${__dirname}/config/config.json`);
const fs = require("fs-extra");
const readline = require("readline");

//Instances
const client = new Discord.Client();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.setPrompt("> ");

//Required Scripts
const tools = require(`${__dirname}/tools/tools.js`)(Discord, client, fs, __dirname, version);

//Module Definition
const discord_accept_rules_bot = require(`${__dirname}/modules/discord-accept-rules-bot.js`)(client, fs, tools, __dirname);

//Module Commands
async function command(cmd, args) {
    let success = false;

    if (await tools.command(cmd, args)) success = true;
    if (await discord_accept_rules_bot.command(cmd, args)) success = true;

    return success;
}

//Module Initialization
async function initialization() {
    await discord_accept_rules_bot.init();
}


//DO NOT CHANGE THE CODE BELOW IF YOU DON'T KNOW WHAT YOU ARE DOING.
// 
// 
//CHANGING THE CODE COULD LEAD TO SECURITY ISSUES AND MALFUNCTION. DO NOT EVEN CHANGE SOMETHING IF SAID BY SOMEONE ELSE CLAIMING TO KNOW WHAT HE IS DOING!
//ONLY USE THE ORIGINAL DISCORD BOT MAINFRAME VERSION FROM ASTROGDs GITHUB REPOSITORY.
// 
// 
//IF YOU HAVE ANY QUESTIONS, FEEL FREE TO CONTACT ASTROGD:
// Mail: support@astrogd.eu
// Twitter: @astrogd
// Instagram: @astrogd
// Discord: https://go.astrogd.eu/discord (AstroGD#3416)
// 
// 
//THE CODE BELOW MAY ONLY BE CHANGED TO UPDATE THE DISCORD BOT MAINFRAME. IF THERE IS AN UPDATE AVAILABLE, YOU WILL GET A MESSAGE IN THE CONSOLE.
//FOR MORE INFOS ON HOW TO UPDATE, CHECK ASTROGDs REPOSITORY



//Initialization
async function init() {
    try {
        await tools.init();
    } catch (e) {
        console.log(`An error occurred during the initialization: ${e.stack}`);
        process.exit();
        return;
    }
    tools.log(scriptName, "Scripts initialized - Getting version information");

    global.VERSIONINFO = await tools.checkVersion();
    if (!VERSIONINFO) {
        tools.log(scriptName, "Version couldn't be fetched. Make sure you have a connection to the internet and access to software.astrogd.eu", 1);
    } else {
        if (tools.isVersionLower(VERSIONINFO.version, version)) tools.log(scriptName, `Theres a new version available for Discord Mainframe (${version} --> ${VERSIONINFO.version})`, 2);
    }

    tools.checkToolsVersion();

    tools.log(scriptName, "Logging in...");
    try {
        await client.login(config.token);
    } catch (e) {
        tools.log(scriptName, `Authentication failed: ${e.message}`);
        process.exit();
        return;
    }
}

async function checkVersion() {
    VERSIONINFO = await tools.checkVersion();
    if (!VERSIONINFO) {
        tools.log(scriptName, "Version couldn't be fetched. Make sure you have a connection to the internet and access to software.astrogd.eu", 1);
        return false;
    }

    let newVerAvailable = false;
    if (tools.isVersionLower(VERSIONINFO.version, version)) {
        tools.log(scriptName, `Theres a new version available for Discord Mainframe (${version} --> ${VERSIONINFO.version})`, 2);
        newVerAvailable = true;
    }

    if (tools.checkToolsVersion()) newVerAvailable = true;
    if (discord_accept_rules_bot.checkVersion()) newVerAvailable = true;

    return newVerAvailable;
}

client.on(`ready`, async () => {
    tools.log(scriptName, `Setup completed. Connected to ${client.user.tag} (${client.user.id})`);
    try {
        await initialization();
    } catch (e) {
        tools.log(scriptName, `Initalization failed: ${e.stack}`, 1);
        client.destroy().then(() => {
            process.exit();
        });
        return;
    }
    tools.log(scriptName, "All modules were successfully initialized");

    setInterval(checkVersion, 1*60*60*1000);

    rl.prompt(true);
});

rl.on("line", async (input) => {
    rl.pause();
    let cmd = input.split(" ")[0].toLowerCase();
    let args = input.split(" ").slice(1);

    tools.logFile(scriptName, `Command recieved: ${input}`);

    let success = await command(cmd, args);

    switch (cmd) {
        case "shutdown":
            console.log(`Shutting down...`);

            client.destroy();
            process.exit();
        case "help":
            console.log(`===== Discord Bot Mainframe Commands\n\nshutdown:                     Deactivates all correctly installed Modules and shuts the bot down\ncheckversion:                 Checks if there is a new version available\nhelp:                         Displays all commands available from Modules or Mainframe\nreloaddb:                     Reloads Database. Use only if changes were made manually\nreloadconfig:                 Reloads Config. Use only if changes were made manually\n\n=====`);
            break;
        case "checkversion":
            if (await checkVersion()) console.log("One or more Modules need an update!");
            else console.log("Everythings up to date!");
            break;
        default:
            if (!success) {
                console.log(`${cmd}: The input "${cmd}" was not being recognized as a command. Please check your spelling or type "help" for a list of possible commands. Also check, if module commands were correctly installed.`);
                tools.logFile(scriptName, `Unknown Command`);
            }
            break;
    }

    rl.prompt();

});

rl.pause();
console.log(`Starting ${scriptName} V${version}...`);
init();