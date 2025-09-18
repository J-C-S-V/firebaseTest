import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  // signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app, db, auth } from "./lib/firebase.js";
import Todo from "./components/Todo.jsx";
// Import the functions you need from the SDKs
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import "./App.css";

function App() {
  const [name, setName] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function testFirestore() {
      const docRef = doc(db, "firebaseCollection", "firebaseDocument");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setName(docSnap.data().name);
      } else {
        console.log("No such document!");
      }
    }

    testFirestore();
  }, []);

  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        console.log("User signed up:", userCredential.user);
      })
      .catch((error) => {
        console.error("Error signing up:", error);
      });
  };

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        console.log("User signed in:", userCredential.user);
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        setUser(null);
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <>
      <p>Firestore Authentication</p>

      <div>
        {!user && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={signUp}>Sign up</button>
            <button onClick={signIn}>Sign In</button>
          </>
        )}

        {user && <button onClick={logOut}>Log out</button>}
      </div>
      {user && <p>Welcome, {user.email}</p>}
      {user && <Todo />}
    </>
  );
}

export default App;
