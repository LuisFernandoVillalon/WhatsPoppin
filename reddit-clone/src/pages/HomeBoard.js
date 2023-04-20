import { BarChartFill, PencilSquare, Newspaper, Clock, CaretUpFill, CaretDownFill, ChatSquare, BoxArrowUpRight, Link45deg } from 'react-bootstrap-icons'; 
import useScrollBlock from "../utilities/useScrollBlock";
import { useNavigate } from "react-router-dom";
import uniqid from 'uniqid';
import { useEffect } from "react";
import { getRecords } from '../firebase-data/StartUpData';
import {topBoard, newBoard, oldBoard} from '../utilities/HomeboardOptions';
import {TextPost, ImagePost, LinkPost} from "../components/HomeboardPosts"

const HomeBoard = (props) => {
    const [blockScroll, useScroll] = useScrollBlock();
    
    const navigate = useNavigate();
    const createPostRoute = () => {
            navigate("/create-post");
    }

    useEffect(() => {
        const {setMasterBoard, setEntryMB, setVoteList} = props;
        getRecords({ setMasterBoard, setEntryMB, setVoteList});
    }, []);

    return (
        <div>
            {props.logInState && <div className='create-post-container'>
                                    <PencilSquare/>
                                    <input onClick={createPostRoute} className='create-post-input' type="text" placeholder='Create Post'/>
                                </div>
            }
            <div className="board-section-container">
                <div tabIndex="1" className="board-section" onClick={() => topBoard({props})}><BarChartFill/>Top</div>
                <div tabIndex="2" className="board-section" onClick={() => newBoard({props})}><Newspaper/>New</div>
                <div tabIndex="3" className="board-section" onClick={() => oldBoard({props})}><Clock/>Old</div>
            </div>
            <div className='hide-scroll'>
             <MessageBoard 
                props={props}
                blockScroll={blockScroll}
                useScroll={useScroll}
                key={uniqid()}
             />
             </div>
        </div>
    )
}
const backTop = () => {
    window.scrollTo(0, 0);
}
const MessageBoard = (props) => {
    const { masterBoard } = props.props;
    let mB = masterBoard;
    if (!Array.isArray(mB)) {
        mB = Object.values(mB);
    }
    const boardList = mB.map((currentPost) => (
        <IndividualPost 
            currentPost={currentPost}
            props={props}
            key={uniqid()}
        />
))
    return (
        <>
            {boardList}
            <div className='backtop-button-container'><button className='backtop-button' onClick={() => backTop()}>BACK TO TOP</button></div>
        </>
    )
}
const IndividualPost = (props) => {
    const type = props.currentPost.type;
    if (type === "text") {
       return ( <TextPost props={props} key={uniqid()}/> )
    } else if (type === "image") {
        return ( <ImagePost props={props} key={uniqid()} /> )
    } else if (type === "link") {
        return ( <LinkPost props={props} key={uniqid()} /> )
    }
}



export default HomeBoard;