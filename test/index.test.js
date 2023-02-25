// Description: tests for the are.na API wrapper
const dotenv = require('dotenv');
const lib = require('../arena.js');

beforeAll(() => {
	dotenv.config();	
});

test('get a specific channel by URL', async () => {
	const channelURL = "http://api.are.na/v2/channels/arena-influences";
	const response = await lib.getChannelByURL(channelURL);
	expect(response.data.title).toBe('Arena Influences');
	expect(response.data.id).toBe(275);
});

// test to get a public channel by id
test('get a public channel by id', async () => {
	const channelID = 275;
	const response = await lib.getChannelByID(channelID);
	expect(response.data.title).toBe('Arena Influences');
	expect(response.data.id).toBe(275);
});

test('get a private channel called toolz', async () => {
	const channelName = "toolz";
	const response = await lib.getChannelByName(channelName);
	expect(response.title).toBe('toolz');
	expect(response.slug).toBe('toolz-bvvqxr2e3ok');
});

// test to delete a channel
test('delete a channel', async () => {
	// Create a channel then delete it
	const response = await lib.createChannel('testing123');
	const channelSlug = response.data.slug;
	const deleteResponse = await lib.deleteChannel(channelSlug);
	expect(deleteResponse.status).toBe(204);

});

test('create a channel called creatingachanneltodelete', async () => {
	const response = await lib.createChannel('creatingachanneltodelete');
	expect(response.status).toBe(200);
	expect(response.data.title).toBe('creatingachanneltodelete');
});

// Test merging two newly create channels
test('merge two channels', async () => {
	// Create two channels
	const response1 = await lib.createChannel('channel1tomerge');
	const response2 = await lib.createChannel('channel2tomerge');

	// Get the channel IDs
	const channel1ID = response1.data.id;
	const channel2ID = response2.data.id;

	// Merge the channels
	const mergeResponse = await lib.mergeChannels(channel1ID, channel2ID);
	expect(mergeResponse.status).toBe(true);

	// Delete the channels
	const deleteResponse1 = await lib.deleteChannel(response1.data.slug);
	const deleteResponse2 = await lib.deleteChannel(response2.data.slug);
	expect(deleteResponse1.status).toBe(204);
	expect(deleteResponse2.status).toBe(204);

	
});


afterAll(async () => {
	// delete the channel we created
	const response = await lib.getChannelByName('creatingachanneltodelete');
	const channelID = response.id;
	const deleteResponse = await lib.deleteChannel(channelID);
	expect(deleteResponse.status).toBe(204);
});
