import "./Lobby.css";
import UsersContainer from "./UsersContainer/UsersContainer";
import GameLogic from "./GameContainer/GameLogic";
import ChatContainer from "./ChatContainer/ChatContainer";
import { useState } from "react";

const Lobby = ({
  move,
  turn,
  color,
  setDices,
  dices,
  board,
  chat,
  connection,
  currentUser,
  users,
}) => {
  const [flag, setFlag] = useState(true);

  async function userClicked(otherUser) {
    await connection.invoke("EndGame", chat, null);

    if (otherUser === "allChat")
      await connection.invoke("GetChat", "", otherUser);
    else
      await connection.invoke(
        "GetChat",
        currentUser.username,
        otherUser.username
      );
  }

  return (
    <div>
      {!board && (
        <button className="helpBtn" onClick={() => setFlag(!flag)}>
          Info
        </button>
      )}
      {flag ? (
        <div className="lobby">
          <UsersContainer
            userClicked={userClicked}
            users={users}
            currentUser={currentUser}
            connection={connection}
          />
          {chat ? (
            <div className="game">
              <GameLogic
                move={move}
                currentUser={currentUser}
                turn={turn}
                color={color}
                setDices={setDices}
                dices={dices}
                board={board}
                connection={connection}
                chat={chat}
              ></GameLogic>
              <ChatContainer
                board={board}
                connection={connection}
                currentUser={currentUser}
                chat={chat}
              ></ChatContainer>
            </div>
          ) : (
            <h4 className="lobby-wating">Select a user to start a chat</h4>
          )}
        </div>
      ) : (
        <div className="lobby space">
          <h3>The Backgammon Game</h3>
          <h5>
            Backgammon is one of the oldest known board games, its history can be traced back nearly 5,000 years to archeological discoveries in the Middle East.
            It is a game of skill and strategy where each player competes to move their 15 pieces according to rolls of the dice across a board consisting of 24 narrow triangles,
            referred to as "points". These points are grouped into four quadrants, which are the home and outer boards for both players.
          </h5>
          <h5> 
            The objective of the game is to be the first to bear off, i.e., move all fifteen checkers off the board.
            Backgammon involves a combination of strategy and luck (from rolling dice).
            While luck plays a role, strategy is the dominant element, and skilled players will consistently outperform less skilled opponents over a series of games.
          </h5>
          <hr />
          <h3>Rules:</h3>
          <h5> For a comprehensive understanding of the official rules and strategic gameplay of backgammon, explore our detailed section: </h5>
          <a
            className="rulesLink"
            href="https://www.hasbro.com/common/instruct/Backgammon.PDF"
            target="_blank"
          >
           More About Official Rules and Common Strategies.
          </a>
          <hr />
          <div className="showUsers">
            <div className="circle on" />
            Online User
          </div>
          <div className="showUsers">
            <div className="circle off" />
            Offline User
          </div>
          <div className="showUsers">
            <div className="circle play" />
            User that wants to play against you.
          </div>
        </div>
      )}
    </div>
  );
};

export default Lobby;
