// Navbar.js
import React from "react";

const Navbar = ({accessToken, handleLogout}) => {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container justify-content-between">
				<a className="navbar-brand" href="#">
					Now Playing + Credits
				</a>
				<div className="text-end">
					{accessToken && (
						<button className="btn btn-info me-2" onClick={handleLogout}>
							Logout
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
