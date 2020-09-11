import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.scss";

// firebase Stuff
import { firebaseConfig } from "./config/firebaseConfig";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import "firebase/functions";

// # zuluitandsolutions@gmail.com
// # 7375838577

// routes
import Home from "./pages/Home";
import Login from "./pages/Login";
import ContextsProvider from "./context/ContextsProvider";
import Header from "./layout/Header";
import CreateClass from "./pages/CreateClass";
import PrivateTeacherRoute from "./components/PrivateTeacherRoute";

// init firebase
firebase.initializeApp(firebaseConfig);

function App() {
  //FIXME: .env not working
  //  console.log("Key", firebaseConfig);
  return (
    <div>
      <ContextsProvider>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <PrivateTeacherRoute
              exact
              path="/class/create"
              component={CreateClass}
            />
          </Switch>
        </BrowserRouter>
      </ContextsProvider>
    </div>
  );
}

export default App;
