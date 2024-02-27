import React, {useState} from "react";
import axios from "axios";

const GeniusCredits = () => {
	const [songName, setSongName] = useState("");
	const [artistName, setArtistName] = useState("");
	const [producers, setProducers] = useState("");
	const [writers, setWriters] = useState("");
	const [error, setError] = useState(null);

	const searchSong = async () => {
		try {
			// First response to search for the song
			const response = await axios.get(
				`https://api.genius.com/search?q=${songName} ${artistName}&access_token=HSpJDGiFMsHxm9StKheXxSTCpuNSWr1dtKqaj69rS5dlBfH2Wgz3v2xUAL8X6vzY`,
			);

			console.log(response.data.response.hits[0].result.api_path); // Print path

			// With url from above search again to get song data
			const songData = await axios.get(
				`https://api.genius.com${response.data.response.hits[0].result.api_path}?access_token=HSpJDGiFMsHxm9StKheXxSTCpuNSWr1dtKqaj69rS5dlBfH2Wgz3v2xUAL8X6vzY`,
			);
			// Print song info
			console.log(songData.data.response.song);

			// Assign song to variable
			const parsedSongData = songData.data.response.song;

			// Assign producers and writers to array with conditional if only one producer

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

	return (
		<div>
			<input
				type="text"
				placeholder="Song Name"
				value={songName}
				onChange={(e) => setSongName(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Artist Name"
				value={artistName}
				onChange={(e) => setArtistName(e.target.value)}
			/>
			<button onClick={searchSong}>Search</button>

			{error && <p>{error}</p>}
			{producers.length > 0 && (
				<div>
					<p>Producers:</p>
					<ul>
						{producers.map((producer, index) => (
							<li key={index}>{producer}</li>
						))}
					</ul>
				</div>
			)}
			{writers.length > 0 && (
				<div>
					<p>Writers:</p>
					<ul>
						{writers.map((writer, index) => (
							<li key={index}>{writer}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default GeniusCredits;
