export const topBoard = ({masterBoard, currentPost, setMasterBoard}, setCommentBoard) => {
    console.log(masterBoard)
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
export const newBoard = ({masterBoard, currentPost, setMasterBoard}, setCommentBoard) => {
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
export const oldBoard = ({masterBoard, currentPost, setMasterBoard}, setCommentBoard) => {
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