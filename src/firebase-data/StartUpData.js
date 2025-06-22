import { initializeApp } from 'firebase/app';
import  sampleBoard  from "./MessageBoardSample.json";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile  } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc  } from "firebase/firestore";
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


export async function addNewUser(email, password, username) {

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