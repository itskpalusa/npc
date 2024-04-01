// App.js
import React, {useEffect, useState} from "react";

import SpotifyPlayer from "./components/SpotifyPlayer";
import CurrentlyPlayingCredits from "./components/CurrentlyPlayingCredits";
// import History from "./components/History";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

const App = () => {
	const [accessToken, setAccessToken] = useState("");
	const [currentSong, setCurrentSong] = useState(null);

	useEffect(() => {
		async function getToken() {
			const response = await fetch("/auth/token");
			const json = await response.json();
			setAccessToken(json.access_token);
		}

		getToken();
	}, []);

	const handleSongChange = (song) => {
		setCurrentSong(song);
	};

	const handleLogout = () => {
		// Clear access token
		setAccessToken("");
	};

	return (
		<div>
			<Navbar handleLogout={handleLogout} accessToken={accessToken} />
			<div className="container">
				<div>
					<div>
						{accessToken ? (
							<div>
								<SpotifyPlayer
									accessToken={accessToken}
									onSongChange={handleSongChange}
								/>
								<hr style={{width: "75%", height: "2px", color: "black"}}></hr>
								<div className="text-center">
									<h2>Song Credits</h2>
								</div>
								<CurrentlyPlayingCredits currentSong={currentSong} />
							</div>
						) : (
							<Login />
						)}
					</div>
				</div>

				{/* <History accessToken={accessToken} /> */}
			</div>
		</div>
	);
};

export default App;
