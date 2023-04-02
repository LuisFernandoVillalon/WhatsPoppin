import { FileText, Link45deg, Image } from 'react-bootstrap-icons'; 
import { useNavigate } from "react-router-dom";
import { React, useState, useRef } from "react";
import { addPostToDataBase } from '../MessageBoardSample/firebaseData';

const CreatePost = (props) => {

    const [textInput, setTextInput] = useState(true);
    const [imageInput, setImageInput] = useState(false);
    const [linkInput, setLinkInput] = useState(false);

    const titleRef = useRef(undefined);
    const textRef = useRef(undefined);

    const navigate = useNavigate();

    const homeRoute = () => {
            navigate("/");
    }

    const switchToTextInput = () => {
        setTextInput(true);
        setImageInput(false);
        setLinkInput(false);

    }
    const switchToImageInput = () => {
        setTextInput(false);
        setImageInput(true);
        setLinkInput(false);
    }
    const switchToLinkInput = () => {
        setTextInput(false);
        setImageInput(false);
        setLinkInput(true);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const user = localStorage.getItem("currentUser");
        let type = "";
        if (textInput) {
            type = "text";
        } else if (imageInput) {
            type = "image";
        } else if (linkInput) {
            type = "link";
        }
        let timePosted = new Date();
        const dd = String(timePosted.getDate()).padStart(2, '0');
        const mm = String(timePosted.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = timePosted.getFullYear();
        timePosted = yyyy + '-' + mm + '-' + dd;
        const voteAmount = 1;
        const title = titleRef.current.value;
        const content = textRef.current.value;
        const comments = [""];
        
        addPostToDataBase(user, type, timePosted, voteAmount, title, content, comments, props);
        navigate("/");
    }

    return (
        <div>
                <h1 className="create-post-title">Create a post</h1>
                <div className="types-of-post-container">
                    <div className='types-of-post-buttons-container'>
                        <div onClick={() => switchToTextInput()} tabIndex="1" className='type-of-post-button'><FileText/>Post</div>
                        <div onClick={() => switchToImageInput()} tabIndex="2" className='type-of-post-button'><Image/>Image</div>
                        <div onClick={() => switchToLinkInput()} tabIndex="3" className='type-of-post-button'><Link45deg/>Link</div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input required type="text" ref={titleRef} placeholder='Title' className='input-title-post'/>
                        {textInput && <textarea ref={textRef} placeholder='Text (optional)'  className='input-text-post'></textarea>}
                        {imageInput && <textarea required ref={textRef} placeholder='Image Url'  className='input-text-post'></textarea>}
                        {linkInput && <textarea required ref={textRef} placeholder='Link Url'  className='input-text-post'></textarea>}
                        <div className='create-post-buttons-container'>
                            <button className='create-post-button'  onClick={homeRoute}>CANCEL</button>
                            <button className='create-post-button' type="submit">POST</button>
                        </div>
                    </form>
                </div>
        </div>
    )
}

export default CreatePost;