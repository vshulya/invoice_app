import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from '../Header/Header';
import Main from "../Main/Main";
import About from "../About/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"
          element={
            <>
              <Header />
              <Main />
            </>} />
        <Route path="/about"
          element={
            <>
              <Header />
              <About />
            </>} />
      </Routes>
    </Router>
  );
}

export default App;
