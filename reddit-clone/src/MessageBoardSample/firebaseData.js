import { initializeApp } from 'firebase/app';
import  sampleBoard  from "./MessageBoardSample.json";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile  } from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp, getDoc, updateDoc } from "firebase/firestore";
import uniqid from 'uniqid';

const firebaseConfig = {
    apiKey: "AIzaSyCkY2NbgewS8OFKnSRv5tKfMgWwTpzoKTM",
    authDomain: "reddit-clone-8a064.firebaseapp.com",
    projectId: "reddit-clone-8a064",
    storageBucket: "reddit-clone-8a064.appspot.com",
    messagingSenderId: "488367010867",
    appId: "1:488367010867:web:994a86b7332d9095f51f46"
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export async  function addNewUser(email, password, username) {

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  const user = userCredential.user;

  await updateProfile(user, {displayName: username});

  return user;

}
export async function logInUser(email, password) {

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  return user;
}
export async function addPostToDataBase(currentUserUID, user, type, timePosted, voteAmount, title, content, comments, { setMasterBoard, setEntryMB }) {

  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);
  let temp = "";
  if (docSnap.exists()) {
        temp = docSnap.data();
  } else {
  // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
  if (currentUserUID.uid) {
    currentUserUID = currentUserUID.uid;
  }
  temp.sampleBoard = Object.entries(temp.sampleBoard);
  temp.sampleBoard.push([temp.sampleBoard.length.toString(), {
    userID: currentUserUID, 
    user: user, 
    id: uniqid(),
    type: type, 
    timePosted: timePosted, 
    voteAmount: voteAmount, 
    title: title, 
    content: content, 
    comments: comments
  }]);
  temp.sampleBoard = temp.sampleBoard.reduce((accum, [k, v]) => {
    accum[k] = v;
    return accum;
  }, {})
  await setDoc(doc(db, "data", "board"), temp);
  getRecords({ setMasterBoard, setEntryMB });
}
export async function upVotePostFirebase(postVoteAmount, props){
  const boardRef = doc(db, "data", "board");
  const boardSnap = await getDoc(boardRef);
  let currentUser = props.props.props.currentUserUID;
  if (currentUser.uid) {
    currentUser = currentUser.uid 
  }
  const currentPostID = props.currentPost.id;
  const mb = props.props.props.masterBoard;
  const temp = Object.entries(mb);
  
  temp.map((post) => {
    if (post[1].id === currentPostID) {
      post[1].voteAmount = postVoteAmount;
    }
  })


   if (boardSnap.exists()) {
         let board = boardSnap.data();
         let upVoteList = board.voteList;
         let tempUserArray = [];
         if (!Array.isArray(upVoteList)) {
          upVoteList = board.voteList.users;
         }
         for (let i = 0; i < upVoteList.length; ++i) {
            tempUserArray.push(upVoteList[i].currentUser);
         }
         let commentArrayStatus = upVoteList.map((user) => {
          if (user.post)  {
            return true
          } else {
            return false;
          }
        })
         if (upVoteList.length === 0 || !tempUserArray.includes(currentUser) || (tempUserArray.includes(currentUser) && !commentArrayStatus[0])) {
          
          upVoteList.push({currentUser, post: [
                                                {currentPostID, upVoteState: true, downVoteState: false}
                                              ]
                          }
                        );
         } else {
          upVoteList.map((user) => {
              if (user.currentUser === currentUser) {
                let tempPostArray = [];
                for (let i = 0; i < user.post.length; ++i) {
                   tempPostArray.push(user.post[i].currentPostID);
                }
                  if (!tempPostArray.includes(currentPostID)) {
                    user.post.push({currentPostID, upVoteState: true, downVoteState: false})
                  } else {
                    user.post.map((item => {
                        if (item.currentPostID === currentPostID) {
                          item.upVoteState = true;
                          item.downVoteState = false;
                        }
                    }))
                  }
              } 
          })
        }
        const output = Object.fromEntries(temp);
        board.sampleBoard = output;
        board.voteList = upVoteList;
        props.props.props.setVoteList(board.voteList);
        props.props.props.setMasterBoard(board.sampleBoard);
          await setDoc(doc(db, "data", "board"), board);
        }
     
}
export async function downVotePostFirebase(postVoteAmount, props){
  const boardRef = doc(db, "data", "board");
  const boardSnap = await getDoc(boardRef);
  let currentUser = props.props.props.currentUserUID;
  if (currentUser.uid) {
    currentUser = currentUser.uid 
  }
  const currentPostID = props.currentPost.id;
  const mb = props.props.props.masterBoard;
  const temp = Object.entries(mb);
  
  temp.map((post) => {
    if (post[1].id === currentPostID) {
      post[1].voteAmount = postVoteAmount;
    }
  })


   if (boardSnap.exists()) {
         let board = boardSnap.data();
         let downVoteList = board.voteList;
         let tempUserArray = [];
         if (!Array.isArray(downVoteList)) {
          downVoteList = board.voteList.users;
         }
         for (let i = 0; i < downVoteList.length; ++i) {
            tempUserArray.push(downVoteList[i].currentUser);
         }
         let commentArrayStatus = downVoteList.map((user) => {
          if (user.post)  {
            return true
          } else {
            return false;
          }
        })
         if (downVoteList.length === 0 || !tempUserArray.includes(currentUser) || (tempUserArray.includes(currentUser) && !commentArrayStatus[0])) {
     
          downVoteList.push({currentUser, post: [
                                                {currentPostID, upVoteState: false, downVoteState: true}
                                              ]
                          }
                        );
         } else {
          
          downVoteList.map((user) => {
              if (user.currentUser === currentUser) {
               
                let tempPostArray = [];
                for (let i = 0; i < user.post.length; ++i) {
                   tempPostArray.push(user.post[i].currentPostID);
                }
                  if (!tempPostArray.includes(currentPostID)) {
                  
                    user.post.push({currentPostID, upVoteState: false, downVoteState: true})
                  } else {
                    user.post.map((item => {
                        if (item.currentPostID === currentPostID) {
                          item.upVoteState = false;
                          item.downVoteState = true;
                        }
                    }))
                  }
              } 
          })
        }
        const output = Object.fromEntries(temp);
        board.sampleBoard = output;
        board.voteList = downVoteList;
        props.props.props.setVoteList(board.voteList);
        props.props.props.setMasterBoard(board.sampleBoard);
          await setDoc(doc(db, "data", "board"), board);
        }
     
}
export async function downVoteIndividualPostFirebase(postVoteAmount, props) {
  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);
  const currentUser = props.currentUserUID;
  const currentPostID = props.currentPost.id
  const mb = props.masterBoard;
  const temp = Object.entries(mb);
    
  temp.map((post) => {
    if (post[1].id === currentPostID) {
      post[1].voteAmount = postVoteAmount;
    }
  })

   let board = docSnap.data();
   let downVoteList = board.voteList;
   let tempUserArray = [];
   if (!Array.isArray(downVoteList)) {
    downVoteList = board.voteList.users;
   }
   for (let i = 0; i < downVoteList.length; ++i) {
     tempUserArray.push(downVoteList[i].currentUser);
   }
   let commentArrayStatus = downVoteList.map((user) => {
      if (user.post)  {
        return true
      } else {
        return false;
      }
    })
   if (downVoteList.length === 0 || !tempUserArray.includes(currentUser) || (tempUserArray.includes(currentUser) && !commentArrayStatus[0])) {     
        downVoteList.push({currentUser, post: [
                                          {currentPostID, upVoteState: false, downVoteState: true}
                                        ]
                          }
                        );
    } else {
          
     downVoteList.map((user) => {
         if (user.currentUser === currentUser) {
          if (!user.post) {
            for (let i = 0; i < downVoteList.length; ++i) {
              if (downVoteList[i].currentUser === currentUser) {
                
                  downVoteList[i].post = [{ currentPostID, upVoteState: false, downVoteState: true}];
              }
            }
          }
           let tempPostArray = [];
           for (let i = 0; i < user.post.length; ++i) {
              tempPostArray.push(user.post[i].currentPostID);
           }
             if (!tempPostArray.includes(currentPostID)) {
            
               user.post.push({currentPostID, upVoteState: false, downVoteState: true})
             } else {
              
               user.post.map((item => {
                   if (item.currentPostID === currentPostID) {
                     item.upVoteState = false;
                     item.downVoteState = true;
                   }
               }))
             }
         } 
     })
   }
   const output = Object.fromEntries(temp);
   board.sampleBoard = output;
   board.voteList = downVoteList;
   props.setVoteList(board.voteList);
   props.setMasterBoard(board.sampleBoard);
   await setDoc(doc(db, "data", "board"), board)
}
export async function upVoteIndividualPostFirebase(postVoteAmount, props) {
  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);
  const currentUser = props.currentUserUID;
  const currentPostID = props.currentPost.id
  const mb = props.masterBoard;
  const temp = Object.entries(mb);
    
  temp.map((post) => {
    if (post[1].id === currentPostID) {
      post[1].voteAmount = postVoteAmount;
    }
  })

   let board = docSnap.data();
   let upVoteList = board.voteList;
   let tempUserArray = [];
   if (!Array.isArray(upVoteList)) {
    upVoteList = board.voteList.users;
   }
   for (let i = 0; i < upVoteList.length; ++i) {
     tempUserArray.push(upVoteList[i].currentUser);
   }
   let commentArrayStatus = upVoteList.map((user) => {
    if (user.post)  {
      return true
    } else {
      return false;
    }
  })
   if (upVoteList.length === 0 || !tempUserArray.includes(currentUser) || (tempUserArray.includes(currentUser) && !commentArrayStatus[0])) {     
        upVoteList.push({currentUser, post: [
                                          {currentPostID, downVoteState: false, upVoteState: true}
                                        ]
                          }
                        );
    } else {
          
     upVoteList.map((user) => {
          if (user.currentUser === currentUser) {
            if (!user.post) {
              for (let i = 0; i < upVoteList.length; ++i) {
                if (upVoteList[i].currentUser === currentUser) {
                    upVoteList[i].push({post: [{ currentPostID, upVoteState: true, downVoteState: false}]})
                }
              }
            }
           let tempPostArray = [];
           for (let i = 0; i < user.post.length; ++i) {
              tempPostArray.push(user.post[i].currentPostID);
           }
             if (!tempPostArray.includes(currentPostID)) {
            
               user.post.push({currentPostID, upVoteState: true, downVoteState: false})
             } else {
              
               user.post.map((item => {
                   if (item.currentPostID === currentPostID) {
                     item.upVoteState = true;
                     item.downVoteState = false;
                   }
               }))
             }
         } 
     })
   }
   const output = Object.fromEntries(temp);
   board.sampleBoard = output;
   board.voteList = upVoteList;
   props.setVoteList(board.voteList);
   props.setMasterBoard(board.sampleBoard);
   await setDoc(doc(db, "data", "board"), board)
}
export async function addCommentToFirebase(user, id, timePost, voteAmount, text, comments, currentPost, setMasterBoard, setVoteList, currentUserUID) {
  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);
  let temp = docSnap.data();
  let sbArrayEntry = Object.entries(temp.sampleBoard);
  sbArrayEntry.map((post) => {
    if (post[1].id === currentPost.id) {
      post[1].comments.push({
        user: user,
        userID: currentUserUID,
        id: id,
        timePost: timePost, 
        voteAmount: voteAmount, 
        text: text,
        comments: comments
      })
    }
  })
  
  temp.sampleBoard = Object.fromEntries(sbArrayEntry);
  setMasterBoard(temp.sampleBoard);

  
  await setDoc(doc(db, "data", "board"), temp);

}
export async function addReplyToFirebase(user, id, timePost, voteAmount, text, response, currentPost, setMasterBoard, setVoteList, currentUserUID) {
  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);
  let board = docSnap.data();
  if (currentUserUID.uid) {
    currentUserUID = currentUserUID.uid;
  }
  let data = board.sampleBoard;

  data = tempFunction(user, id, timePost, voteAmount, text, response, currentPost, data, currentUserUID);
  data = Object.fromEntries(data);
  board.sampleBoard = data;

  setMasterBoard(data);
  await setDoc(doc(db, "data", "board"), board);

}
function tempFunction(user, id, timePost, voteAmount, text, response, currentPost, data, currentUserUID)  {
            data = Object.entries(data);
            data.map((post) => {
              if (currentPost.id === post[1].id) {
                for (let i = 0; i < post[1].comments.length; ++i) {
                   if (post[1].comments[i].id === response.id) {
                    let empty = [];
                    post[1].comments[i].comments.push({
                            user: user,
                            userID: currentUserUID,
                            id: id,
                            timePost: timePost, 
                            voteAmount: voteAmount, 
                            text: text,
                            comments: empty
                          })
                          return;
                   }
                }
                        const temp = post[1].comments;
                        retriveParentComment(response, temp, user, id, timePost, voteAmount, text, currentUserUID);
              }
            })
            return data;
  }
