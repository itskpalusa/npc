import React from "react";
import "./SongPopularityIndicator.css";

const SongPopularityIndicator = ({songPopularity}) => {
	// Function to determine the color of the progress bar based on popularity level
	const getProgressBarColor = () => {
		if (songPopularity > 30) {
			return "bg-success";
		} else if (songPopularity < 70) {
			return "bg-warning";
		} else {
			return "bg-danger";
		}
	};

	return (
		<div className="containercustom">
			<div className="row align-items-start">
				<div className="col">
					<i className="fa-solid fa-fire text-center"></i>

					<div className="progress vertical">
						<div
							className={`progress-bar vertical ${getProgressBarColor()}`}
							role="progressbar"
							style={{
								transform: `scaleY(${songPopularity / 100})`,
								transformOrigin: "bottom",
							}}
							aria-valuenow={songPopularity}
							aria-valuemin="0"
							aria-valuemax="100"
						></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SongPopularityIndicator;
