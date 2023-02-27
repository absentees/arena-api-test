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

// // test to delete a channel
// test('delete a channel', async () => {
// 	// Create a channel then delete it
// 	const response = await lib.createChannel('testing123');
// 	const channelSlug = response.data.slug;
// 	const deleteResponse = await lib.deleteChannel(channelSlug);
// 	expect(deleteResponse.status).toBe(204);

// });

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

// Test merging two newly create channels
// describe('merge two channels', () => {
// 	test('create two channels', async () => {
// 		const response1 = await lib.createChannel('channel1tomerge');
// 		const response2 = await lib.createChannel('channel2tomerge');
// 		expect(response1.status).toBe(200);
// 		expect(response2.status).toBe(200);
// 	});
// });


afterAll(async () => {	
});
