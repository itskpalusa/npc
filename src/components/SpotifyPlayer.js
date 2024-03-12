import React, {useEffect, useState} from "react";
import axios from "axios";
import SongPopularityIndicator from "./SongPopularityIndicator";

const SpotifyPlayer = ({accessToken, onSongChange}) => {
	const [userData, setUserData] = useState(null);
	const [lastPlayed, setLastPlayed] = useState(null);
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
			const currentTrack = response.data.item;
			if (currentTrack && currentTrack.album.id !== null) {
				onSongChange(currentTrack);
				setCurrentlyPlaying(currentTrack);
			} else {
				// Fetch last played if nothing currently playing or current track has no album ID
				fetchLastPlayed();
			}
		} catch (error) {
			console.error(
				"Error fetching currently playing track:",
				error.response.data,
			);
		}
	};

	const fetchLastPlayed = async () => {
		try {
			const response = await axios.get(
				"https://api.spotify.com/v1/me/player/recently-played?limit=1",
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			const lastPlayedTrack = response.data.items[0].track;
			setLastPlayed(lastPlayedTrack);
		} catch (error) {
			console.error("Error fetching last played track:", error.response.data);
		}
	};

	const handleNextSong = async () => {
		try {
			await axios.post(
				"https://api.spotify.com/v1/me/player/next",
				{},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			// Fetch and update the currently playing song
			fetchCurrentlyPlaying();
		} catch (error) {
			console.error("Error playing next song:", error.response.data);
		}
	};

	const handlePreviousSong = async () => {
		try {
			await axios.post(
				"https://api.spotify.com/v1/me/player/previous",
				{},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			// Fetch and update the currently playing song
			fetchCurrentlyPlaying();
		} catch (error) {
			console.error("Error playing previous song:", error.response.data);
		}
	};

	useEffect(() => {
		fetchUserData();
		fetchCurrentlyPlaying();
		const intervalId = setInterval(() => {
			fetchCurrentlyPlaying();
		}, 5000); // Refresh every 10 seconds

		return () => clearInterval(intervalId); // Clean up interval on component unmount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accessToken]);

	return (
		<div className="container">
			{userData && (
				<div>
					<div className="text-center">
						<h2>Welcome, {userData.display_name}</h2>
					</div>{" "}
					<hr style={{width: "75%", height: "2px", color: "black"}}></hr>
					<div className="text-center">
						<h2>Currently Playing</h2>
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
				<div className="row">
					{" "}
					<div className="col align-self-center">
						<button className="btn btn-primary" onClick={handlePreviousSong}>
							<i className="fa-solid fa-arrow-left-long"></i>{" "}
						</button>
					</div>
					{currentlyPlaying && (
						<div>
							<div className="col">
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
							<br />
							<div className="col">
								<div className="card" style={{width: "18rem"}}>
									<div className="card-header">
										<h6 className="card-text text-center">
											Popularity: {currentlyPlaying.popularity}
										</h6>
									</div>
									<div className="card-body">
										<SongPopularityIndicator
											songPopularity={currentlyPlaying.popularity}
										/>
									</div>
								</div>
							</div>
						</div>
					)}
					<div className="col align-self-center">
						<button className="btn btn-primary" onClick={handleNextSong}>
							<i className="fa-solid fa-arrow-right-long"></i>{" "}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SpotifyPlayer;
