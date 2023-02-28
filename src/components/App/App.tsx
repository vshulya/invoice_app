import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from '../Header/Header';
import Main from "../Main/Main";
import About from "../About/About";

function App() {

  const options = [
    { value: 'USD', label: 'USD ($)', shortLabel: '$' },
    { value: 'EUR', label: 'EUR (€)', shortLabel: '€' },
    { value: 'JPY', label: 'JPY (¥)',  shortLabel: '¥' },
    { value: 'GBP', label: 'GBP (£)', shortLabel: '£' },
    { value: 'AUD', label: 'AUD (A$)', shortLabel: 'A$' },
    { value: 'CAD', label: 'CAD (CA$)', shortLabel: 'CA$' },
  ];

  const [selectedValue, setSelectedValue] = useState(options[0].value);
  const [selectedLabel, setSelectedLabel] = useState(options[0].shortLabel);

  return (
    <Router>
      <Routes>
        <Route path="/"
          element={
            <>
              <Header
                options={options}
                setSelectedValue={setSelectedValue}
                setSelectedLabel={setSelectedLabel} />
              <Main
                selectedValue={selectedValue}
                selectedLabel={selectedLabel} />
            </>} />
        <Route path="/about"
          element={
            <>
              <Header
                options={options}
                setSelectedValue={setSelectedValue}
                setSelectedLabel={setSelectedLabel}  />
              <About />
            </>} />
      </Routes>
    </Router>
  );
}

export default App;
