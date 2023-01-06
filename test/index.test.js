const axios = require("axios");
const dotenv = require('dotenv');
const lib = require('../index');

beforeAll(() => {
	dotenv.config();	
});

test('dotenv is correctly reading environment variables', () => {
	dotenv.config();
  
	expect(process.env.AUTH_TOKEN).toBeDefined();
	expect(process.env.AUTH_TOKEN).toBe('123');
  });

test('get a specific channel', async () => {
	const channelURL = "http://api.are.na/v2/channels/arena-influences";
	const response = await lib.getChannelByURL(channelURL);
	expect(response.data.title).toBe('Arena Influences');
	expect(response.data.id).toBe(275);
});

test('get a private channel called toolz', async () => {
	const response = await lib.getChannelByName('toolz');
	expect(response.slug).toBe("toolz-bvvqxr2e3ok");
});
