const Discord = require('discord.js');
const client = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION"]});
const enmap = require('enmap');
const {token, prefix} = require('./config.json');

const settings = new enmap({
    name: "settings",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});

client.on('ready', () => {
    console.log('ready')
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();ıf
    if(command == "ticket-setup11111111111111") {
        // ticket-setup #channel
        

        let channel = message.mentions.channels.first();
        if(!channel) return message.reply(`Usege: ${prefix}ticket-setup #channel`);

        let sent = await channel.send(new Discord.MessageEmbed()
            .setTitle("لطلب شراء او مساعده  افتح تكت")
            .setDescription("اضغط على الرياكشن لفتح تذكرة!")
            .setFooter("ProgramU4 Server")
            .setColor("00ff00")
        );

        sent.react('📩');
        settings.set(`${message.guild.id}-ticket`, sent.id);

        message.channel.send("تم عمل التكت بنجاح!")
    }

    if(command == "close") {
        if(!message.channel.name.includes("ticket-")) return message.channel.send("You cannot use that here!")
        message.channel.delete();
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

    if(!ticketid) return;

    if(reaction.message.id == ticketid && reaction.emoji.name == '📩') {
        reaction.users.remove(user);

        reaction.message.guild.channels.create(`ticket-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("اهلا بك!").setDescription("اطرح مشكلتك او طلبك وانتظر حتى يتم الرد عليك").setColor("00ff00")
            .setFooter("ProgramU4 Server"))
        })
    }
});

client.login(token);
