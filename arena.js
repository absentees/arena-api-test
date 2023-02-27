const axios = require('axios');
const dotenv = require('dotenv').config();

const arena = {
	createBlock: async (title, content, channelID) => {
		try {

			// Set up the request options and data to send to the API endpoint 
			// https://dev.are.na/documentation/channels
			const options = {
				headers: {
					'Authorization': `Bearer ${process.env.ARENA_TOKEN}`,
					'Content-Type': 'application/json'
				}
			};

			// Channel ID is the number at the end of the URL
			// e.g. https://www.are.na/channel/1234567
			const data = {
				channel_id: channelID,
				content: content,
				title: title
			}

			// Create a block in the channel with the given ID and content and title
			// https://dev.are.na/documentation/blocks
			const response = await axios.post('https://api.are.na/v2/blocks', data, options);

			// Return the block ID
			return response;
		} catch (error) {
			console.log(error);
			return error;
		}
	},
	getBlock: async (blockID) => {
		try {
			const options = {
				headers: {
					'Authorization': `Bearer ${process.env.ARENA_TOKEN}`,
					'Content-Type': 'application/json'
				}
			};

			const response = await axios.get(`https://api.are.na/v2/blocks/${blockID}`, options);

			return response;

		} catch (error) {
			console.log(error);
			return error;
		}
	},
	/**
	 * Delete a channel
	 * @param {string} channelSlug - The slug of the channel to delete
	 * @returns {object} - The response from the API
	 */
	deleteChannel: async (channelSlug) => {
		// Channel ID is the number at the end of the URL
		// e.g. https://www.are.na/channel/1234567
		try {
			const options = {
				headers: {
					'Authorization': `Bearer ${process.env.ARENA_TOKEN}`,
					'Content-Type': 'application/json'
				}
			};

			// Delete the channel with the given ID
			// https://dev.are.na/documentation/channels
			const response = await axios.delete(`https://api.are.na/v2/channels/${channelSlug}`, options);

			return response;

		} catch (error) {
			console.log(error);
			return error;
		}
	},
	deleteBlock: async (blockID) => {
		// Block ID is the number at the end of the URL
		// e.g. https://www.are.na/block/1234567
		try {
			const options = {
				headers: {
					'Authorization': `Bearer ${process.env.ARENA_TOKEN}`,
					'Content-Type': 'application/json'
				}
			};

			const response = await axios.delete(`https://api.are.na/v2/blocks/${blockID}`, options);

			return response;
		} catch (error) {
			console.log(error);
			return error;
		}
	},
	mergeChannels: async (channel1Slug, channel2Slug) => {
		try {
			// Get the blocks from the first channel
			const channel1Blocks = await arena.getChannelBlocks(channel1.id);

			// Get the blocks from the second channel
			const channel2Blocks = await arena.getChannelBlocks(channel2.id);

			// Loop through the blocks in the first channel
			for (let i = 0; i < channel1Blocks.length; i++) {
				// Check if the block is in the second channel
				const blockInChannel2 = channel2Blocks.find(block => arena.compareBlocks(block, channel1Blocks[i]));

				// If the block is not in the second channel, add it
				if (!blockInChannel2) {
					await arena.createBlock(channel1Blocks[i].title, channel1Blocks[i].content, channel2.id);
				}
			}

			// Delete the first channel
			await arena.deleteChannel(channel1.slug);

			return true;
		} catch (error) {
			console.log(error);
			return error;
		}
	},
	compareChannels: (channel1, channel2) => {
		if (channel1.title == channel2.title && channel1.description == channel2.description) {
			return true;
		} else {
			return false;
		}
	},
	compareBlocks: (block1, block2) => {
		if (block1.title == block2.title && block1.content == block2.content) {
			return true;
		} else {
			return false;
		}
	},
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
	getChannelByID: async (channelID) => {
		try {
			const options = {
				headers: {
					'Authorization': `Bearer ${process.env.ARENA_TOKEN}`,
					'Content-Type': 'application/json'
				}
			};

			const response = await axios.get(`https://api.are.na/v2/channels/${channelID}`, options);

			return response;
		} catch (error) {
			console.log(error);
			return error;
		}
	},
	/**
	 * Get a channel by name, a found channel is determined by the title of the channel
	 * @param {string} channelName - The name of the channel to search for
	 * @returns {object} - The channel object
	 * @throws {Error} - If the channel is not found
	 * 
	 */
	getChannelByName: async (channelName) => {
		try {
			// Search for the channel by name
			// https://dev.are.na/documentation/search
			const response = await axios.get('https://api.are.na/v2/search/channels', {
				params: {
					"q": channelName
				},
				headers: {
					'Authorization': `Bearer ${process.env.ARENA_TOKEN}`,
					'Content-Type': 'application/json'
				}
			});

			// If the channel name matches the search query, return the channel
			const channel = response.data.channels.find(channel => channel.title == channelName);

			// If the channel exists, return it
			if (channel) {
				return channel;
			} else {
				throw new Error ("Channel not found");
			}

		} catch (error) {
			throw error;
		}
	},
	/**
	 * Get the blocks from a channel
	 * @param {string} channelSlug - The slug of the channel to get the blocks from
	 * @returns {array} - An array of block objects
	 */
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

// Export the module
module.exports = arena;