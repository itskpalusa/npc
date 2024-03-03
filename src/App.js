import React, {useEffect, useState} from "react";
import axios from "axios";

import SpotifyPlayer from "./components/SpotifyPlayer";
import GeniusCredits from "./components/GeniusCredits";
import CurrentlyPlayingCredits from "./components/CurrentlyPlayingCredits";
import History from "./components/History";
const App = () => {
	const [accessToken, setAccessToken] = useState("");
	const [currentSong, setCurrentSong] = useState(null);

	useEffect(() => {
		const handleCallback = async () => {
			const code = new URLSearchParams(window.location.search).get("code");
			if (code) {
				try {
					const params = new URLSearchParams();
					params.append("grant_type", "authorization_code");
					params.append("code", code);
					params.append("redirect_uri", "http://localhost:3000/callback");
					params.append("client_id", "100c1e60363c4829906eff1efa932728");
					params.append("client_secret", "a06a51e0f9544e7f916751cf3aed9ab4");

					const response = await axios.post(
						"https://accounts.spotify.com/api/token",
						params,
						{
							headers: {
								"Content-Type": "application/x-www-form-urlencoded",
							},
						},
					);

					const {access_token} = response.data;
					setAccessToken(access_token);
					localStorage.setItem("accessToken", access_token);
				} catch (error) {
					console.error(
						"Error exchanging code for access token:",
						error.response.data,
					);
				}
			}
		};

		handleCallback();
	}, []);

	const handleLogin = () => {
		const clientId = "100c1e60363c4829906eff1efa932728";
		const redirectUri = encodeURIComponent("http://localhost:3000/callback");
		const scopes = encodeURIComponent(
			"user-read-private user-read-email user-read-currently-playing user-read-recently-played user-modify-playback-state",
		);

		const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;
		window.location.href = authUrl;
	};

	const handleSongChange = (song) => {
		setCurrentSong(song);
	};

	return (
		<div className="container">
			<div>
				<div className="text-center">
					<h1>Now Playing Credits</h1>
				</div>
				<div>
					{accessToken ? (
						<div>
							<SpotifyPlayer
								accessToken={accessToken}
								onSongChange={handleSongChange}
							/>

							<CurrentlyPlayingCredits currentSong={currentSong} />
						</div>
					) : (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<div className="btn btn-primary" onClick={handleLogin}>
								Log in with Spotify
							</div>
						</div>
					)}
				</div>
			</div>
			<hr style={ { width: "75%", height: "2px", color: "black" } }></hr>
			
			<History accessToken={accessToken} />
		</div>
	);
};

export default App;
