import { BarChartFill, Newspaper, Clock, ArrowUp, ArrowDown, ChatSquare } from 'react-bootstrap-icons'; 
import { getRecords } from '../MessageBoardSample/firebaseData';
import { useState, useEffect } from "react";


const HomeBoard = () => {
    const [masterBoard, setMasterBoard] = useState([]);
    useEffect(() => {
        getRecords({setMasterBoard});
    }, [])
    return (
        <>
            <div className="board-section-container">
                <div className="board-section"><BarChartFill/>Top</div>
                <div className="board-section"><Newspaper/>New</div>
                <div className="board-section"><Clock/>Old</div>
            </div>
             <MessageBoard 
                masterBoard={masterBoard}
             />
        </>
    )
}

const MessageBoard = (props) => {
    const list = props.masterBoard;
    const boardList = list.map((currentPost) => (
        <IndividualPost 
            currentPost={currentPost}
        />
))
    return (
        <div>
            {boardList}
        </div>
    )
}

const IndividualPost = (props) => {
    console.log(props.currentPost);
    return (
        <div className="individual-post">
           <div className="first-column">
                <ArrowUp className='upArrow'/>
                {props.currentPost.voteAmount}
                <ArrowDown className='downArrow'/>
           </div>
           <div className="second-column">
                <div className='post-user'>Posted by {props.currentPost.user}</div>
                <div className='post-title'>{props.currentPost.title}</div>
                <div className='post-comments'><ChatSquare /> {props.currentPost.comments} Comments</div>
           </div>
        </div>
    )
}


export default HomeBoard;