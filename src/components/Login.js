import React from "react";

function Login() {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{" "}
			<header className="App-header">
				<a className="btn btn-primary" href="/auth/login">
					Login with Spotify
				</a>
			</header>
		</div>
	);
}

export default Login;
