# Instagram Saver

Instagram Saver is a Chrome extension that allows users to save Instagram posts directly to a Discord channel. It adds a "Save" button to Instagram posts, enabling easy sharing and archiving of favorite content.

## Features

- Adds a "Save" button to Instagram posts
- Captures post information including author, content, timestamp, and media URLs
- Supports both single-image and multi-image posts
- Sends saved posts to a specified Discord channel
- Handles video posts (notifies that video content is not supported)

## How to Use the Chrome Extension

1. Install the Chrome extension (instructions for loading an unpacked extension can be found in the Installation section).
2. Navigate to Instagram in your Chrome browser.
3. You should see a "Save" button appear on each Instagram post.
4. Click the "Save" button on any post you want to save to Discord.
5. The post information and media will be sent to your specified Discord channel.

## Installation

### Chrome Extension

1. Clone this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the `chrome_extension` folder from the cloned repository.
5. The Instagram Saver extension should now be installed and active.

### Discord Bot

1. Make sure you have Node.js installed on your system.
2. Navigate to the project root directory in your terminal.
3. Install the required dependencies by running:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your Discord bot token:
   ```
   DISCORD_BOT_TOKEN=your_discord_bot_token_here
   ```
5. Start the Discord bot server by running:
   ```
   node src/index.js
   ```

## Dependencies

The Discord bot requires the following npm packages:

- express
- cors
- discord.js
- axios
- dotenv

You can install all dependencies by running `npm install` in the project root directory.

## Configuration

- In `src/index.js`, you can change the `DISCORD_CHANNEL_NAME` variable to specify which Discord channel the bot should post to.
- The server runs on port 3000 by default. You can change this in the `src/index.js` file if needed.

## Notes

- The extension currently doesn't support saving video content from Instagram. It will notify the user when a video post is encountered.
- Make sure your Discord bot has the necessary permissions to send messages and attachments in the specified channel.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check issues page if you want to contribute.

## License

[MIT](https://choosealicense.com/licenses/mit/)