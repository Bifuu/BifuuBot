BifuuBot

BifuuBot is a chat bot for the Discord chat platflorm. It offers several features currently with more being developed.

1. Interacts with the chat to perform various commands
2. can play sounds and audio from YouTube over the platform's voice chat
3. Has a React frontend where users of the channels the bot is in can upload sound effects for use in the voice channels.
4. Works with firebase to pprovide database and storage options in realtime.

Outside of the normal operations, BifuuBot has taken advantage of several technologies

1. Serverless cloud functions for audio conversion and Discord Auth
2. Authentication and Authorization through Discord's OAuth
3. Bot and Functions utilize TypeScript to ensure type safety

The Code:
bifuubot-dashboard.

The dashboard is the React frontend that gets hosted with firebase hosting. Utilizing React allows for instant updates when file transfers happen and other exposed data gets changed.

bot.

The bot is where the code for the Discord bot sits. It is written in TypeScript and runs with the Discord.js code base to interact with the Discord API.

functions.

This is where the serverless cloud functions live that are ran on the firebase service.
