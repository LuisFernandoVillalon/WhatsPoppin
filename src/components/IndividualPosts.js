import { CaretUpFill, CaretDownFill, ChatSquare, BoxArrowUpRight } from 'react-bootstrap-icons'; 
import  CommentSection  from "./CommentSection";
import { useState, useEffect, useRef } from "react";
import TimePosted from '../utilities/TimePosted';
import { addCommentToFirebase } from '../firebase-data/CommentData';
import { deletePostFromFirebase, upVotePostFirebase, downVotePostFirebase } from '../firebase-data/PostData';
import uniqid from 'uniqid';

const displaySignUp = ({setSignUp}) => {
    setSignUp(true);
}
const displayLogIn = ({setLogIn}) => {
    setLogIn(true);
}
const upVotePost = (postVoteAmount, currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard) => {
    console.log(setVoteList)
    upVotePostFirebase(postVoteAmount + 1, {currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard});
}
const downVotePost = (postVoteAmount, currentPost, currentUserUID,  setVoteList, masterBoard, setMasterBoard) => {
    
    
    downVotePostFirebase(postVoteAmount - 1, {currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard});
}
export const TextPostPage = ({
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
    voteList,
    setVoteList
}) => {
   
    let commentAmount = 0;
    if (currentPost.comments === undefined) {
        commentAmount = 0;
    } else {
        commentAmount = currentPost.comments.length;
    }
    const [postVoteAmount, setPostVoteAmount] = useState(currentPost.voteAmount);
    const [downVoteStatus, setDownVoteStatus] = useState(false);
    const [upVoteStatus, setUpVoteStatus] = useState(false);
    const [commentArray, setCommentArray] = useState([]);
    const [dltBtnStatus, setDltBtnStatus] = useState(false);

    const commentRef = useRef(undefined);


     useEffect(() => {
        let temp = Object.entries(masterBoard);
        if (currentUserUID.uid) {
            currentUserUID = currentUserUID.uid;
        }
        if (currentPost.userID) {
            if (currentPost.userID === currentUserUID) {
                setDltBtnStatus(true);
            }
            else {
                setDltBtnStatus(false);
            }
        }
        temp.map((post) => {
            if (post[1].id === currentPost.id) {
                setPostVoteAmount(post[1].voteAmount);
            }
        })
        temp = Object.fromEntries(temp);
        let voteListArray = Object.entries(voteList);
        voteListArray.map((user) => {
            if (user[1].currentUser === currentUserUID.uid || user[1].currentUser === currentUserUID) {
                if (user[1].post === undefined || user[1].post === null) {
                    return;
                } else {
                    let userArray = Object.entries(user[1].post);
                    userArray.map((post) => {
                        if (currentPost.id === post[1].currentPostID) {
                            setUpVoteStatus(post[1].upVoteState);
                            setDownVoteStatus(post[1].downVoteState);
                        }
                    })
                }  
            }
        })
     }, [upVoteStatus, downVoteStatus, currentPost.voteAmount]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const text = commentRef.current.value;
        if (text === "") {
            return;
        }
        const user = localStorage.getItem("currentUser");
        const id = uniqid();
        let timePost = new Date();
        timePost = timePost.toISOString().split('T')[0];
        let voteAmount = 1; 
        let comments= [];

       addCommentToFirebase(user, id, timePost, voteAmount, text, comments, currentPost, setMasterBoard, setVoteList, currentUserUID);

        event.target.reset();
    }

    const askUser = () => {
        if (window.confirm("Are you sure you wish to delete this post? Action is irreversible.")) {
            deletePostFromFirebase(currentPost, setMasterBoard, setCurrentPost);

          } else {
            console.log("cancel")
          }
    }
    return (
     <div className="individual-post-page" >
        {!logInState && <div className="first-column">
                            <CaretUpFill className='upArrow' onClick={() => displaySignUp({setSignUp})}/>
                                {postVoteAmount}
                            <CaretDownFill className='downArrow' onClick={() => displaySignUp({setSignUp})}/>
                        </div>
        }
        {logInState && <div className="first-column">
                            {upVoteStatus ? <CaretUpFill className='upArrowActive'/> : <CaretUpFill  onClick={() => upVotePost(postVoteAmount, currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard)} className='upArrow'/>}                                                                                                        
                                {postVoteAmount}
                            {downVoteStatus ? <CaretDownFill className='downArrowActive'/> : <CaretDownFill onClick={() => downVotePost(postVoteAmount, currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard)} className='downArrow'/>}
                        </div>
        }
        <div className="second-column-page">
            <div className='post-user-info-container'>
                <div className='post-user'>Posted by {currentPost.user}<TimePosted 
                                                                            currentPost={currentPost}
                                                                            key={uniqid()}
                                                                        />
                </div>
                {(logInState && dltBtnStatus) && <div onClick={() => askUser()} className='post-user-dlt-btn'>Delete post</div>}
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
                            <form onSubmit={handleSubmit}>
                                <p className='comment-label'>Comment as {localStorage.getItem("currentUser")}</p>
                                <div className='post-comment-input-container'>
                                    <textarea ref={commentRef} className='post-comment-input' placeholder='What are your thoughts?'></textarea>
                                    <div className='post-comment-button-container'>
                                        <button className='post-comment-button'>COMMENT</button>
                                    </div>
                                </div>
                            </form>
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
                logInState={logInState}
                commentArray={commentArray}
                setCommentArray={setCommentArray}
                setVoteList={setVoteList}
                currentUserUID={currentUserUID}
                entryMB={entryMB}
                voteList={voteList}
                key={uniqid()}
             />
        </div>
        
     </div>
    )
}
export const ImagePostPage = ({
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
    voteList,
    setVoteList
}) => {
    let commentAmount = 0;
    if (currentPost.comments[0] === "") {
        commentAmount = 0;
    } else {
        commentAmount = currentPost.comments.length;
    }

    const [postVoteAmount, setPostVoteAmount] = useState(currentPost.voteAmount);
    const [downVoteStatus, setDownVoteStatus] = useState(false);
    const [upVoteStatus, setUpVoteStatus] = useState(false);
    const [commentArray, setCommentArray] = useState([]);
    const [dltBtnStatus, setDltBtnStatus] = useState(false);

    const commentRef = useRef(undefined);

     useEffect(() => {
        let temp = Object.entries(masterBoard);
        if (currentUserUID.uid) {
            currentUserUID = currentUserUID.uid;
        }
           
            if (currentPost.userID) {
                if (currentPost.userID === currentUserUID) {
                    setDltBtnStatus(true);
                }
             else {
                setDltBtnStatus(false);
            }
        }
        temp.map((post) => {
            if (post[1].id === currentPost.id) {
                setPostVoteAmount(post[1].voteAmount);
            }
        })
        temp = Object.fromEntries(temp);
        let voteListArray = Object.entries(voteList);
        voteListArray.map((user) => {
            if (user[1].currentUser === currentUserUID.uid || user[1].currentUser === currentUserUID) {
                if (user[1].post === undefined || user[1].post === null) {
                    return;
                } else {
                    let userArray = Object.entries(user[1].post);
                    userArray.map((post) => {
                        if (currentPost.id === post[1].currentPostID) {
                            setUpVoteStatus(post[1].upVoteState);
                            setDownVoteStatus(post[1].downVoteState);
                        }
                    })
                } 
            }
        })
     }, [upVoteStatus, downVoteStatus, currentPost.voteAmount]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const text = commentRef.current.value;
        if (text === "") {
            return;
        }
        const user = localStorage.getItem("currentUser");
        const id = uniqid();
        let timePost = new Date();
        timePost = timePost.toISOString().split('T')[0];
        let voteAmount = 1; 
        let comments= [];

       addCommentToFirebase(user, id, timePost, voteAmount, text, comments, currentPost, setMasterBoard, setVoteList, currentUserUID);

        event.target.reset();
    }
    const askUser = () => {
        if (window.confirm("Are you sure you wish to delete this post? Action is irreversible.")) {
            deletePostFromFirebase(currentPost, setMasterBoard, setCurrentPost);

          } else {
            console.log("cancel")
          }
    }
    return (
        <div className="individual-post-page">
        {!logInState && <div className="first-column">
                            <CaretUpFill className='upArrow' onClick={() => displaySignUp({setSignUp})}/>
                                {postVoteAmount}
                            <CaretDownFill className='downArrow' onClick={() => displaySignUp({setSignUp})}/>
                        </div>
        }
        {logInState && <div className="first-column">
                            {upVoteStatus ? <CaretUpFill className='upArrowActive'/> : <CaretUpFill  onClick={() => upVotePost(postVoteAmount, currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard)} className='upArrow'/>}                                                                                                        
                                {postVoteAmount}
                            {downVoteStatus ? <CaretDownFill className='downArrowActive'/> : <CaretDownFill onClick={() => downVotePost(postVoteAmount, currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard)} className='downArrow'/>}                                                                                                             
                        </div>
        }
            <div className="second-column-page">
                <div className='post-user-info-container'>
                    <div className='post-user'>Posted by {currentPost.user}<TimePosted 
                                                                                currentPost={currentPost}
                                                                                key={uniqid()}
                                                                            />
                    </div>
                    {(logInState && dltBtnStatus) && <div onClick={() => askUser()} className='post-user-dlt-btn'>Delete post</div>}
                </div>
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
                                <form onSubmit={handleSubmit}>
                                    <p className='comment-label'>Comment as {localStorage.getItem("currentUser")}</p>
                                    <div className='post-comment-input-container'>
                                        <textarea  ref={commentRef} className='post-comment-input' placeholder='What are your thoughts?'></textarea>
                                        <div className='post-comment-button-container'>
                                            <button className='post-comment-button'>COMMENT</button>
                                        </div>
                                    </div>
                                    </form>
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
                    logInState={logInState}
                    commentArray={commentArray}
                    setCommentArray={setCommentArray}
                    setVoteList={setVoteList}
                    currentUserUID={currentUserUID}
                    entryMB={entryMB}
                    voteList={voteList}
                    key={uniqid()}
                 />
            </div>
     </div>
    )
}
export const LinkPostPage = ({
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
    voteList,
    setVoteList
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

    const [postVoteAmount, setPostVoteAmount] = useState(currentPost.voteAmount);
    const [downVoteStatus, setDownVoteStatus] = useState(false);
    const [upVoteStatus, setUpVoteStatus] = useState(false);
    const [commentArray, setCommentArray] = useState([]);
    const [dltBtnStatus, setDltBtnStatus] = useState(false);

    const commentRef = useRef(undefined);

     useEffect(() => {
        let temp = Object.entries(masterBoard);
        if (currentUserUID.uid) {
            currentUserUID = currentUserUID.uid;
        }
           
            if (currentPost.userID) {
                if (currentPost.userID === currentUserUID) {
                    setDltBtnStatus(true);
                }
             else {
                setDltBtnStatus(false);
            }
        }
        temp.map((post) => {
            if (post[1].id === currentPost.id) {
                setPostVoteAmount(post[1].voteAmount);
            }
        })
        temp = Object.fromEntries(temp);
        // setPostVoteAmount(currentPost.voteAmount);
        let voteListArray = Object.entries(voteList);
        voteListArray.map((user) => {
            if (user[1].currentUser === currentUserUID.uid || user[1].currentUser === currentUserUID) {
                if (user[1].post === undefined || user[1].post === null) {
                    return;
                } else {
                    let userArray = Object.entries(user[1].post);
                    userArray.map((post) => {
                        if (currentPost.id === post[1].currentPostID) {
                            setUpVoteStatus(post[1].upVoteState);
                            setDownVoteStatus(post[1].downVoteState);
                        }
                    })
                }  
            }
        })
     }, [upVoteStatus, downVoteStatus, currentPost.voteAmount]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const text = commentRef.current.value;
        if (text === "") {
            return;
        }
        const user = localStorage.getItem("currentUser");
        const id = uniqid();
        let timePost = new Date();
        timePost = timePost.toISOString().split('T')[0];
        let voteAmount = 1; 
        let comments= [];

       addCommentToFirebase(user, id, timePost, voteAmount, text, comments, currentPost, setMasterBoard, setVoteList, currentUserUID);

        event.target.reset();
    }
    const askUser = () => {
        if (window.confirm("Are you sure you wish to delete this post? Action is irreversible.")) {
            deletePostFromFirebase(currentPost, setMasterBoard, setCurrentPost);

          } else {
            console.log("cancel")
          }
    }
    let tempLink = currentPost.content;
    let tempArrLink = tempLink.split('');
    let truncatedLink = [];
    for (let i = 0; i <= 40; ++i) {
        truncatedLink.push(tempArrLink[i]);
    }
    truncatedLink.push("...");
    truncatedLink.toString('');

   return (
       <div className="individual-post-link-page">
        {!logInState && <div className="first-column">
                            <CaretUpFill className='upArrow' onClick={() => displaySignUp({setSignUp})}/>
                                {postVoteAmount}
                            <CaretDownFill className='downArrow' onClick={() => displaySignUp({setSignUp})}/>
                        </div>
        }
        {logInState && <div className="first-column">
                            {upVoteStatus ? <CaretUpFill className='upArrowActive'/> : <CaretUpFill  onClick={() => upVotePost(postVoteAmount, currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard)} className='upArrow'/>}                                                                                                        
                                {postVoteAmount}
                            {downVoteStatus ? <CaretDownFill className='downArrowActive'/> : <CaretDownFill onClick={() => downVotePost(postVoteAmount, currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard)} className='downArrow'/>}                                                                                                             
                        </div>
        }
           
           <div className="second-column-page">
                    <div className='post-user-info-container'>
                        <div className='post-user'>Posted by {currentPost.user}<TimePosted 
                                                                                    currentPost={currentPost}
                                                                                    key={uniqid()}
                                                                                />
                        </div>
                        {(logInState && dltBtnStatus) && <div onClick={() => askUser()} className='post-user-dlt-btn'>Delete post</div>}
                    </div>
                   <div className='post-title-link'>{currentPost.title}</div>
                   <a  rel="noreferrer" target="_blank" className='post-link-page' href={currentPost.content}>{truncatedLink}<BoxArrowUpRight/></a>
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
                                        <form onSubmit={handleSubmit}>
                                            <p className='comment-label'>Comment as {localStorage.getItem("currentUser")}</p>
                                            <div className='post-comment-input-container'>
                                                <textarea ref={commentRef} className='post-comment-input' placeholder='What are your thoughts?'></textarea>
                                                <div className='post-comment-button-container'>
                                                    <button className='post-comment-button'>COMMENT</button>
                                                </div>
                                            </div>
                                        </form>
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
                        logInState={logInState}
                        commentArray={commentArray}
                        setCommentArray={setCommentArray}
                        setVoteList={setVoteList}
                        currentUserUID={currentUserUID}
                        entryMB={entryMB}
                        voteList={voteList}
                        key={uniqid()}
                    />
            </div>
        </div>

   )
}