import React from "react";
import { Link } from "react-router-dom";
import CurrencyDropdown from "../CurrencyDropdown/CurrencyDropdown";

type CurrencyDropdownProps = {
  options: { value: string; label: string; shortLabel: string }[];
  setSelectedLabel: (shortLabel: string) => void;
};

function Header({ options, setSelectedLabel }: CurrencyDropdownProps) {
  return (
    <header className="container">
      <nav>
        <ul>
          <li>
            <Link to="/">
              <p className="logo">Invoice Generator</p>
            </Link>
          </li>
        </ul>
        <ul className="header__menu">
          <li>
            <Link to="/about" className="link">
              About
            </Link>
          </li>
          <li>
            <CurrencyDropdown
              options={options}
              setSelectedLabel={setSelectedLabel}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
