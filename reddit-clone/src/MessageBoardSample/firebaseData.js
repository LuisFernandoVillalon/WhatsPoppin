import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, child, push, update } from "firebase/database"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile  } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCkY2NbgewS8OFKnSRv5tKfMgWwTpzoKTM",
    authDomain: "reddit-clone-8a064.firebaseapp.com",
    projectId: "reddit-clone-8a064",
    storageBucket: "reddit-clone-8a064.appspot.com",
    messagingSenderId: "488367010867",
    appId: "1:488367010867:web:994a86b7332d9095f51f46"
};
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

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

export function addPostToDataBase(user, type, timePosted, voteAmount, title, content, comments) {
    const newUserKey = push(child(ref(database), 'post')).key;
    
    const updates = {};

    updates[newUserKey] = {user, type, timePosted, voteAmount, title, content, comments, newUserKey};

    return update(ref(database), updates);
}

export function getRecords({ setMasterBoard, setEntryMB }) { 
  const board = ref(database, '/');
  onValue(board, (snapshot) => {
    const data = snapshot.val();
   setMasterBoard(data);
   setEntryMB(data);
  });
}

export function getUpVoteList({setUpVoteList}) {
  const upVoteList = ref(database, '/' );
  onValue(upVoteList, (snapshot) => {
    let data = snapshot.child("upVoteList").val();
    if (data === null) {
      data = [""];
    }
    setUpVoteList(data);
  });
}

export function getDownVoteList({setDownVoteList}) {
  const downVoteList = ref(database, '/' );
  onValue(downVoteList, (snapshot) => {
    let data = snapshot.child("downVoteList").val();
    if (data === null) {
      data = [""];
    }
    setDownVoteList(data);
  });
}

export function upVotePostFirebase(postVoteAmount, props){
     let board = props.props.props.entryMB;
     let currPost = props.currentPost;
    board = Object.entries(board);
    let keyLocation = '';
    for (let i = 0; i < board.length; ++i) {
      if (board[i][1].user === currPost.user) {
        if (board[i][1].timePosted === currPost.timePosted) {
          if (board[i][1].title === currPost.title) {
            if (board[i][1].type === currPost.type) {
              if (board[i][1].content === currPost.content) {
                    keyLocation = board[i][0];
              }
            }
          }
        }
      }
    }
    const updates = {};
        const comments =  currPost.comments;
        const content =  currPost.content;
        const timePosted =  currPost.timePosted;
        const title =  currPost.title;
        const type =  currPost.type;
        const user =  currPost.user;
        const newUserKey = currPost.newUserKey;
        const voteAmount = postVoteAmount ;
    updates[keyLocation] = {comments, content, timePosted, title, type, user, voteAmount, newUserKey};

    let uid = props.props.props.currentUserUID; 
    const upVoteState = true;
    const downVoteState = false;
    if (typeof uid !== "string") {
      uid = uid.uid;
    }
    updates['/downVoteList/' + uid + '/' + keyLocation] = { downVoteState };
    updates['/upVoteList/' + uid + '/' + keyLocation] = { upVoteState };
    return update(ref(database), updates);
}

export function upVoteIndividualPostFirebase(postVoteAmount, props) {
  let board = props.entryMB;
  let currPost = props.currentPost;
 board = Object.entries(board);
 let keyLocation = '';
 for (let i = 0; i < board.length; ++i) {
   if (board[i][1].user === currPost.user) {
     if (board[i][1].timePosted === currPost.timePosted) {
       if (board[i][1].title === currPost.title) {
         if (board[i][1].type === currPost.type) {
           if (board[i][1].content === currPost.content) {
                 keyLocation = board[i][0];
           }
         }
       }
     }
   }
 }
 const updates = {};
     const comments =  currPost.comments;
     const content =  currPost.content;
     const timePosted =  currPost.timePosted;
     const title =  currPost.title;
     const type =  currPost.type;
     const user =  currPost.user;
     const newUserKey = currPost.newUserKey;
     const voteAmount = postVoteAmount ;
 updates[keyLocation] = {comments, content, timePosted, title, type, user, voteAmount, newUserKey};

 let uid = props.currentUserUID; 
 const upVoteState = true;
 const downVoteState = false;
 if (typeof uid !== "string") {
   uid = uid.uid;
 }
 updates['/downVoteList/' + uid + '/' + keyLocation] = { downVoteState };
 updates['/upVoteList/' + uid + '/' + keyLocation] = { upVoteState };
 return update(ref(database), updates);

}

export function downVotePostFirebase(postVoteAmount, props){
  let board = props.props.props.entryMB;
  let currPost = props.currentPost;
 board = Object.entries(board);
 let keyLocation = '';
 for (let i = 0; i < board.length; ++i) {
   if (board[i][1].user === currPost.user) {
     if (board[i][1].timePosted === currPost.timePosted) {
       if (board[i][1].title === currPost.title) {
         if (board[i][1].type === currPost.type) {
           if (board[i][1].content === currPost.content) {
                 keyLocation = board[i][0];
           }
         }
       }
     }
   }
 }
 const updates = {};
     const comments =  currPost.comments;
     const content =  currPost.content;
     const timePosted =  currPost.timePosted;
     const title =  currPost.title;
     const type =  currPost.type;
     const user =  currPost.user;
     const newUserKey = currPost.newUserKey;
     const voteAmount = postVoteAmount ;
 updates[keyLocation] = {comments, content, timePosted, title, type, user, voteAmount, newUserKey};

 let uid = props.props.props.currentUserUID; 
 const downVoteState = true;
 const upVoteState = false;
 if (typeof uid !== "string") {
   uid = uid.uid;
 }
 updates['/downVoteList/' + uid + '/' + keyLocation] = { downVoteState };
 updates['/upVoteList/' + uid + '/' + keyLocation] = { upVoteState };

 return update(ref(database), updates);
}

export function downVoteIndividualPostFirebase(postVoteAmount, props) {
  let board = props.entryMB;
  let currPost = props.currentPost;
 board = Object.entries(board);
 let keyLocation = '';
 for (let i = 0; i < board.length; ++i) {
   if (board[i][1].user === currPost.user) {
     if (board[i][1].timePosted === currPost.timePosted) {
       if (board[i][1].title === currPost.title) {
         if (board[i][1].type === currPost.type) {
           if (board[i][1].content === currPost.content) {
                 keyLocation = board[i][0];
           }
         }
       }
     }
   }
 }
 const updates = {};
     const comments =  currPost.comments;
     const content =  currPost.content;
     const timePosted =  currPost.timePosted;
     const title =  currPost.title;
     const type =  currPost.type;
     const user =  currPost.user;
     const newUserKey = currPost.newUserKey;
     const voteAmount = postVoteAmount ;
 updates[keyLocation] = {comments, content, timePosted, title, type, user, voteAmount, newUserKey};

 let uid = props.currentUserUID; 
 const upVoteState = false;
 const downVoteState = true;
 if (typeof uid !== "string") {
   uid = uid.uid;
 }
 updates['/downVoteList/' + uid + '/' + keyLocation] = { downVoteState };
 updates['/upVoteList/' + uid + '/' + keyLocation] = { upVoteState };
 return update(ref(database), updates);

}