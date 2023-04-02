import About from "./About";
import HomeBoard from "./HomeBoard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getDownVoteList, getRecords, getUpVoteList } from '../MessageBoardSample/firebaseData';
import { useState, useEffect } from "react";
import Post from './Post';
import "../styles.css";
import Header from "./Header";
import CreatePost from "./CreatePost";

const Content = () => {
    const [masterBoard, setMasterBoard] = useState([]);
    const [currentPost, setCurrentPost] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [logIn, setLogIn] = useState(false);
    const [signUp, setSignUp] = useState(false);
    const [displayUserName, setDisplayUserName] = useState(localStorage.getItem("currentUser"));
    let temp = "";
    if (localStorage.getItem("loginStatus") === "false") {
        temp = false;
    } else {
        temp = true;
    }
    const [logInState, setLogInState] = useState(temp);
    const [entryMB, setEntryMB] = useState([]);
    const [currentUserUID, setCurrentUserUID] = useState("");
    const [upVoteList, setUpVoteList] = useState("");
    const [downVoteList, setDownVoteList] = useState("");

    // const [postVoteAmount, setPostVoteAmount] = useState(0);
    // const [downVoteStatus, setDownVoteStatus] = useState(false);
    // const [upVoteStatus, setUpVoteStatus] = useState(false);


    useEffect(() => {
        getRecords({ setMasterBoard, setEntryMB });
        getUpVoteList({setUpVoteList});
        getDownVoteList({setDownVoteList});
        setCurrentUserUID(localStorage.getItem("currentUserUID"));
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
                    logInState={logInState}
                    setLogInState={setLogInState}
                    displayUserName={displayUserName}
                    setDisplayUserName={setDisplayUserName}
                    currentUserUID={currentUserUID}
                    setCurrentUserUID={setCurrentUserUID}
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
                                                logInState={logInState}
                                                setLogInState={setLogInState}
                                                entryMB={entryMB}
                                                setEntryMB={setEntryMB}
                                                currentUserUID={currentUserUID}
                                                setCurrentUserUID={setCurrentUserUID}
                                                upVoteList={upVoteList}
                                                setUpVoteList={setUpVoteList}
                                                downVoteList={downVoteList}
                                                setDownVoteList={setDownVoteList}

                                                // postVoteAmount={postVoteAmount}
                                                // setPostVoteAmount={setPostVoteAmount}
                                                // downVoteStatus={downVoteStatus}
                                                // setDownVoteStatus={setDownVoteStatus}
                                                // upVoteStatus={upVoteStatus}
                                                // setUpVoteStatus={setUpVoteStatus}
                                            />}
                    />
                    <Route path="/post" element={<Post 
                                                    masterBoard={masterBoard}
                                                    setMasterBoard={setMasterBoard}
                                                    currentPost={currentPost}
                                                    setCurrentPost={setCurrentPost}
                                                    setLogIn={setLogIn}
                                                    setSignUp={setSignUp}
                                                    logInState={logInState}
                                                    currentUserUID={currentUserUID}
                                                    entryMB={entryMB}
                                                    upVoteList={upVoteList}
                                                    downVoteList={downVoteList}
                                                />}
                    />
                    <Route path="/create-post" element={<CreatePost 
                                                            currentUserUID={currentUserUID}
                                                        />}
                    />
                </Routes>
            </BrowserRouter> 
            <About />
      </div>

    )
}

export default Content;