import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MessageBoard from "./pages/MessageBoard";

function App() {
  return (
    <div>
      <BrowserRouter path="/">
        <Routes>
          <Route path="/" element={<MessageBoard />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
