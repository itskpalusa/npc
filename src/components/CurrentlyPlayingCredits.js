import React, {useState, useEffect} from "react";
import axios from "axios";

const CurrentlyPlayingCredits = ({currentSong}) => {
	const [songName, setSongName] = useState("");
	const [artistName, setArtistName] = useState("");
	const [producers, setProducers] = useState("");
	const [writers, setWriters] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
const access_tk = "INSERT GENIUS ACCESS KEY";
useEffect(() => {
	if (currentSong) {
		getCurrentlyPlayingSongDetails();
	}
}, [currentSong]);

useEffect(() => {
	if (songName && artistName) {
		searchSong();
	}
}, [songName, artistName]);

const searchSong = async () => {
	setLoading(true); // Set loading to true when search is initiated

	try {
		const response = await axios.get(
			`https://api.genius.com/search?q=${songName} ${artistName}&access_token=${access_tk}`,
		);

		const songData = await axios.get(
			`https://api.genius.com${response.data.response.hits[0].result.api_path}?access_token=${access_tk}`,
		);

		const parsedSongData = songData.data.response.song;
		const producers = Array.isArray(parsedSongData.producer_artists)
			? parsedSongData.producer_artists.map((producer) => producer.name)
			: [];
		const writers = Array.isArray(parsedSongData.writer_artists)
			? parsedSongData.writer_artists.map((writer) => writer.name)
			: [];

		setProducers(producers);
		setWriters(writers);
		setError(null);
	} catch (error) {
		setError("Failed to fetch song data. Please try again.");
	} finally {
		setLoading(false); // Set loading to false after search is completed (whether successful or failed)
	}
};

	const getCurrentlyPlayingSongDetails = () => {
		let updatedSongName = "";
		let updatedArtistName = "";

		if (currentSong.name.includes("(")) {
			updatedSongName = currentSong.name.split("(")[0];
			updatedArtistName = currentSong.artists[0].name;
		} else if (currentSong.name.includes("-")) {
			updatedSongName = currentSong.name.split("-")[0];
			updatedArtistName = currentSong.artists[0].name;
		} else {
			updatedSongName = currentSong.name;
			updatedArtistName = currentSong.artists
				.map((artist) => artist.name)
				.join(", ");
		}

		setSongName(updatedSongName);
		setArtistName(updatedArtistName);
	};

	return (
		<div className="container">
			<br />
			{loading ? (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div
						className="spinner-border"
						style={{
							width: "3rem",
							height: "3rem",
						}}
						role="status"
					>
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			) : (
				<div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<div className="row" style={{paddingBottom: "5px"}}>
							<div className="col">
								<div className="card" style={{width: "18rem"}}>
									{error && <p>{error}</p>}
									{producers.length > 0 && (
										<div>
											<div className="card-header">
												<h6 className="card-text text-center">Producers</h6>
											</div>{" "}
											<ul style={{listStyle: "none", paddingLeft: "0"}}>
												{producers.map((producer, index) => (
													<li className="text-center" key={index}>
														{producer}
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>

							<div className="col">
								<div className="card" style={{width: "18rem"}}>
									{writers.length > 0 && (
										<div>
											<div className="card-header">
												<h6 className="card-text text-center">Writers</h6>
											</div>{" "}
											<ul style={{listStyle: "none", paddingLeft: "0"}}>
												{writers.map((writer, index) => (
													<li className="text-center" key={index}>
														{writer}
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CurrentlyPlayingCredits;
