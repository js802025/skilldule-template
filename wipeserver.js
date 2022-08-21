const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const config = require('./config.json');

client.on('ready', async () => {
    const guild = client.guilds.cache.get(config.discord.guild);
    const category = await guild.channels.cache.get('993024928997720064'); // You can use `find` instead of `get` to fetch the category using a name: `find(cat => cat.name === 'test')
    category.children.forEach(channel => channel.delete())
})


client.login(config.discord.token);