function retriveParentComment (response, temp, user, id, timePost, voteAmount, text, currentUserUID) {

  for (let i = 0; i < temp.length; ++i) {
    if (temp[i].id === response.id) {
      let empty = [];
        temp[i].comments.push({
          user: user,
          userID: currentUserUID,
          id: id,
          timePost: timePost, 
          voteAmount: voteAmount, 
          text: text,
          comments: empty
        })
    }
  }
  for (let i = 0; i < temp.length; ++i) {
    retriveParentComment(response, temp[i].comments, user, id , timePost, voteAmount, text, currentUserUID)
  }
 }
export async function getRecords({ setMasterBoard, setEntryMB, setVoteList}) { 

  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
        setMasterBoard(docSnap.data().sampleBoard);
        setEntryMB(docSnap.data());
        setVoteList(docSnap.data().voteList)
  } else {
  // docSnap.data() will be undefined in this case
    console.log("No such document!");
    await setDoc(doc(db, "data", "board"), sampleBoard);
  }

}
export async function upVoteCommentFirebase(commentVoteAmount, props) {
  const boardRef = doc(db, "data", "board");
  const  boardSnap = await getDoc(boardRef);
  let currentUser = props.currentUserUID;
  if (currentUser.uid) {
    currentUser = currentUser.uid;
  }
  const currentPostID = props.currentPost.id;
  const currentResponseID = props.response.id;
  const data = boardSnap.data();
  let masterBoard = data.sampleBoard;
  let upVoteList = data.voteList;

  masterBoard = Object.entries(masterBoard);
 getComment(masterBoard, currentPostID, currentResponseID, commentVoteAmount);

  if (!Array.isArray(upVoteList)) {
    upVoteList = upVoteList.users;
  }
  let usersUpVoteList = [];
  for (let i = 0; i < upVoteList.length; ++i) {
    usersUpVoteList.push(upVoteList[i].currentUser);
 }
 let commentArrayStatus = upVoteList.map((user) => {
  if (user.post)  {
    return true
  } else {
    return false;
  }
})
 if (upVoteList.length === 0 || !usersUpVoteList.includes(currentUser) || (usersUpVoteList.includes(currentUser) && !commentArrayStatus[0])) {
  console.log("first")
  upVoteList.push({currentUser, comments: [
                                        {currentResponseID, upVoteState: true, downVoteState: false}
                                      ]
                  }
                );
 }  else {
  upVoteList.map((user) => {
      if (user.currentUser === currentUser) {
        let commentsUpVoteList = [];
        if (user.comments === undefined) {
          user.comments = [{currentResponseID, upVoteState: true, downVoteState: false}]
        } else {
            for (let i = 0; i < user.comments.length; ++i) {
              commentsUpVoteList.push(user.comments[i].currentResponseID);
            }
              if (!commentsUpVoteList.includes(currentResponseID)) {
                console.log("second")
                user.comments.push({currentResponseID, upVoteState: true, downVoteState: false})
              } else {
                user.comments.map((item => {
                    if (item.currentResponseID === currentResponseID) {
                      console.log("third")
                      item.upVoteState = true;
                      item.downVoteState = false;
                    }
                }))
              }
        }
      } 
  })
}
   masterBoard = Object.fromEntries(masterBoard);
   data.sampleBoard = masterBoard;
   props.setMasterBoard(masterBoard);
   data.voteList = upVoteList;
   props.setVoteList(upVoteList);
   await setDoc(doc(db, "data", "board"), data)

}
export async function downVoteCommentFirebase(commentVoteAmount, props) {
  const boardRef = doc(db, "data", "board");
  const  boardSnap = await getDoc(boardRef);
  let currentUser = props.currentUserUID;
  if (currentUser.uid) {
    currentUser = currentUser.uid;
  }
  const currentPostID = props.currentPost.id
  const currentResponseID = props.response.id;
  const data = boardSnap.data();
  let masterBoard = data.sampleBoard;
  let downVoteList = data.voteList;

  masterBoard = Object.entries(masterBoard);
 getComment(masterBoard, currentPostID, currentResponseID, commentVoteAmount);

  if (!Array.isArray(downVoteList)) {
    downVoteList = downVoteList.users;
  }
  let usersdownVoteList = [];
  for (let i = 0; i < downVoteList.length; ++i) {
    usersdownVoteList.push(downVoteList[i].currentUser);
 }
 let commentArrayStatus = downVoteList.map((user) => {
  if (user.post)  {
    return true
  } else {
    return false;
  }
})
 if (downVoteList.length === 0 || !usersdownVoteList.includes(currentUser) || (usersdownVoteList.includes(currentUser) && !commentArrayStatus[0])) {
  console.log("first")
  downVoteList.push({currentUser, comments: [
                                        {currentResponseID, upVoteState: false, downVoteState: true}
                                      ]
                  }
                );
 }  else {
  downVoteList.map((user) => {
      if (user.currentUser === currentUser) {
        let commentsdownVoteList = [];
        if (user.comments === undefined) {
          user.comments = [{currentResponseID, upVoteState: false, downVoteState: true}]
        } else {
            for (let i = 0; i < user.comments.length; ++i) {
              commentsdownVoteList.push(user.comments[i].currentResponseID);
            }
              if (!commentsdownVoteList.includes(currentResponseID)) {
                console.log("second")
                user.comments.push({currentResponseID, upVoteState: false, downVoteState: true})
              } else {
                user.comments.map((item => {
                    if (item.currentResponseID === currentResponseID) {
                      console.log("third")
                      item.upVoteState = false;
                      item.downVoteState = true;
                    }
                }))
              }
        }
      } 
  })
}
   masterBoard = Object.fromEntries(masterBoard);
   data.sampleBoard = masterBoard;
   props.setMasterBoard(masterBoard);
   data.voteList = downVoteList;
   props.setVoteList(downVoteList);
   await setDoc(doc(db, "data", "board"), data)

}

