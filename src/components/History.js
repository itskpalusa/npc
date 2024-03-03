import React, {useState, useEffect} from "react";

const History = ({accessToken}) => {
	const [songs, setSongs] = useState([]);
	const [error, setError] = useState(null);

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
				setError("Failed to fetch song data. Please try again.");
			}
		};

		const fetchInterval = setInterval(() => {
			if (accessToken) {
				fetchData();
			}
		}, 60000); // Fetch data every minute

		return () => {
			clearInterval(fetchInterval); // Clear interval on unmount
		};
	}, [accessToken]);

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{" "}
			<div className="row" style={{paddingBottom: "5px"}}>
				<div className="col">
					<div className="card" style={{width: "18rem"}}>
						{error && <p>{error}</p>}
						<div>
							<div className="card-header">
								<h6 className="card-text text-center">Last Listened Songs</h6>
							</div>{" "}
							<ul
								style={{
									listStyle: "none",
									paddingLeft: "0",
									paddingBottom: "5px",
								}}
								className="text-center"
							>
								{songs &&
									songs.map((song, index) => (
										<li key={index}>
											{song.track.name} -{" "}
											{song.track.artists
												.map((artist) => artist.name)
												.join(", ")}
										</li>
									))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default History;
