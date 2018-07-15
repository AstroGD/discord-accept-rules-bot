/**
 * Discord Bot Mainframe
 * @version 1.0.1
 * @author AstroGD - https://www.astrogd.eu
 * @since 2018-07-15
 */

const scriptName = 'main.js',
    version = '1.0.1';

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

//Required Scripts
const tools = require(`${__dirname}/tools/tools.js`)(fs, __dirname, version);

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
// Instagram: @astrogd.eu
// Discord: https://www.discord.me/astrogd (AstroGD#3416)
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
    tools.log(scriptName, "All Important Scripts were initialized");
    tools.log(scriptName, "Logging in...");
    try {
        await client.login(config.token);
    } catch (e) {
        tools.log(scriptName, `Authentication failed: ${e.message}`);
        process.exit();
        return;
    }
}

client.on(`ready`, async () => {
    tools.log(scriptName, `Setup completed. Connected to ${client.user.tag} (${client.user.id})`);
    try {
        await initialization();
    } catch (e) {
        tools.log(scriptName, `Initalization failed: ${e.stack}`,1);
        client.destroy().then(() => {
            process.exit();
        });
        return;
    }
    tools.log(scriptName, "All modules were successfully initialized");
    rl.resume();
    rl.prompt();
});

rl.on("line", async (input) => {
    let cmd = input.split(" ")[0].toLowerCase();
    let args = input.split(" ").slice(1);

    tools.logFile(scriptName, `Command recieved: ${input}`);

    let success = await command(cmd, args);

    switch (cmd) {
        case "shutdown":
            console.log(`Shutting down...`);

            client.destroy().then(() => {process.exit()});
            rl.pause();
            return;
        case "help":
            console.log(`===== Discord Bot Mainframe Commands\n\nshutdown:                     Deactivates all correctly installed Modules and shuts the bot down\nhelp:                         Displays all commands available from Modules or Mainframe\n\n=====`);
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
rl.setPrompt(">> ");
console.log(`Starting ${scriptName} V${version}...`);
init();