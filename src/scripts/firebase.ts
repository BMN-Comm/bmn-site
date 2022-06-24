import { initializeApp } from "firebase/app";
//import { getAuth } from "Firebase/auth";
import { collection, doc, getFirestore } from "firebase/firestore/lite";
const firebaseConfig = {
  apiKey: "AIzaSyA4X7YCT7m7hFTyLJSPcEc_nZJOQ-9CTyE",
  authDomain: "bmn-site-9c595.firebaseapp.com",
  projectId: "bmn-site-9c595",
  storageBucket: "bmn-site-9c595.appspot.com",
  messagingSenderId: "511143035115",
  appId: "1:511143035115:web:fe89ed421433de6e69feae"
};
let app = initializeApp(firebaseConfig);
//const auth = getAuth(app);
let db = getFirestore(app);
const songDoc = (songId : string) => doc(db, "Songs", songId)
const songsDocs = () => collection(db, "Songs")
export {
    songDoc,
    songsDocs
}
