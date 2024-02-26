import React, {useEffect, useState} from "react";
import axios from "axios";

const History = ({history}) => {
	const reversedHistory = history.slice().reverse(); // Create a copy of the array and reverse it
	return (
		<div>
			<h3 className="text-center">Song History</h3>
			<ul>
				{reversedHistory.map((song, index) => (
					<li style={{listStyleType: "none"}} key={index}>
						{song.name} - {song.artists.map((artist) => artist.name).join(", ")}
					</li>
				))}
			</ul>
		</div>
	);
};

const SpotifyPlayer = ({accessToken}) => {
	const [userData, setUserData] = useState(null);
	const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
	const [songHistory, setSongHistory] = useState([]);

	const fetchUserData = async () => {
		try {
			const response = await axios.get("https://api.spotify.com/v1/me", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			setUserData(response.data);
		} catch (error) {
			console.error("Error fetching user data:", error.response.data);
		}
	};

	const fetchCurrentlyPlaying = async () => {
		try {
			const response = await axios.get(
				"https://api.spotify.com/v1/me/player/currently-playing",
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			const currentTrack = response.data.item;
			setCurrentlyPlaying(currentTrack);
			console.log(currentTrack);
			// Update song history
			if (
				currentTrack &&
				!songHistory.some((song) => song.id === currentTrack.id)
			) {
				setSongHistory([...songHistory, currentTrack]);
			}
		} catch (error) {
			console.error(
				"Error fetching currently playing track:",
				error.response.data,
			);
		}
	};

	useEffect(() => {
		fetchUserData();
		fetchCurrentlyPlaying();
		const intervalId = setInterval(() => {
			fetchCurrentlyPlaying();
		}, 5000); // Refresh every 5 seconds

		return () => clearInterval(intervalId); // Clean up interval on component unmount
	}, [accessToken, songHistory]);

	return (
		<div>
			{userData && (
				<div className="text-center">
					<h2>Welcome, {userData.display_name}</h2>
				</div>
			)}
			{currentlyPlaying && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div className="card" style={{width: "18rem"}}>
						<div className="card-header">
							<h6 className="card-text text-center">Currently Playing</h6>
						</div>
						<div className="card-body">
							<h5 className="card-title text-center">
								Song: {currentlyPlaying.name}
							</h5>
							<p className="text-muted text-center">
								Album: {currentlyPlaying.album.name}
							</p>
							<p className="text text-center">
								Artist:{" "}
								{currentlyPlaying.artists
									.map((artist) => artist.name)
									.join(", ")}
							</p>
							<img
								className="rounded mx-auto d-block border"
								src={currentlyPlaying.album.images[0].url}
								alt="Album Cover"
								width={100}
							/>
						</div>
					</div>
				</div>
			)}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<History history={songHistory} />
			</div>
		</div>
	);
};

export default SpotifyPlayer;
