import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter path="/javascript-final-project---the-odin-project">
        <Routes>
          <Route path="/javascript-final-project---the-odin-project" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
