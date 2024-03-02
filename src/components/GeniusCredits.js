import React, {useState, useEffect} from "react";
import axios from "axios";

const GeniusCredits = ({currentSong}) => {
	const [songName, setSongName] = useState("");
	const [artistName, setArtistName] = useState("");
	const [producers, setProducers] = useState("");
	const [writers, setWriters] = useState("");
	const [error, setError] = useState(null);

	useEffect(() => {
		if (songName && artistName) {
			searchSong();
		}
	}, [songName, artistName]);

	const searchSong = async () => {
		try {
			const response = await axios.get(
				`https://api.genius.com/search?q=${songName} ${artistName}&access_token=HSpJDGiFMsHxm9StKheXxSTCpuNSWr1dtKqaj69rS5dlBfH2Wgz3v2xUAL8X6vzY`,
			);

			const songData = await axios.get(
				`https://api.genius.com${response.data.response.hits[0].result.api_path}?access_token=HSpJDGiFMsHxm9StKheXxSTCpuNSWr1dtKqaj69rS5dlBfH2Wgz3v2xUAL8X6vzY`,
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
			<div>
				<button
					className="btn btn-secondary"
					onClick={getCurrentlyPlayingSongDetails}
				>
					Get Credits of Current Song
				</button>
			</div>
			<br />
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					marginBottom: "3mm",
				}}
			>
				{" "}
				<form
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<div className="form-row align-items-center">
						<div className="col">
							<input
								id="songNameField"
								className="form-rowform-group"
								placeholder="Song Name"
								value={songName}
								onChange={(e) => setSongName(e.target.value)}
							/>
						</div>
						<div className="col">
							<input
								id="songArtistName"
								className="form-rowform-group"
								type="text"
								placeholder="Artist Name"
								value={artistName}
								onChange={(e) => setArtistName(e.target.value)}
							/>
						</div>
						<div className="col">
							<button className="btn btn-primary" onClick={searchSong}>
								Search
							</button>
						</div>
					</div>
				</form>
			</div>
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
											<li key={index}>{producer}</li>
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
											<li key={index}>{writer}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GeniusCredits;