function getComment(masterBoard, currentPostID, currentResponseID, commentVoteAmount) {
  masterBoard.map((post) => {
    if (post[1].id === currentPostID) {
      let commentIDArray = [];
      let temp = post[1].comments;
      temp.map((comment) => {
        commentIDArray.push(comment.id);
      })
      if (commentIDArray.includes(currentResponseID)) {
        post[1].comments.map((comment) => {
          if (comment.id === currentResponseID) {
            comment.voteAmount = commentVoteAmount;
            return;
          }
        })
      } else {
        getCommentRecursion(post[1].comments, currentResponseID, commentVoteAmount);
      }
    }
  })
}
function getCommentRecursion(comments, currentResponseID, commentVoteAmount) {

  let commentIDArray = [];
  comments.map((comment) => {
    commentIDArray.push(comment.id);
  })
  if (commentIDArray.includes(currentResponseID)) {
    comments.map((comment) => {
      if (comment.id === currentResponseID) {
        comment.voteAmount = commentVoteAmount;
      }
    })

  } else {
    for (let i = 0; i < comments.length; ++i) {
      getCommentRecursion(comments[i].comments, currentResponseID, commentVoteAmount);
    }
  }
}

export async function deletePostFromFirebase(currentPost, setMasterBoard, setCurrentPost) {
  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);
  let data = docSnap.data();
  let masterBoard = data.sampleBoard;

  masterBoard = Object.entries(masterBoard);

  masterBoard.map((post) => {
    if (post[1].id === currentPost.id) {
        post[1].title = "deleted";
        post[1].content = "deleted";
        setCurrentPost(post[1]);
    }
  })

  masterBoard = Object.fromEntries(masterBoard);
  data.sampleBoard = masterBoard;
  setMasterBoard(masterBoard); 
  await setDoc(doc(db, "data", "board"), data)

}

export async function deleteCommentFromFirebase(response, currentPost, setMasterBoard) {
  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);
  let data = docSnap.data();
  let masterBoard = data.sampleBoard;
  masterBoard = Object.entries(masterBoard);
    masterBoard.map((post) => {
      if (post[1].id === currentPost.id) {
          getDeleteCommentRecursion(post[1].comments, response);
      }
    })
    masterBoard = Object.fromEntries(masterBoard);
    data.sampleBoard = masterBoard;
    setMasterBoard(masterBoard); 
    await setDoc(doc(db, "data", "board"), data)
}
function getDeleteCommentRecursion(comments, response) {
  let commentIDArray = [];
  comments.map((comment) => {
    commentIDArray.push(comment.id);
  })
  if (commentIDArray.includes(response.id)) {
    comments.map((comment) => {
      if (comment.id === response.id) {
        comment.text = "deleted";
        comment.user = "deleted";
        return;
      }
    })

  } else {
    for (let i = 0; i < comments.length; ++i) {
      getDeleteCommentRecursion(comments[i].comments, response);
    }
  }
}