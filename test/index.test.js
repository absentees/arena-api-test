const axios = require("axios");
const lib = require('../index')


test('get a specific channel', async () => {
	const baseURL = "http://api.are.na/v2/channels/arena-influences";
	const response = await lib.func();
	expect(response.data.title).toBe('Arena Influences');
	expect(response.data.id).toBe(275)
})

