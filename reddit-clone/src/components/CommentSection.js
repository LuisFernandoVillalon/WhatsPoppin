import { CaretUpFill, CaretDownFill, ChatSquareFill } from "react-bootstrap-icons"; 
import { useState, useRef } from "react";
import uniqid from 'uniqid';
import { addReplyToFirebase } from "../MessageBoardSample/firebaseData";

const CommentSection = ({
    currentPost, masterBoard, setCurrentPost, setLogIn, setMasterBoard, setSignUp, logInState, setVoteList
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
                key={uniqid()}
            />
        ))
    }
    return (
        <div className="comment-section-container">
            <div className="sortby-comments-container">
                <p>SORT BY</p>
                <select onChange={(e) => selectCommentBoard(e, {currentPost, masterBoard, setCurrentPost, setLogIn, setMasterBoard, setSignUp}, setCommentBoard)} className="sortby-comments" id="sortby-comments" >
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
const DisplayComments = ({response, setSignUp, logInState, currentPost, masterBoard, setMasterBoard, setVoteList}) => {
    let currentResponse = "";
    if (response !== undefined) {
        currentResponse = Object.entries(response.comments);
    }
     let responseStatus = "";
     let responseList = "";
    
     if (currentResponse === "") {
         responseStatus = false;
     } else {
        if (currentResponse[0] == "") {
            responseStatus = false;
        } else {
         responseStatus = true;
        }       
     }
     const currRespArr = [];
     for (let i = 0; i < currentResponse.length; ++i) {
        
        currRespArr.push(currentResponse[i][1]);
     }
     
     responseList = currRespArr.map((response) => (
        <DisplayComments 
             response={response}
             setSignUp={setSignUp} 
             logInState={logInState}
             currentPost={currentPost}
             masterBoard={masterBoard}
             setMasterBoard={setMasterBoard}
             setVoteList={setVoteList}
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
        // let comments= [];
        const id = uniqid();

        addReplyToFirebase(user, id, timePost, voteAmount, text, response, currentPost, setMasterBoard, setVoteList);

        event.target.reset();
    }
    if (Array.isArray(response)) {
        response = response[1];
    }
    return (
        <div className="individual-comment" >
            <div className="first-column-comment">
                <CaretUpFill className='nestedUpArrow' onClick={() => signUp({setSignUp})}/>
                {response.voteAmount}
                <CaretDownFill className='nestedDownArrow' onClick={() => signUp({setSignUp})}/>
                <div className="comment-line"></div>
            </div>
            <div className="second-column-page">
                <div className='post-user'>Posted by {response.user}<TimeCommentPosted response={response}/></div>
                <div className='post-title'>{response.title}</div>
                <div className="comment-text">{response.text}</div>
                {!logInState && <div className='add-comment' onClick={() => signUp({setSignUp})}><ChatSquareFill /> Reply</div> }
                {logInState && <div className='add-comment' onClick={() => displayReplyForm()}><ChatSquareFill /> Reply</div> }
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
                                    </div>}
                {responseStatus && <div className="individual-response">{responseList}</div> }
            </div>
        </div>
    )
}

const TimeCommentPosted = ({response}) => {
    
    if (response.timePost === undefined || response.timePost === "") {
        return;
    }
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    let currDate =  [year, month, day].join('-');
    let postedDate = response.timePost;
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
            if (numCurrDay === numPostedDay || numCurrDay < numPostedDay) {
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
        } else if (numPostedMonth === numCurrMonth - 1  || numPostedMonth === numCurrMonth + 1) {
            timePosted = "11 months ago";
        } else if (numPostedMonth === numCurrMonth - 2  || numPostedMonth === numCurrMonth + 2) {
            timePosted = "10 months ago";
        } else if (numPostedMonth === numCurrMonth - 3  || numPostedMonth === numCurrMonth + 3) {
            timePosted = "9 months ago";
        } else if (numPostedMonth === numCurrMonth - 4  || numPostedMonth === numCurrMonth + 4) {
            timePosted = "8 months ago";
        } else if (numPostedMonth === numCurrMonth - 5  || numPostedMonth === numCurrMonth + 5) {
            timePosted = "7 months ago";
        } else if (numPostedMonth === numCurrMonth - 6  || numPostedMonth === numCurrMonth + 6) {
            timePosted = "6 months ago";
        } else if (numPostedMonth === numCurrMonth - 7  || numPostedMonth === numCurrMonth + 7) {
            timePosted = "5 months ago";
        } else if (numPostedMonth === numCurrMonth - 8  || numPostedMonth === numCurrMonth + 8) {
            timePosted = "4 months ago";
        } else if (numPostedMonth === numCurrMonth - 9  || numPostedMonth === numCurrMonth + 9) {
            timePosted = "3 months ago";
        } else if (numPostedMonth === numCurrMonth - 10 || numPostedMonth === numCurrMonth + 10) {
            timePosted = "2 months ago";
        } else if (numPostedMonth === numCurrMonth - 11 || numPostedMonth === numCurrMonth + 11) {
            timePosted = "1 month ago";
        }
    } else if (numPostedYear + 2 <= numCurrYear) {
        timePosted = "over 2 years ago"
    }
    


return (
    <> {timePosted}</>
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

const topBoard = ({masterBoard, currentPost, setMasterBoard}, setCommentBoard) => {
    masterBoard = Object.entries(masterBoard);
    const currPost = masterBoard.filter((post) => {
        return (post[1].id === currentPost.id) 
    })
    currPost[0][1].comments.sort((a, b) => {
        return b.voteAmount - a.voteAmount;
    });
    masterBoard = Object.fromEntries(masterBoard);
    setCommentBoard(currPost[0][1].comments);
    setMasterBoard(masterBoard);

}
const newBoard = ({masterBoard, currentPost, setMasterBoard}, setCommentBoard) => {
    masterBoard = Object.entries(masterBoard);
    const currPost = masterBoard.filter((post) => {
        return (post[1].id === currentPost.id) 
    })
    for (let i = 0; i < currPost[0][1].comments.length; ++i) {
        currPost[0][1].comments[i].timePost = currPost[0][1].comments[i].timePost.split('-').join('');
    }
    currPost[0][1].comments.sort((a, b) => {
        return b.timePost - a.timePost;
    });
    let normal = [];
    let indvNormal = [];
    for (let i = 0; i < currPost[0][1].comments.length; ++i) {
        let tempDateArray = currPost[0][1].comments[i].timePost.split('');
        for (let j = 0; j <= tempDateArray.length; ++j) {
            if ( j === 4 || j === 6 )  {
                normal.push("-");
            } else if ( j === 8 ) {
                indvNormal.push([...normal]);
                normal = [];
               break;
            }
            normal.push(tempDateArray[j]);
        }
    }    
    for (let i = 0; i < indvNormal.length; ++i) {
        currPost[0][1].comments[i].timePost = indvNormal[i].join('');
    }
    masterBoard = Object.fromEntries(masterBoard);
    setCommentBoard(currPost[0][1].comments);
    setMasterBoard(masterBoard);
}
const oldBoard = ({masterBoard, currentPost, setMasterBoard}, setCommentBoard) => {
    masterBoard = Object.entries(masterBoard);
    const currPost = masterBoard.filter((post) => {
        return (post[1].id === currentPost.id) 
    })
    for (let i = 0; i < currPost[0][1].comments.length; ++i) {
        currPost[0][1].comments[i].timePost = currPost[0][1].comments[i].timePost.split('-').join('');
    }
    currPost[0][1].comments.sort((a, b) => {
        return a.timePost - b.timePost;
    });
    let normal = [];
    let indvNormal = [];
    for (let i = 0; i < currPost[0][1].comments.length; ++i) {
        let tempDateArray = currPost[0][1].comments[i].timePost.split('');
        for (let j = 0; j <= tempDateArray.length; ++j) {
            if ( j === 4 || j === 6 )  {
                normal.push("-");
            } else if ( j === 8 ) {
                indvNormal.push([...normal]);
                normal = [];
               break;
            }
            normal.push(tempDateArray[j]);
        }
    }    
    for (let i = 0; i < indvNormal.length; ++i) {
        currPost[0][1].comments[i].timePost = indvNormal[i].join('');
    }
    masterBoard = Object.fromEntries(masterBoard);
    setCommentBoard(currPost[0][1].comments);
    setMasterBoard(masterBoard);
}


export default CommentSection;