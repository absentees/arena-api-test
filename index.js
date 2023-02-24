import arena from './arena.js';

// arena.createChannel("testing123");
// arena.createChannel("test12");


const channel = await arena.getChannelByName("testing123");
// await arena.deleteChannel(channel.slug);