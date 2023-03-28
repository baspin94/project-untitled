import { useEffect } from "react";
import { Route } from "react-router-dom";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import Groups from "./Groups";
import { useHistory } from "react-router-dom";
import { useState } from "react";

function App() {
  const [user, setUser] = useState([]);
  const [groups, setGroups] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchUser();
    // fetchGroups();
  }, []);

  function fetchUser() {
    fetch("/authorized").then((res) => {
      if (res.ok) {
        res.json().then((userData) => {
          setUser(userData);
          fetchGroups(userData);
        });
      } else {
        setUser([]);
        history.push("/signin");
      }
    });
  }

  function fetchGroups(userData) {
    fetch(`/host/${userData.id}`)
      .then((res) => res.json())
      .then((groupData) => setGroups(groupData));
  }

  ///////// keep ///////
  // useEffect(() => {
  //   // history.push("/");

  //   fetch("/authorized").then((res) => {
  //     if (res.ok) {
  //       res.json().then((user) => setUser(user), console.log(user));
  //     } else {
  //       setUser([]);
  //       history.push("/signin");
  //     }
  //   });
  // }, []);

  function handleLogout() {
    fetch("/logout", {
      method: "DELETE",
    }).then(() => {
      setUser([]);
      history.push("/signin");
    });
  }

  return (
    <>
      <Route path="/signin">
        <SignInForm setUser={setUser} />
      </Route>
      <Route path="/signup">
        <SignUpForm />
      </Route>
      <Route exact path="/">
        <h1>Hello, you're on the homepage!!!!</h1>
        <button className="input-btn" onClick={handleLogout}>
          Log Out
        </button>
        <Groups groups={groups} />
      </Route>
    </>
  );
}
export default App;
