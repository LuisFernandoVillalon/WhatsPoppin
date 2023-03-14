import React from 'react';
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import MessageBoard from "./pages/MessageBoard";


function App() {
  return (
    <div>
      <MessageBoard />
      {/* <BrowserRouter path="/">
        <Routes>
          <Route path="/" element={<MessageBoard />}/>
          <Route path="/post" element={<Post />}/>
        </Routes>
      </BrowserRouter> */}
    </div>
  );
}

export default App;
