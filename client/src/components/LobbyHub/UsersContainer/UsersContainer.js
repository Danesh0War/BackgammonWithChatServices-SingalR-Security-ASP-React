import React from "react";
import "./usersContainer.css";

// Component to display the list of online and offline users
const UsersContainer = ({ userClicked, users, currentUser }) => {
  return (
    <div className="user-list">
      {/* Display current user's name */}
      <p>Hello {currentUser.username}!</p>
      <hr className="line" />
      {/* Display online users */}
      <h5 className="usersOnlineTitle">Online Users</h5>
      {/* Render All chat option */}
      <div className="user">
        <div id={"CallChat"} className="circle on" />
        <div
          className="online-user"
          id="allChat"
          onClick={() => userClicked("allChat")}
        >
          All
        </div>
      </div>
      {/* Map through online users and render them */}
      {users.map((u, index) => (
        <div key={index}>
          {/* Check if the user is not the current user and has a connection ID */}
          {u.username !== currentUser.username && u.connectionId && (
            <div className="user">
              <div id={"C" + u.username} className="circle on" />
              <div
                className="online-user"
                id={u.username}
                onClick={() => userClicked(u)}
              >
                {u.username}
              </div>
            </div>
          )}
        </div>
      ))}
      <hr className="line" />
      {/* Display offline users */}
      <h5 className="usersOfflineTitle">Offline Users</h5>
      {/* Map through offline users and render them */}
      {users.map((u, index) => (
        <div key={index}>
          {/* Check if the user is not the current user and does not have a connection ID */}
          {u.username !== currentUser.username && !u.connectionId && (
            <div className="user">
              <div className="circle off" />
              <div className="offline-user" id={u.username}>
                {u.username}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UsersContainer;
