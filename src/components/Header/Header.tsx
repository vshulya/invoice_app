import React from "react";
import { Link } from "react-router-dom";

function Header() {

	return (
		<header className="container">
			<nav>
				<ul>
					<li><Link to="/"><p className="logo">Invoice Generator</p></Link></li>
				</ul>
				<ul className="header__menu">
					<li><Link to="/about" className="link">
						About
					</Link></li>
				</ul>
			</nav>
		</header>
	)
}

export default Header;