const request = require("request");
const dotenv = require("dotenv");

dotenv.config();

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyRedirectUri = "http://localhost:3000/auth/callback";

const generateRandomString = function (length) {
	var text = "";
	var possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

exports.handler = async (event, context) => {
	const {queryStringParameters} = event;
	const {code} = queryStringParameters;

	if (event.path === "/auth/login") {
		var scope =
			"user-read-private user-read-email user-read-currently-playing user-read-recently-played user-modify-playback-state playlist-read-collaborative user-library-read";

		var state = generateRandomString(16);

		var auth_query_parameters = new URLSearchParams({
			response_type: "code",
			client_id: spotifyClientId,
			scope: scope,
			redirect_uri: spotifyRedirectUri,
			state: state,
		});

		return {
			statusCode: 302,
			headers: {
				Location: `https://accounts.spotify.com/authorize/?${auth_query_parameters.toString()}`,
			},
			body: "",
		};
	}

	if (event.path === "/auth/callback") {
		const authOptions = {
			url: "https://accounts.spotify.com/api/token",
			form: {
				code: code,
				redirect_uri: spotifyRedirectUri,
				grant_type: "authorization_code",
			},
			headers: {
				Authorization: `Basic ${Buffer.from(
					`${spotifyClientId}:${spotifyClientSecret}`,
				).toString("base64")}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			json: true,
		};

		return new Promise((resolve, reject) => {
			request.post(authOptions, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					const accessToken = body.access_token;
					resolve({
						statusCode: 302,
						headers: {
							Location: "/",
						},
						body: "",
					});
				} else {
					reject(error);
				}
			});
		});
	}

	if (event.path === "/auth/token") {
		return {
			statusCode: 200,
			body: JSON.stringify({access_token: global.access_token}),
		};
	}

	return {
		statusCode: 404,
		body: "Not Found",
	};
};
