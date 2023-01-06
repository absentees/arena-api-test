const axios = require("axios");
const dotenv = require("dotenv").config();

const arena = {
	getChannelByURL: async (channelURL) => {
		try {
			const response = await axios.get(channelURL, {
				params: {
					"page": 1,
					"per": 15
				}
			});
			return response;
		} catch (error) {
			console.error(error);
		}
	},
	getChannelByName: async (channelName) => {
		try {
			const options = {
				headers: {
					'Authorization': `Bearer ${process.env.ARENA_TOKEN}`,
					'Content-Type': 'application/json'
				}
			};

			const response = await axios.get(`https://api.are.na/v2/search?q=${channelName}`, options);

			const channel = response.data.channels.find(channel => channel.title == channelName);

			if (channel) {
				return channel;
			} else {
				throw new Error ("Channel not found");
			}

		} catch (error) {
			throw error;
		}
	},
	createChannel: async (channelName) => {
		try {
			const options = {
				headers: {
					'Authorization': `Bearer ${process.env.ARENA_TOKEN}`,
					'Content-Type': 'application/json'
				}
			};

			const data = {
				title: channelName
			}

			const response = await axios.post('https://api.are.na/v2/channels', data, options);

			return response;
		} catch (error) {
			console.log(error);
			return error;
		}
	}
}


module.exports = arena;

