require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const DISCORD_CHANNEL_NAME = 'instagram-bot'; // Replace with your desired channel name

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

app.post('/instagram-save', async (req, res) => {
  const { author, content, timestamp, postLink, mediaUrls, isVideo } = req.body;

  const embed = new EmbedBuilder()
    .setTitle(`Saved Instagram Post by ${author}`)
    .setDescription(content || 'No caption')
    .setURL(postLink)
    .setTimestamp(new Date(timestamp));

  const channel = client.channels.cache.find(ch => ch.name === DISCORD_CHANNEL_NAME);
  if (channel) {
    try {
      if (isVideo) {
        await channel.send({
          content: `Saved post (Video): ${postLink}\nVideo is not supported.`,
          embeds: [embed]
        });
      } else if (mediaUrls && mediaUrls.length > 0) {
        const MAX_ATTACHMENTS = 10;
        const totalImages = mediaUrls.length;
        const messageCount = Math.ceil(totalImages / MAX_ATTACHMENTS);

        for (let msgIndex = 0; msgIndex < messageCount; msgIndex++) {
          let mediaAttachments = [];
          const startIndex = msgIndex * MAX_ATTACHMENTS;
          const endIndex = Math.min((msgIndex + 1) * MAX_ATTACHMENTS, totalImages);

          for (let i = startIndex; i < endIndex; i++) {
            const response = await axios.get(mediaUrls[i], { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            mediaAttachments.push(new AttachmentBuilder(buffer, { name: `instagram_media_${i + 1}.jpg` }));
          }

          let content = `Saved post: ${postLink}`;
          content += `\n[${startIndex + 1}-${endIndex} out of ${totalImages} photos]`;

          if (msgIndex === 0) {
            await channel.send({
              content: content,
              embeds: [embed],
              files: mediaAttachments
            });
          } else {
            await channel.send({
              content: content,
              files: mediaAttachments
            });
          }
        }
      } else {
        await channel.send({
          content: `Saved post: ${postLink}\nNo media found.`,
          embeds: [embed]
        });
      }
      
      console.log('Sent Instagram post to Discord');
      res.json({ success: true });
    } catch (error) {
      console.error('Error sending to Discord:', error);
      res.status(500).json({ error: 'Failed to send to Discord' });
    }
  } else {
    console.error(`Channel "${DISCORD_CHANNEL_NAME}" not found`);
    res.status(404).json({ error: 'Discord channel not found' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);