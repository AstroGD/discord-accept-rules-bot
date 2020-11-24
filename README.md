# Discord Bot Mainframe + Discord Accept Rules Module

This is version 2.0.0 of my [Discord Bot Mainframe](https://go.astrogd.eu/mainframe) with my Discord Accept Rules Module installed

## Installation

- Edit config/config.json and insert your Discord Bot User Token [Here's an explanation on how to create a Discord Bot Account](https://astrogd.medium.com/how-to-create-a-discord-bot-application-afbe0e1e76af).
- **In order for your bot to work make sure to enable the "Server Members Intent"! [More on that can be found here](https://astrogd.medium.com/how-to-create-a-discord-bot-application-afbe0e1e76af)**
- Edit config/discord-accept-rules-bot.json and insert the required values:
    - guildid: The ID of the server, the Bot should listen to (Example: 195221422682013696).
    - roleid: The ID of the role, the Bot should give Users, that accepted the rules.
    - embedColor: The Hex Color with the "#" that should be used for the Embed, the Bot sends where you can accept the rules.
    - verifyMessageTitle: The Title of the Embed
    - verifyMessageDescription: The Description of the Embed
    - verifyMessageFields: Field Values if you need more content inside your embed (Scroll down for more information)
    - verifyMessageReaction: Reactioncode of the Reaction that is being used to verify the rules. To get the Reactioncode, search your emoji [here](https://emojipedia.org/) and click on "copy".

## Usage

To start the Bot you need [NodeJS](https://nodejs.org/en/download/current/) installed on your Device. Then open a command prompt in the folder, you've installed the Mainframe to and type `npm install`. This will install all required dependencies that are needed to run the bot. This may take a while depending on the speed of your server's internet connection and performance.

**NodeJS 12 or higher is required for this bot to work!**

After the installation is finished type `npm start` in the same location; the Bot should now start. After finishing the initialization you can type `help` and press enter to get a list of available commands.

#### Note: you don't need to install the dependencies every time you want to run the bot. This step is only required once before your first use and after you update your bot.

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
    
## Updating from V1
If you have used V1 of this bot: No worries
- Make sure you have NodeJS 12 or higher installed by using `node -v` inside a console window
- Replace every file **except files located in "db" or "config"** with the new ones from [here](https://github.com/AstroGD/discord-accept-rules-bot/releases/latest)
- Run `npm install` inside the bots folder to install all required dependencies
- Make sure you have "Server Members Intent" enabled for your Discord Bot Application. [More on that can be found here](https://astrogd.medium.com/how-to-create-a-discord-bot-application-afbe0e1e76af)

Now you're good to go!

If you're having issues make sure to reach out to me
    
    
## Thank you for using my Bot
If you have any questions feel free to reach out:

Twitter: [@astrogd](https://www.twitter.com/astrogd)

Instagram: [@astrogd](https://www.instagram.com/astrogd)

Email: hello@astrogd.eu

Discord: AstroGD#3416 [Discord Server](https://go.astrogd.eu/discord)
