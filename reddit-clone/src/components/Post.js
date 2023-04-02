import { CaretUpFill, CaretDownFill, ChatSquare, BoxArrowUpRight } from 'react-bootstrap-icons'; 
import  CommentSection  from "./CommentSection";
import uniqid from 'uniqid';
import { useState, useEffect } from "react";
import { upVoteIndividualPostFirebase, downVoteIndividualPostFirebase } from '../MessageBoardSample/firebaseData';

const Post = ({masterBoard,
    setMasterBoard,
    currentPost,
    setCurrentPost,
    logIn,
    setLogIn,
    signUp,
    setSignUp,
    logInState,
    currentUserUID,
    entryMB,
    upVoteList,
    downVoteList
}) => {
    let type = currentPost.type;
    
     if (type === "text") {
         return ( <TextPostPage 
                        masterBoard={masterBoard}
                        setMasterBoard={setMasterBoard}
                        currentPost={currentPost}
                        setCurrentPost={setCurrentPost}
                        logIn={logIn}
                        setLogIn={setLogIn}
                        signUp={signUp}
                        setSignUp={setSignUp} 
                        logInState={logInState}
                        currentUserUID={currentUserUID}
                        entryMB={entryMB}
                        upVoteList={upVoteList}
                        downVoteList={downVoteList}
                        key={uniqid()}
                /> )
      }  else if (type === "image") {
         return ( <ImagePostPage
                        masterBoard={masterBoard}
                        setMasterBoard={setMasterBoard}
                        currentPost={currentPost}
                        setCurrentPost={setCurrentPost}
                        logIn={logIn}
                        setLogIn={setLogIn}
                        signUp={signUp}
                        setSignUp={setSignUp} 
                        logInState={logInState}
                        currentUserUID={currentUserUID}
                        entryMB={entryMB}
                        upVoteList={upVoteList}
                        downVoteList={downVoteList}
                        key={uniqid()}
                /> )
      } else if (type === "link") {
         return ( <LinkPostPage 
                        masterBoard={masterBoard}
                        setMasterBoard={setMasterBoard}
                        currentPost={currentPost}
                        setCurrentPost={setCurrentPost}
                        logIn={logIn}
                        setLogIn={setLogIn}
                        signUp={signUp}
                        setSignUp={setSignUp} 
                        logInState={logInState}
                        currentUserUID={currentUserUID}
                        entryMB={entryMB}
                        upVoteList={upVoteList}
                        downVoteList={downVoteList}
                        key={uniqid()}
                /> )
     }
}
const displaySignUp = ({setSignUp}) => {
    setSignUp(true);
}
const displayLogIn = ({setLogIn}) => {
    setLogIn(true);
}
const upVotePost = (postVoteAmount, currentPost, currentUserUID, entryMB) => {
    const props = {currentPost, currentUserUID, entryMB};
    upVoteIndividualPostFirebase(postVoteAmount + 1, props);
}
const downVotePost = (postVoteAmount, currentPost, currentUserUID, entryMB) => {
    const props = {currentPost, currentUserUID, entryMB};
    downVoteIndividualPostFirebase(postVoteAmount - 1, props);
}
const TextPostPage = ({
    masterBoard,
    setMasterBoard,
    currentPost,
    setCurrentPost,
    logIn,
    setLogIn,
    signUp,
    setSignUp,
    logInState,
    currentUserUID,
    entryMB,
    upVoteList,
    downVoteList
}) => {
   
    let commentAmount = 0;
    if (currentPost.comments[0] === "") {
        commentAmount = 0;
    } else {
        commentAmount = currentPost.comments.length;
    }

    const [postVoteAmount, setPostVoteAmount] = useState(0);
    const [downVoteStatus, setDownVoteStatus] = useState(false);
    const [upVoteStatus, setUpVoteStatus] = useState(false);
    useEffect(() => {
        const tempMB = Object.entries(masterBoard);
        tempMB.map((currentPostID) => {
            if (currentPostID[0] === currentPost.newUserKey) {
                setPostVoteAmount(currentPostID[1].voteAmount)
            }
        })
        let upVoteListArray = Object.entries(upVoteList);
        upVoteListArray.map((user) => {
            let tempUID = "";
            if (typeof currentUserUID !== "string") {
                tempUID = currentUserUID.uid;
            }
            if (user[0] === currentUserUID || user[0] === tempUID) {
                let userArray = Object.entries(user[1]);
                userArray.map((likedPost) => {
                    if (currentPost.newUserKey === likedPost[0]) {
                        if (likedPost[1].upVoteState === true) {
                            setUpVoteStatus(true);
                        }
                    }
                    
                })
            }
        });
        let downVoteListArray = Object.entries(downVoteList);
        downVoteListArray.map((user) => {
            let tempUID = "";
            if (typeof currentUserUID !== "string") {
                tempUID = currentUserUID.uid;
            }
            if (user[0] === currentUserUID || user[0] === tempUID) {
                let userArray = Object.entries(user[1]);
                userArray.map((unLikedPost) => {
                    if (currentPost.newUserKey === unLikedPost[0]) {
                        if (unLikedPost[1].downVoteState === true) {
                            setDownVoteStatus(true);
                        }
                    }
                    
                })
            }
        });
    }, [currentPost.voteAmount]);

    return (
        <div className="individual-post-page" >
        {!logInState && <div className="first-column">
                            <CaretUpFill className='upArrow' onClick={() => displaySignUp({setSignUp})}/>
                                {postVoteAmount}
                            <CaretDownFill className='downArrow' onClick={() => displaySignUp({setSignUp})}/>
                        </div>
        }
        {logInState && <div className="first-column">
                            {upVoteStatus ? <CaretUpFill className='upArrowActive'/> : <CaretUpFill  onClick={() => upVotePost(postVoteAmount, currentPost, currentUserUID, entryMB)} className='upArrow'/>}                                                                                                        
                                {postVoteAmount}
                            {downVoteStatus ? <CaretDownFill className='downArrowActive'/> : <CaretDownFill onClick={() => downVotePost(postVoteAmount, currentPost, currentUserUID, entryMB)} className='downArrow'/>}                                                                                                             
                        </div>
        }
        <div className="second-column-page">
             <div className='post-user'>Posted by {currentPost.user}<TimeCommentPosted 
                                                                        currentPost={currentPost}
                                                                        key={uniqid()}
                                                                    />
             </div>
             <div className='post-title'>{currentPost.title}</div>
             <div className="post-text">{currentPost.content}</div>
             <div className='post-comments'><ChatSquare /> {commentAmount} Comments</div>
            {!logInState && <div className='login-post-container'>
                                <p>Log in or sign up to leave a comment</p>
                                <div className='button-post-container'>
                                    <button className='button-post-login' onClick={() => displayLogIn({setLogIn})}>LOG IN</button>
                                    <button className='button-post-login' onClick={() => displaySignUp({setSignUp})}>SIGN UP</button>
                                </div>
                            </div>
            }
            {logInState && <div className='post-comment-container'>
                                <p className='comment-label'>Comment as {localStorage.getItem("currentUser")}</p>
                                <div className='post-comment-input-container'>
                                    <textarea className='post-comment-input' placeholder='What are your thoughts?'></textarea>
                                    <div className='post-comment-button-container'>
                                        <button className='post-comment-button'>COMMENT</button>
                                    </div>
                                </div>
                           </div>
            }
             <CommentSection 
                masterBoard={masterBoard}
                setMasterBoard={setMasterBoard}
                currentPost={currentPost}
                setCurrentPost={setCurrentPost}
                logIn={logIn}
                setLogIn={setLogIn}
                signUp={signUp}
                setSignUp={setSignUp} 
                key={uniqid()}
             />
        </div>
        
     </div>
    )
}
const ImagePostPage = ({
    masterBoard,
    setMasterBoard,
    currentPost,
    setCurrentPost,
    logIn,
    setLogIn,
    signUp,
    setSignUp,
    logInState,
    currentUserUID,
    entryMB,
    upVoteList,
    downVoteList
}) => {
    let commentAmount = 0;
    if (currentPost.comments[0] === "") {
        commentAmount = 0;
    } else {
        commentAmount = currentPost.comments.length;
    }

    const [postVoteAmount, setPostVoteAmount] = useState(0);
    const [downVoteStatus, setDownVoteStatus] = useState(false);
    const [upVoteStatus, setUpVoteStatus] = useState(false);
    useEffect(() => {
        const tempMB = Object.entries(masterBoard);
        tempMB.map((currentPostID) => {
            if (currentPostID[0] === currentPost.newUserKey) {
                setPostVoteAmount(currentPostID[1].voteAmount)
            }
        })
        let upVoteListArray = Object.entries(upVoteList);
        upVoteListArray.map((user) => {
            let tempUID = "";
            if (typeof currentUserUID !== "string") {
                tempUID = currentUserUID.uid;
            }
            if (user[0] === currentUserUID || user[0] === tempUID) {
                let userArray = Object.entries(user[1]);
                userArray.map((likedPost) => {
                    if (currentPost.newUserKey === likedPost[0]) {
                        if (likedPost[1].upVoteState === true) {
                            setUpVoteStatus(true);
                        }
                    }
                    
                })
            }
        });
        let downVoteListArray = Object.entries(downVoteList);
        downVoteListArray.map((user) => {
            let tempUID = "";
            if (typeof currentUserUID !== "string") {
                tempUID = currentUserUID.uid;
            }
            if (user[0] === currentUserUID || user[0] === tempUID) {
                let userArray = Object.entries(user[1]);
                userArray.map((unLikedPost) => {
                    if (currentPost.newUserKey === unLikedPost[0]) {
                        if (unLikedPost[1].downVoteState === true) {
                            setDownVoteStatus(true);
                        }
                    }
                    
                })
            }
        });
    }, [currentPost.voteAmount]);

    return (
        <div className="individual-post-page">
        {!logInState && <div className="first-column">
                            <CaretUpFill className='upArrow' onClick={() => displaySignUp({setSignUp})}/>
                                {postVoteAmount}
                            <CaretDownFill className='downArrow' onClick={() => displaySignUp({setSignUp})}/>
                        </div>
        }
        {logInState && <div className="first-column">
                            {upVoteStatus ? <CaretUpFill className='upArrowActive'/> : <CaretUpFill  onClick={() => upVotePost(postVoteAmount, currentPost, currentUserUID, entryMB)} className='upArrow'/>}                                                                                                        
                                {postVoteAmount}
                            {downVoteStatus ? <CaretDownFill className='downArrowActive'/> : <CaretDownFill onClick={() => downVotePost(postVoteAmount, currentPost, currentUserUID, entryMB)} className='downArrow'/>}                                                                                                             
                        </div>
        }
            <div className="second-column-page">
                <div className='post-user'>Posted by {currentPost.user}<TimeCommentPosted currentPost={currentPost} key={uniqid()}/></div>
                <div className='post-title'>{currentPost.title}</div>
                <img alt="post" src={currentPost.content} className="post-image"/>
                <div className='post-comments'><ChatSquare key={uniqid()} /> {commentAmount} Comments</div>
                {!logInState && <div className='login-post-container'>
                                <p>Log in or sign up to leave a comment</p>
                                <div className='button-post-container'>
                                    <button className='button-post-login' onClick={() => displayLogIn({setLogIn})}>LOG IN</button>
                                    <button className='button-post-login' onClick={() => displaySignUp({setSignUp})}>SIGN UP</button>
                                </div>
                            </div>
                }
                {logInState && <div className='post-comment-container'>
                                <p className='comment-label'>Comment as {localStorage.getItem("currentUser")}</p>
                                <div className='post-comment-input-container'>
                                    <textarea className='post-comment-input' placeholder='What are your thoughts?'></textarea>
                                    <div className='post-comment-button-container'>
                                        <button className='post-comment-button'>COMMENT</button>
                                    </div>
                                </div>
                           </div>
                }
                <CommentSection 
                    masterBoard={masterBoard}
                    setMasterBoard={setMasterBoard}
                    currentPost={currentPost}
                    setCurrentPost={setCurrentPost}
                    logIn={logIn}
                    setLogIn={setLogIn}
                    signUp={signUp}
                    setSignUp={setSignUp} 
                    key={uniqid()}
                 />
            </div>
     </div>
    )
}
const LinkPostPage = ({
    masterBoard,
    setMasterBoard,
    currentPost,
    setCurrentPost,
    logIn,
    setLogIn,
    signUp,
    setSignUp,
    logInState,
    currentUserUID,
    entryMB,
    upVoteList,
    downVoteList
}) => {
    let commentAmount = 0;
    if (currentPost.comments[0] === "") {
        commentAmount = 0;
    } else {
        commentAmount = currentPost.comments.length;
    }
    let temp = currentPost.title;
     let tempArr = temp.split('');
    let truncated = [];
    for (let i = 0; i <= 40; ++i) {
        truncated.push(tempArr[i]);
    }
    truncated.push("...");
    truncated.toString('');

    const [postVoteAmount, setPostVoteAmount] = useState(0);
    const [downVoteStatus, setDownVoteStatus] = useState(false);
    const [upVoteStatus, setUpVoteStatus] = useState(false);
    useEffect(() => {
        const tempMB = Object.entries(masterBoard);
        tempMB.map((currentPostID) => {
            if (currentPostID[0] === currentPost.newUserKey) {
                setPostVoteAmount(currentPostID[1].voteAmount)
            }
        })
        let upVoteListArray = Object.entries(upVoteList);
        upVoteListArray.map((user) => {
            let tempUID = "";
            if (typeof currentUserUID !== "string") {
                tempUID = currentUserUID.uid;
            }
            if (user[0] === currentUserUID || user[0] === tempUID) {
                let userArray = Object.entries(user[1]);
                userArray.map((likedPost) => {
                    if (currentPost.newUserKey === likedPost[0]) {
                        if (likedPost[1].upVoteState === true) {
                            setUpVoteStatus(true);
                        }
                    }
                    
                })
            }
        });
        let downVoteListArray = Object.entries(downVoteList);
        downVoteListArray.map((user) => {
            let tempUID = "";
            if (typeof currentUserUID !== "string") {
                tempUID = currentUserUID.uid;
            }
            if (user[0] === currentUserUID || user[0] === tempUID) {
                let userArray = Object.entries(user[1]);
                userArray.map((unLikedPost) => {
                    if (currentPost.newUserKey === unLikedPost[0]) {
                        if (unLikedPost[1].downVoteState === true) {
                            setDownVoteStatus(true);
                        }
                    }
                    
                })
            }
        });
    }, [currentPost.voteAmount]);
   
   return (
       <div className="individual-post-link-page">
        {!logInState && <div className="first-column">
                            <CaretUpFill className='upArrow' onClick={() => displaySignUp({setSignUp})}/>
                                {postVoteAmount}
                            <CaretDownFill className='downArrow' onClick={() => displaySignUp({setSignUp})}/>
                        </div>
        }
        {logInState && <div className="first-column">
                            {upVoteStatus ? <CaretUpFill className='upArrowActive'/> : <CaretUpFill  onClick={() => upVotePost(postVoteAmount, currentPost, currentUserUID, entryMB)} className='upArrow'/>}                                                                                                        
                                {postVoteAmount}
                            {downVoteStatus ? <CaretDownFill className='downArrowActive'/> : <CaretDownFill onClick={() => downVotePost(postVoteAmount, currentPost, currentUserUID, entryMB)} className='downArrow'/>}                                                                                                             
                        </div>
        }
           
           <div className="second-column-page">
                   <div className='post-user'>Posted by {currentPost.user}<TimeCommentPosted currentPost={currentPost} key={uniqid()}/></div>
                   <div className='post-title-link'>{currentPost.title}</div>
                   <a  rel="noreferrer" target="_blank" className='post-link-page' href={currentPost.content}>{currentPost.content}<BoxArrowUpRight/></a>
                   <div className='post-comments'><ChatSquare /> {commentAmount} Comments</div>
                   {!logInState && <div className='login-post-container'>
                                <p>Log in or sign up to leave a comment</p>
                                <div className='button-post-container'>
                                    <button className='button-post-login' onClick={() => displayLogIn({setLogIn})}>LOG IN</button>
                                    <button className='button-post-login' onClick={() => displaySignUp({setSignUp})}>SIGN UP</button>
                                </div>
                            </div>
                    }
                    {logInState && <div className='post-comment-container'>
                                <p className='comment-label'>Comment as {localStorage.getItem("currentUser")}</p>
                                <div className='post-comment-input-container'>
                                    <textarea className='post-comment-input' placeholder='What are your thoughts?'></textarea>
                                    <div className='post-comment-button-container'>
                                        <button className='post-comment-button'>COMMENT</button>
                                    </div>
                                </div>
                           </div>
                    } 
                    <CommentSection 
                        masterBoard={masterBoard}
                        setMasterBoard={setMasterBoard}
                        currentPost={currentPost}
                        setCurrentPost={setCurrentPost}
                        logIn={logIn}
                        setLogIn={setLogIn}
                        signUp={signUp}
                        setSignUp={setSignUp} 
                        key={uniqid()}
                    />
            </div>
        </div>

   )
}
const TimeCommentPosted = ({currentPost}) => {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    let currDate =  [year, month, day].join('-');
    let postedDate = currentPost.timePosted;
    let timePosted = "";

    let currDateArray = currDate.split('');
    let postedDateArray = postedDate.split('');

    let currentDay = [];
    let postedDay = [];
    currentDay.push(currDateArray[8]);
    currentDay.push(currDateArray[9]);
    postedDay.push(postedDateArray[8]);
    postedDay.push(postedDateArray[9]);
    let tempCurrDay = currentDay.join('');
    let tempPostedDay = postedDay.join('');

    let currentMonth = [];
    let postedMonth = [];
    currentMonth.push(currDateArray[5]);
    currentMonth.push(currDateArray[6]);
    postedMonth.push(postedDateArray[5]);
    postedMonth.push(postedDateArray[6]);
    let tempCurrMonth = currentMonth.join('');
    let tempPostedMonth = postedMonth.join('');

    let currentYear = [];
    let postedYear = [];
    currentYear.push(currDateArray[0]);
    currentYear.push(currDateArray[1]);
    currentYear.push(currDateArray[2]);
    currentYear.push(currDateArray[3]);
    postedYear.push(postedDateArray[0]);
    postedYear.push(postedDateArray[1]);
    postedYear.push(postedDateArray[2]);
    postedYear.push(postedDateArray[3]);
    let tempCurrYear = currentYear.join('');
    let tempPostedYear = postedYear.join('');

    let numCurrDay = Number(tempCurrDay);
    let numPostedDay = Number(tempPostedDay);
    let numCurrMonth = Number(tempCurrMonth);
    let numPostedMonth = Number(tempPostedMonth);
    let numCurrYear = Number(tempCurrYear);
    let numPostedYear = Number(tempPostedYear);
    let getMonth = numPostedMonth - numCurrMonth;
    getMonth = Math.abs(getMonth);
    if (numCurrYear === numPostedYear) {
        if (numCurrMonth === numPostedMonth) {
            if (numCurrDay === numPostedDay) {
                timePosted = "today";
            } else if (numPostedDay === numCurrDay - 1) {
                timePosted = "1 day ago";
            } else if (numPostedDay === numCurrDay - 2) {
                timePosted = "2 days ago";
            } else if (numPostedDay === numCurrDay - 3) {
                timePosted = "3 days ago";
            } else if (numPostedDay === numCurrDay - 4) {
                timePosted = "4 days ago";
            } else if (numPostedDay === numCurrDay - 5) {
                timePosted = "5 days ago";
            } else if (numPostedDay === numCurrDay - 6) {
                timePosted = "6 days ago";
            } else  {
                timePosted = "Over a week ago";
            }
        } else {
            if (getMonth === 1) {
                timePosted = getMonth + " month ago";
            } else {
                timePosted = getMonth + " months ago";
            }
        }
    } else if (numPostedYear === numCurrYear - 1) {
        if (numCurrMonth === numPostedMonth) {
            timePosted = "1 year ago";
        } else if (numPostedMonth === numCurrMonth + 1 ) {
            timePosted = "11 months ago";
        } else if (numPostedMonth === numCurrMonth + 2 ) {
            timePosted = "10 months ago";
        } else if (numPostedMonth === numCurrMonth + 3 ) {
            timePosted = "9 months ago";
        } else if (numPostedMonth === numCurrMonth + 4 ) {
            timePosted = "8 months ago";
        } else if (numPostedMonth === numCurrMonth + 5 ) {
            timePosted = "7 months ago";
        } else if (numPostedMonth === numCurrMonth + 6 ) {
            timePosted = "6 months ago";
        } else if (numPostedMonth === numCurrMonth + 7 ) {
            timePosted = "5 months ago";
        } else if (numPostedMonth === numCurrMonth + 8 ) {
            timePosted = "4 months ago";
        } else if (numPostedMonth === numCurrMonth + 9 ) {
            timePosted = "3 months ago";
        } else if (numPostedMonth === numCurrMonth + 10 ) {
            timePosted = "2 months ago";
        } else if (numPostedMonth === numCurrMonth + 11 ) {
            timePosted = "1 month ago";
        }
    } else if (numPostedYear + 2 <= numCurrYear) {
        timePosted = "over 2 years ago"
    }
    


return (
    <> {timePosted}</>
)
}
export default Post;