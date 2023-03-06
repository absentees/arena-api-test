const axios = require('axios');
const dotenv = require('dotenv').config();

const arena = {
	/**
	 * Create a new block given a title, contents and target channel ID
	 * @param {string} title - The title of the block
	 * @param {string} content - The content of the block
	 * @param {string} channelSlug - The slug of the channel to add the block to
	 * @returns {object} - The response from the API
	 * @example
	 * const title = 'test block';
	 * const content = 'test content';
	 * const channelID = 1234567;
	 * const response = await arena.createBlock(title, content, channelID);
	 * console.log(response);
	 * // {
	 * //   "id": 1234567,
	 * //   "title": "test block",
	 * //   "content": "test content",
	 * //   "channel_id": 1234567,
	 * //   "user_id": 1234567,
	 * //   "created_at": "2020-04-01T00:00:00.000Z",
	 * //   "updated_at": "2020-04-01T00:00:00.000Z",
	 * //   "slug": "test-block-1234567",
	 * //   "kind": "text",
	 * //   "source": null,
	 * 
	 */
	createBlock: async (title, content, channelSlug) => {
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
				content: content,
				title: title
			}

			// Create a block in the channel with the given ID and content and title
			// https://dev.are.na/documentation/blocks
			const response = await axios.post(`https://api.are.na/v2/channels/${channelSlug}/blocks`, data, options);

			// Return api response
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
	/** 
	 * Copy all blocks from channel 2 to channel 1, optionally then delete channel 2
	 * @param {string} channel1Slug - The slug of the channel to copy blocks to
	 * @param {string} channel2Slug - The slug of the channel to copy blocks from
	 * @param {boolean} deleteChannel2 - Whether to delete channel 2 after copying blocks
	 * @returns {object} - The channel 1 object
	 * 
	 * @example
	 * // Copy all blocks from channel 2 to channel 1, then delete channel 2
	 * mergeChannels('channel-1', 'channel-2', true);
	 * 
	 * @example
	 * // Copy all blocks from channel 2 to channel 1, but don't delete channel 2
	 * mergeChannels('channel-1', 'channel-2', false);
	 * 
	 */
	mergeChannels: async (channel1Slug, channel2Slug, deleteChannel2) => {
		try {
			// Get channel 1 and channel 2
			const channel1 = await arena.getChannelBySlug(channel1Slug);
			const channel2 = await arena.getChannelBySlug(channel2Slug);

			// For each block in channel 2, create it in channel 1
			for (let i = 0; i < channel2.contents.length; i++) {
				const block = channel2.contents[i];
				await arena.createBlock(block.title, block.content, channel1.id);
			}

			if (deleteChannel2) {
				// Delete the second channel
				await arena.deleteChannel(channel2Slug);
			}

			return channel1;
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
	/**
	 * Compare two blocks to see if they are the same
	 * @param {object} block1 - The first block to compare
	 * @param {object} block2 - The second block to compare
	 * @returns {boolean} - True if the blocks are the same, false if they are different
	 * 
	 */
	compareBlocks: (block1, block2) => {
		if (block1.title == block2.title && block1.content == block2.content) {
			return true;
		} else {
			return false;
		}
	},
	getChannelBySlug: async (channelSlug) => {
		try {
			const options = {
				headers: {
					'Authorization': `Bearer ${process.env.ARENA_TOKEN}`,
					'Content-Type': 'application/json'
				}
			};

			const response = await axios.get(`https://api.are.na/v2/channels/${channelSlug}`, options);

			return response.data;

		} catch (error) {
			console.log(error);
			return error;
		}
	},
	/**
	 * Get a channel object from a given URL
	 * @param {string} channelURL - The URL of the channel to search for
	 * @returns {object} - The channel object
	 * @throws {Error} - If the channel is not found
	 *
	 */
	getChannelByURL: async (channelURL) => {
		try {
			// Extract the channel slug from the channelURL
			const channelSlug = channelURL.split('/').pop();

			// Get channel using slug
			const channel = await arena.getChannelBySlug(channelSlug);

			if (channelSlug == channel.slug) {
				return channel;
			} else {
				throw new Error('Channel not found');
			}

		} catch (error) {
			console.error(error);
		}
	},
	/**
	 * Get a channel by ID
	 * @param {string} channelID - The ID of the channel to search for
	 * @returns {object} - The channel object
	 * @throws {Error} - If the channel is not found
	 * 
	 * @example
	 * const channel = await arena.getChannelByID('1234567');
	 */
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
				throw new Error("Channel not found");
			}

		} catch (error) {
			throw error;
		}
	},
	/**
	 * Create a new channel with given name
	 * @param {string} channelName - The name of the channel to create
	 * @returns {object} - The channel object
	 * 
	 * @example
	 * const channel = await arena.createChannel('My New Channel');
	 * 
	 * // Returns
	 * {
	 *  "id": "1234567",
	 * "title": "My New Channel",
	 * "slug": "my-new-channel",
	 * "description": null,
	 * "created_at": "2020-05-01T00:00:00.000-00:00",
	 * 
	 * // ... more channel data
	 * }
	 * 
	 * @see https://dev.are.na/documentation/channels#create-a-channel
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

			// Return the channel object
			return response;
		} catch (error) {
			console.log(error);
			return error;
		}
	}
}

// Export the module
module.exports = arena;