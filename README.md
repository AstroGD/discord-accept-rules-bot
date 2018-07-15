# Discord Accept Rules Module

This is a module for my Discord Bot Mainframe. You can find it [here](https://www.example.org).

## Installation

### Files
- Put the .js File into the modules folder of the mainframe
- Put the .db File into the db folder of the mainframe
- Put the .json File into the config folder of the mainframe

### Config

- Edit config/discord-accept-rules-bot.json and insert the required values:
    - guildid: The ID of the server, the Bot should listen to (Example: 195221422682013696).
    - roleid: The ID of the role, the Bot should give Users, that accepted the rules.
    - embedColor: The Hex Color with the "#" that should be used for the Embed, the Bot sends where you can accept the rules.
    - verifyMessageTitle: The Title of the Embed
    - verifyMessageDescription: The Description of the Embed
    - verifyMessageFields: Field Values if you need more content inside your embed (Scroll down for more information)
    - verifyMessageReaction: Reactioncode of the Reaction that is being used to verify the rules. To get the Reactioncode, search your emoji [here](https://emojipedia.org/) and click on "copy".

### Enable the module in main.js
- Open the main.js file of your mainframe version in a code-editor of your choice
- Under Module Definition paste the following code:

    ```const discord_accept_rules_bot = require(`${__dirname}/modules/discord-accept-rules-bot.js`)(client, fs, tools, __dirname);```
- Under Module Commands **after** ```if (await tools.command(cmd, args)) success = true;``` paste the following code:

    ```if (await discord_accept_rules_bot.command(cmd, args)) success = true;```
- Under Module Initalization inside the Curly-Brackets paste the following code:

    ```await discord_accept_rules_bot.init();```
- The Module should now be enabled.

### verifyMessageFields

verifyMessageFields contains an Array with an object for each additional field. Each Object can contain the following parameters:

- title: (String) The Title of your Field
- value: (String) The content of your Field (supports formatting)
- inline: (Boolean, Default false) true if you want the field to be on the right side of the field above. You can create Table like Structures with this option
- empty: (Boolean, Default false) if true an empty Field wil be created for spacing. title and value are being ignored, inline not!

Example:

   ```
   [
    {
     "title": "Title",
     "value": "Content"
    },
    {
     "title": "Title2",
     "value": "Content2",
     "inline": true
    },{
     "empty": true
    },{
     "title": "After Empty",
     "value": "After Empty content"
    }
   ]
   ```

### Role and Serverids

To get Role and Serverids, you may use a bot, to keep things simple. I recommend [DynoBot](https://www.dynobot.net/).
You can kick Dyno after you've got the required ID's

Get Serverid: ?serverinfo --> On the bottom of the Embed you can find ID: "SOME ID HERE"
Get Role-ID: ?roleinfo <Rolename> --> First field contains the ID of the role
