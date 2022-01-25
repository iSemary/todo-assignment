import React from "react";
import "./assets/App.css";
import 'izitoast/dist/css/iziToast.min.css';

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Welcome from "./Components/Views/Welcome";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
