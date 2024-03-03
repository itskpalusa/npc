import React, {useState, useEffect} from "react";

const History = ({accessToken}) => {
	const [songs, setSongs] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					"https://api.spotify.com/v1/me/player/recently-played?limit=10",
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				const data = await response.json();
				setSongs(data.items);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		if (accessToken) {
			fetchData();
		}
	}, [accessToken]);

	return (
		<div>
			<h2>Last Listened Songs</h2>
			<ul>
				{songs &&
					songs.map((song, index) => (
						<li key={index}>
							{song.track.name} -{" "}
							{song.track.artists.map((artist) => artist.name).join(", ")}
						</li>
					))}
			</ul>
		</div>
	);
};

export default History;
