const firebaseConfig = {
  apiKey: "AIzaSyCFbgh8vEClVlpQwbQTR_Qypy8KVdGl4Z0",
  authDomain: "weather-webapp-f7d6e.firebaseapp.com",
  projectId: "weather-webapp-f7d6e",
  storageBucket: "weather-webapp-f7d6e.appspot.com",
  messagingSenderId: "174647578490",
  appId: "1:174647578490:web:839a608eae82586f5d10c3",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const Login = async (email, password) => {
  let err = null;
  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      const obj = { id: user.uid };
      sessionStorage.setItem("authUser", JSON.stringify(obj));
      window.location = "index.html";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      err = errorMessage;
      // ..
    });
  return err;
};

export const SignUp = async (username, email, password) => {
  await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      user.updateProfile({
        displayName: username,
      });
      const obj = { id: user.uid };
      sessionStorage.setItem("authUser", JSON.stringify(obj));
      window.location = "index.html";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      const message = document.getElementById("error_message");
      message.classList.add("show");
    });
};

export const logout = async () => {
  await firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("User logout");
      sessionStorage.removeItem("authUser");
      window.location = "login.html";
    })
    .catch((err) => {
      console.log(err.message);
    });
};
