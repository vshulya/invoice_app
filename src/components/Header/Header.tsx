import React from "react";

function Header() {

	return (
		<header className="container">
			<nav>
				<ul>
					<li><p className="logo">Invoice Generator</p></li>
				</ul>
				<ul className="header__menu">
					<li><a href="#" className="link">About</a></li>
					<li><a href="#" className="link">Contact</a></li>
				</ul>
			</nav>
		</header>
	)
}

export default Header;