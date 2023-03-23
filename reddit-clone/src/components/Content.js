import About from "./About";
import HomeBoard from "./HomeBoard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getRecords } from '../MessageBoardSample/firebaseData';
import { useState, useEffect } from "react";
import Post from './Post';
import "../styles.css";
import Header from "./Header";

const Content = () => {
    const [masterBoard, setMasterBoard] = useState([]);
    const [currentPost, setCurrentPost] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [logIn, setLogIn] = useState(false);
    const [signUp, setSignUp] = useState(false);


    useEffect(() => {
        getRecords({ setMasterBoard});
    }, []);
    return (

        <div className="content-container">
            
            <BrowserRouter path="/">
                <Header 
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    masterBoard={masterBoard}
                    searchResult={searchResult}
                    setSearchResult={setSearchResult}
                    setCurrentPost={setCurrentPost}
                    logIn={logIn}
                    setLogIn={setLogIn}
                    signUp={signUp}
                    setSignUp={setSignUp}
                />
                <Routes >
                    <Route path="/" element={<HomeBoard 
                        masterBoard={masterBoard}
                        setMasterBoard={setMasterBoard}
                        currentPost={currentPost}
                        setCurrentPost={setCurrentPost}
                        logIn={logIn}
                        setLogIn={setLogIn}
                        signUp={signUp}
                        setSignUp={setSignUp}
                    />}/>
                    <Route path="/post" element={<Post 
                        masterBoard={masterBoard}
                        setMasterBoard={setMasterBoard}
                        currentPost={currentPost}
                        setCurrentPost={setCurrentPost}
                        setLogIn={setLogIn}
                        setSignUp={setSignUp}
                    />}/>
                </Routes>
            </BrowserRouter> 
            <About />
      </div>



        // <div className="content-container">
        //     <div>
        //         <HomeBoard /> 
        //     </div>
        //     <div>
        //         <About />
        //     </div>
        // </div>
    )
}

export default Content;