# Discord Bot Mainframe + Discord Accept Rules Module

This is version 1.0.1 of my Discord Bot Mainframe with my Discord Accept Rules Module installed

## Installation

- Edit config/config.json and insert your Discord Bot User Token [Here's an explanation of how to create a Discord Bot Account](https://medium.com/@gregjwww/how-to-build-a-discord-bot-6c5b612c651).
- Edit config/discord-accept-rules-bot.json and insert the required values:
    - guildid: The ID of the server, the Bot should listen to (Example: 195221422682013696).
    - roleid: The ID of the role, the Bot should give Users, that accepted the rules.
    - embedColor: The Hex Color with the "#" that should be used for the Embed, the Bot sends where you can accept the rules.
    - verifyMessageTitle: The Title of the Embed
    - verifyMessageDescription: The Description of the Embed
    - verifyMessageFields: Field Values if you need more content inside your embed (Scroll down for more information)
    - verifyMessageReaction: Reactioncode of the Reaction that is being used to verify the rules. To get the Reactioncode, search your emoji [here](https://emojipedia.org/) and click on "copy".

## Usage

To start the Bot you need [NodeJS](https://nodejs.org/en/download/current/) installed on your Device. Then open a command prompt in the folder, you've installed the Mainframe to and type `npm start`.

The Bot should now start. After finishing the initialization you can type `help` and press enter to get a list of available commands.

If you have any question feel free to contact me:

Twitter: @astrogd

Instagram: @astrogd.eu

Email: support@astrogd.eu

Discord: AstroGD#3416 [Discord Server](https://www.discord.me/astrogd)
