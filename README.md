# Discord Accept Rules Module

This is a module for my Discord Bot Mainframe. You can find it [here](https://www.example.org).

## Installation

### Files
- Put the .js File into the modules folder of the mainframe
- Put the .db File into the db folder of the mainframe
- Put the .json File into the config folder of the mainframe

### Enable the module in main.js
- Open the main.js file of your mainframe version in a code-editor of your choice
- Under Module Definition paste the following code:

    ```const discord_accept_rules_bot = require(`${__dirname}/modules/discord-accept-rules-bot.js`)(client, fs, tools, __dirname);```
- Under Module Commands **after** ```if (await tools.command(cmd, args)) success = true;``` paste the following code:

    ```if (await discord_accept_rules_bot.command(cmd, args)) success = true;```
- Under Module Initalization inside the Curly-Brackets paste the following code:

    ```await discord_accept_rules_bot.init();```
- The Module should now be enabled.
