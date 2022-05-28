const axios = require("axios");
const baseURL = "http://api.are.na/v2/channels/arena-influences";

const func = async () => {
	try {
		const response = await axios.get(baseURL, {
			params: {
				"page": 1,
				"per": 15
			}
		} );
		return response;
	} catch (error) {
		console.error(error);
	}
}

module.exports = {
	func
}

