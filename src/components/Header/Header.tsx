import React from "react";
import { Link } from "react-router-dom";
import CurrencyDropdown from "../CurrencyDropdown/CurrencyDropdown";

type CurrencyDropdownProps = {
	options: { value: string, label: string, shortLabel: string }[],
	setSelectedValue: (value: string) => void,
	setSelectedLabel: (shortLabel: string) => void
};

function Header({ options, setSelectedValue, setSelectedLabel }: CurrencyDropdownProps) {

	return (
		<header className="container">
			<nav>
				<ul>
					<li><Link to="/"><p className="logo">Invoice Generator</p></Link></li>
				</ul>
				<ul className="header__menu">
					<li>
						<Link to="/about" className="link">About</Link>
					</li>
					<li><CurrencyDropdown
						options={options}
						setSelectedValue={setSelectedValue}
						setSelectedLabel={setSelectedLabel} />
					</li>
				</ul>
			</nav>
		</header>
	)
}

export default Header;