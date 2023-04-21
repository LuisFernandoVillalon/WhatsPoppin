import { CaretUpFill, CaretDownFill, ChatSquareFill } from "react-bootstrap-icons"; 
import { useState, useRef, useEffect } from "react";
import uniqid from 'uniqid';
import { addReplyToFirebase, upVoteCommentFirebase, downVoteCommentFirebase, deleteCommentFromFirebase } from "../firebase-data/CommentData";
import TimePosted from '../utilities/TimePosted';
import { topBoard, newBoard, oldBoard } from "../utilities/CommentboardOptions";

const CommentSection = ({
    currentPost, 
    masterBoard, 
    setCurrentPost, 
    setMasterBoard, 
    setSignUp, 
    logInState, 
    setVoteList, 
    currentUserUID, 
    entryMB,
    voteList
}) => {

    if (masterBoard.sampleBoard) {
        masterBoard = masterBoard.sampleBoard;
    } 
    let tempMB = Object.entries(masterBoard);
    const updatedCurrentPost = tempMB.filter((currPost) => {
        if (currPost[1].id === currentPost.id) {
            return currPost;
        } 
    });
    let currentCommentBoard = "";
    if (updatedCurrentPost.length === 0) {
        currentCommentBoard = [""];
    } else {
        currentCommentBoard = updatedCurrentPost[0][1].comments;
        currentCommentBoard = Object.entries(currentCommentBoard);
    }
    const [commentBoard, setCommentBoard] = useState(currentCommentBoard);
   
    let commentStatus = "";
    let commentList = "";
    let commentBoardDisplayArray = [];
    if (commentBoard[0] === undefined || commentBoard[0] === '') {
        commentStatus = false;
    } else {
        commentStatus = true;
        for (let i = 0; i < currentCommentBoard.length; ++i) {
            commentBoardDisplayArray.push(currentCommentBoard[i][1]);
        }
       
        commentList = commentBoardDisplayArray.map((response) => (
            <DisplayComments 
                response={response}
                setSignUp={setSignUp} 
                logInState={logInState}
                currentPost={currentPost}
                masterBoard={masterBoard}
                setMasterBoard={setMasterBoard}
                setVoteList={setVoteList}
                currentUserUID={currentUserUID}
                entryMB={entryMB}
                voteList={voteList}
                setCurrentPost={setCurrentPost}
                key={uniqid()}
            />
        ))
    }

console.log(masterBoard)

    return (
        <div className="comment-section-container">
            <div className="sortby-comments-container">
                <p>SORT BY</p>
                <select onChange={(e) => selectCommentBoard(e, {currentPost, masterBoard, setMasterBoard}, setCommentBoard)} className="sortby-comments" id="sortby-comments" >
                    <option selected disabled>Choose Order</option>
                    <option value="top">TOP</option>
                    <option value="new">NEW</option>
                    <option value="old">OLD</option>
                </select>
            </div>
            {commentStatus && <div className="comment-list-container"> {commentList} </div>}
        </div>
    )
}
const signUp = ({setSignUp}) => {
    setSignUp(true);
}
const upVoteComment = (commentVoteAmount, response, currentPost, currentUserUID, entryMB, masterBoard, setMasterBoard, voteList, setVoteList) => {
    
    const props = {response, currentPost, currentUserUID, entryMB, voteList, setVoteList, masterBoard, setMasterBoard};
    upVoteCommentFirebase(commentVoteAmount + 1, props);
}
const downVoteComment = (commentVoteAmount, response, currentPost, currentUserUID, entryMB, masterBoard, setMasterBoard, voteList, setVoteList) => {
    
    const props = {response, currentPost, currentUserUID, entryMB, voteList, setVoteList, masterBoard, setMasterBoard};
    downVoteCommentFirebase(commentVoteAmount - 1, props);
}
const DisplayComments = ({
    response, 
    setSignUp, 
    logInState, 
    currentPost, 
    masterBoard, 
    setMasterBoard, 
    setVoteList, 
    currentUserUID,
    entryMB, 
    voteList,
    setCurrentPost
}) => {

    let currentResponse = "";
    if (response !== undefined) {
        currentResponse = Object.entries(response.comments);
    }
     let responseStatus = "";
     let responseList = "";

     const [commentVoteAmount, setCommentVoteAmount] = useState(response.voteAmount);
     const [downVoteStatus, setDownVoteStatus] = useState(false);
     const [upVoteStatus, setUpVoteStatus] = useState(false);
     const [dltBtnStatus, setDltBtnStatus] = useState(false);

     const askUser = () => {
        if (window.confirm("Are you sure you wish to delete this comment? Action is irreversible.")) {
            deleteCommentFromFirebase(response, currentPost, setMasterBoard);

          } else {
            console.log("cancel")
          }
    }
    
     if (currentResponse === "") {
         responseStatus = false;
     } else {
        if (currentResponse[0] === "") {
            responseStatus = false;
        } else {
         responseStatus = true;
        }       
     }
     const currRespArr = [];
     for (let i = 0; i < currentResponse.length; ++i) {
        
        currRespArr.push(currentResponse[i][1]);
     }

     useEffect(() => {
        if (currentUserUID.uid) {
            currentUserUID = currentUserUID.uid;
        }
           
            if (response.userID) {
                if (response.userID === currentUserUID) {
                    setDltBtnStatus(true);
                }
             else {
                setDltBtnStatus(false);
            }
        }
        setCommentVoteAmount(response.voteAmount);
        for (let i = 0; i < voteList.length; ++i) {

                if (voteList[i].currentUser === currentUserUID || voteList[i].currentUser === currentUserUID.uid) {
                    
                    if (!voteList[i].comments) {
                        
                        continue;
                    } else {
                    voteList[i].comments.map((comment) => {
                        if (comment === undefined || comment === null) {
                            return;
                        } else {
                            if (comment.currentResponseID === response.id) {
                                
                                setUpVoteStatus(comment.upVoteState);
                                setDownVoteStatus(comment.downVoteState);
                            }
                        }
                    })
                }
            }
            
        }
        
        
     }, [upVoteStatus, downVoteStatus, response.voteAmount])
     
     responseList = currRespArr.map((response) => (
        <DisplayComments 
            response={response}
            setSignUp={setSignUp} 
            logInState={logInState}
            currentPost={currentPost}
            masterBoard={masterBoard}
            setMasterBoard={setMasterBoard}
            setVoteList={setVoteList}
            currentUserUID={currentUserUID}
            entryMB={entryMB}
            voteList={voteList}
            key={uniqid()}
        />
     )) 
    const [replyFormStatus, setReplyFormStatus] = useState(false);
    const replyRef = useRef(undefined);

    const displayReplyForm = () => {
        setReplyFormStatus(true);
    }
    const closeReplyForm = () => {
        setReplyFormStatus(false);
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        const text = replyRef.current.value;
        const user = localStorage.getItem("currentUser");
        let timePost = new Date();
        timePost = timePost.toISOString().split('T')[0];
        let voteAmount = 1; 
        const id = uniqid();

        addReplyToFirebase(user, id, timePost, voteAmount, text, response, currentPost, setMasterBoard, setVoteList, currentUserUID);

        event.target.reset();
    }
    if (Array.isArray(response)) {
        response = response[1];
    }
    return (
        <div className="individual-comment" >
            {!logInState && <div className="first-column-comment">
                                <CaretUpFill className='nestedUpArrow' onClick={() => signUp({setSignUp})}/>
                                    {commentVoteAmount}
                                <CaretDownFill className='nestedDownArrow' onClick={() => signUp({setSignUp})}/>
                                <div className="comment-line"></div>
                            </div>
            }
            {logInState && <div className="first-column-comment">
                                {upVoteStatus ? <CaretUpFill className='upArrowActive'/> : <CaretUpFill  onClick={() => upVoteComment(commentVoteAmount, response, currentPost, currentUserUID, entryMB, masterBoard, setMasterBoard, voteList, setVoteList)} className='upArrow'/>}
                                    {commentVoteAmount}
                                {downVoteStatus ? <CaretDownFill className='downArrowActive'/> : <CaretDownFill onClick={() => downVoteComment(commentVoteAmount, response, currentPost, currentUserUID, entryMB, masterBoard, setMasterBoard, voteList, setVoteList)} className='downArrow'/>}
                                <div className="comment-line"></div>
                            </div>
            }
            <div className="second-column-comment">
                    <div className='post-user'>Posted by {response.user}<TimePosted response={response}/></div>
                    <div className='post-title'>{response.title}</div>
                    <div className="comment-text">{response.text}</div>
                    {!logInState && <div className='add-comment' onClick={() => signUp({setSignUp})}><ChatSquareFill /> Reply</div> }
                    <div className="comment-dlt-btn-container">
                        {logInState && <div className='add-comment' onClick={() => displayReplyForm()}><ChatSquareFill /> Reply</div> }
                        {(logInState && dltBtnStatus) && <div onClick={() => askUser()} className='comment-user-dlt-btn'>Delete post</div>}
                    </div>
                {replyFormStatus && <div className='post-reply-container'>
                                        <form onSubmit={handleSubmit}>
                                            <div className='post-comment-input-container'>
                                                <textarea ref={replyRef} className='post-comment-input' placeholder='What are your thoughts?'></textarea>
                                                <div className='post-reply-button-container'>
                                                    <button onClick={() => closeReplyForm()} className='cancel-post-reply-button'>CANCEL</button>
                                                    <button className='post-reply-button'>COMMENT</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                }
                {responseStatus && <div className="individual-response">{responseList}</div> }
            </div>
        </div>
    )
}
const selectCommentBoard = (e, {currentPost, masterBoard, setMasterBoard}, setCommentBoard) => {
    const boardSelection = e.target.value;
    if (boardSelection === "top") {
        topBoard({masterBoard, currentPost, setMasterBoard}, setCommentBoard);
    } else if (boardSelection === "new") {
        newBoard({currentPost, masterBoard, setMasterBoard}, setCommentBoard);
    } else if (boardSelection === "old") {
        oldBoard({currentPost, masterBoard, setMasterBoard}, setCommentBoard);
    }
}



export default CommentSection;