// Description: tests for the are.na API wrapper
const dotenv = require('dotenv');
const lib = require('../arena.js');

beforeAll(() => {
	dotenv.config();
});

test('get a specific channel by URL', async () => {
	const channelURL = "https://www.are.na/scott-b-_/funny-haha-lz6ogdvm0rk";
	const response = await lib.getChannelByURL(channelURL);
	expect(response.title).toBe('funny haha');
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

// Describe creating and remove a channel
describe('create and remove a channel', () => {
	test('create a channel', async () => {
		const response = await lib.createChannel('testing123');
		expect(response.status).toBe(200);
		expect(response.data.title).toBe('testing123');
	});

	test('delete a channel', async () => {
		const response = await lib.getChannelByName('testing123');
		const channelSlug = response.slug;
		const deleteResponse = await lib.deleteChannel(channelSlug);
		expect(deleteResponse.status).toBe(204);
	});
});

// Test createBlock function
test('create a new block', async () => {
	// Create a test channel to add a block to
	const channelResponse = await lib.createChannel('testing123');
	const channelSlug = channelResponse.data.slug;
	expect(channelResponse.status).toBe(200);
	expect(channelResponse.data.title).toBe('testing123');

	// Create a new block in the channel
	const response = await lib.createBlock('test block', 'test content', channelSlug);
	expect(response.status).toBe(200);
	expect(response.data.title).toBe('test block');
});

// Test merging two newly create channels
describe('merge two channels', () => {
	// Create two channels to merge
	test('create two channels to merge', async () => {
		// Create the first channel
		const response1 = await lib.createChannel('channel1tomerge');
		expect(response1.status).toBe(200);
		expect(response1.data.title).toBe('channel1tomerge');

		// Add a block to the first channel
		const blockResponse = await lib.createBlock('test block in channel 1', 'test content', response1.data.slug);
		expect(blockResponse.status).toBe(200);
		expect(blockResponse.data.title).toBe('test block in channel 1');

		// Create the second channel
		const response2 = await lib.createChannel('channel2tomerge');
		expect(response2.status).toBe(200);
		expect(response2.data.title).toBe('channel2tomerge');

		// Add a block to the second channel
		const blockResponse2 = await lib.createBlock('test block in channel 2', 'test content', response2.data.slug);
		expect(blockResponse2.status).toBe(200);
		expect(blockResponse2.data.title).toBe('test block in channel 2');
	});

	// Merge the two channels
	test('merge the two channels', async () => {
		// Get the channel IDs
		const channel1 = await lib.getChannelByName('channel1tomerge');
		const channel2 = await lib.getChannelByName('channel2tomerge');

		// Merge the channels
		const mergeResponse = await lib.mergeChannels(channel1.slug, channel2.slug, false);
		expect(mergeResponse.status).toBe(200);
		expect(mergeResponse.data.title).toBe('channel1tomerge');
		expect(mergeResponse.data.contents.length).toBe(2);
	}
	);
});


afterAll(async () => {
	// Cleanup after tests
	const createdChannels = ['testing123', 'channel1tomerge', 'channel2tomerge'];
	for (let i = 0; i < createdChannels.length; i++) {
		const response = await lib.getChannelByName(createdChannels[i]);
		const channelSlug = response.slug;
		const deleteResponse = await lib.deleteChannel(channelSlug);
		expect(deleteResponse.status).toBe(204);
	}
});
