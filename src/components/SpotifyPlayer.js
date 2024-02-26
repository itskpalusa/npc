import React, {useEffect, useState} from "react";
import axios from "axios";

const SpotifyPlayer = ({accessToken}) => {
	const [userData, setUserData] = useState(null);
	const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

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
			setCurrentlyPlaying(response.data.item);
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

		return () => clearInterval(intervalId);
	}, [accessToken]);

	return (
		<div>
			{userData && (
				<div>
					<h2>Welcome, {userData.display_name}</h2>
				</div>
			)}
			{currentlyPlaying && (
				<div>
					<h3>Currently Playing</h3>
					<p>Song: {currentlyPlaying.name}</p>
					<p>
						Artist:{" "}
						{currentlyPlaying.artists.map((artist) => artist.name).join(", ")}
					</p>
					<p>Album: {currentlyPlaying.album.name}</p>
					<img
						src={currentlyPlaying.album.images[0].url}
						alt="Album Cover"
						width={200}
					/>
				</div>
			)}
		</div>
	);
};

export default SpotifyPlayer;
