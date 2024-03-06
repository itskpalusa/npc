import React, {useEffect, useState} from "react";

import SpotifyPlayer from "./components/SpotifyPlayer";
import CurrentlyPlayingCredits from "./components/CurrentlyPlayingCredits";
import History from "./components/History";
import Login from "./components/Login";

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
						<Login />
					)}
				</div>
			</div>
			<hr style={{width: "75%", height: "2px", color: "black"}}></hr>

			<History accessToken={accessToken} />
		</div>
	);
};

export default App;
