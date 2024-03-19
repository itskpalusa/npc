import React from "react";

const BarChartBar = ({value}) => {
	// Function to determine the color of the progress bar based on popularity level
	const getProgressBarColor = () => {
		const colorPalette = [
			"#e41a1c", // Red
			"#ff7f00", // Orange
			"#fdbf6f", // Light orange
			"#ffcc33", // Yellow
			"#ffff99", // Pale yellow
			"#a6d96a", // Pale green
			"#4daf4a", // Green
			"#377eb8", // Blue
			"#984ea3", // Purple
			"#984ea3", // Purple
			"#377eb8", // Blue
			"#4daf4a", // Green
			"#a6d96a", // Pale green
			"#ffff99", // Pale yellow
			"#ffcc33", // Yellow
			"#fdbf6f", // Light orange
		];

		// Ensure value is within the range [0, 100]
		const clampedValue = Math.min(Math.max(value, 0), 100);

		// Calculate color index based on clamped value
		const colorIndex = Math.floor(clampedValue / 10);

		// Use the color palette with a fallback to a default color
		return colorPalette[colorIndex] || "#dcdcdc"; // Default color if index exceeds palette length
	};

	return (
		<div className="containercustom">
			<div className="row align-items-start">
				<div className="col">
					<div className="progress">
						<div
							className="progress-bar"
							role="progressbar"
							style={{
								width: `${value}%`,
								backgroundColor: getProgressBarColor(), // Set background color dynamically
							}}
							aria-valuenow={value}
							aria-valuemin="0"
							aria-valuemax="100"
						></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BarChartBar;
