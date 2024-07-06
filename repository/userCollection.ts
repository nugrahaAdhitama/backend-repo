import firebase from "../config/firebaseConfig";

const db = firebase.firestore();
const User = db.collection("Users");

export default User;
