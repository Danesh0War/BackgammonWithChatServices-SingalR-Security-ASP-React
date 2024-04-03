import React from "react";
import "./Board.css";

// Array to hold triangle elements
export const Triangles = [];

// Function to create a white piece element
const White = (id) => <div id={"P" + id} className="white piece" />;

// Function to create a black piece element
const Black = (id) => <div id={"P" + id} className="black piece" />;

// Function to create a none piece element
const none = (id) => <div id={"N" + id} className="none piece" />;

// Function to create the board triangles
export const MakeBoard = () => {
  const w = [];
  const b = [];
  // Creating white and black pieces
  for (let i = 1; i <= 30; i++) {
    if (i <= 15) w.push(White(i));
    else b.push(Black(i));
  }

  // Creating the triangles based on index
  for (let index = 0; index <= 24; index++) {
    let input = [];
    switch (index) {
      // Setting input for each triangle
      case 1:
        input = [b[0], b[1]];
        break;
      case 6:
        input = [w[10], w[11], w[12], w[13], w[14]];
        break;
      case 8:
        input = [w[7], w[8], w[9]];
        break;
      case 12:
        input = [b[2], b[3], b[4], b[5], b[6]];
        break;
      case 13:
        input = [w[2], w[3], w[4], w[5], w[6]];
        break;
      case 17:
        input = [b[7], b[8], b[9]];
        break;
      case 19:
        input = [b[10], b[11], b[12], b[13], b[14]];
        break;
      case 24:
        input = [w[0], w[1]];
        break;
      default:
        break;
    }

    // Creating triangle elements and adding to Triangles array
    if (index < 13) {
      if (index % 2 === 0) {
        Triangles.push(
          <div id={"T" + index} className={"boardRedPartdown triangle"}>
            {none(index)}
            {input}
          </div>
        );
      } else {
        Triangles.push(
          <div id={"T" + index} className={"boardBlackPartdown triangle"}>
            {none(index)}
            {input}
          </div>
        );
      }
    } else {
      if (index % 2 !== 0) {
        Triangles.push(
          <div id={"T" + index} className={"boardBlackPartup triangle"}>
            {none(index)}
            {input}
          </div>
        );
      } else {
        Triangles.push(
          <div id={"T" + index} className={"boardRedPartup triangle"}>
            {none(index)}
            {input}
          </div>
        );
      }
    }
  }
};

// Component to create the game board
const CreatBoard = () => {
  // Calling MakeBoard function to create triangles
  MakeBoard();

  return (
    <div className="board">
      {/* Rendering board outline */}
      <div className="outline1" />
      <div className="outline2" />
      {/* Rendering top left part of the board */}
      <div className="topleft">
        {Triangles[12]}
        {Triangles[11]}
        {Triangles[10]}
        {Triangles[9]}
        {Triangles[8]}
        {Triangles[7]}
      </div>
      {/* Rendering separator */}
      <div className="seperetorLeft" />
      {/* Rendering bottom left part of the board */}
      <div className="botleft">
        {Triangles[13]}
        {Triangles[14]}
        {Triangles[15]}
        {Triangles[16]}
        {Triangles[17]}
        {Triangles[18]}
      </div>
      {/* Rendering middle part of the board */}
      <div id={"MidPart"} className="mid" />
      {/* Rendering top right part of the board */}
      <div className="topRight">
        {Triangles[6]}
        {Triangles[5]}
        {Triangles[4]}
        {Triangles[3]}
        {Triangles[2]}
        {Triangles[1]}
      </div>
      {/* Rendering separator */}
      <div className="seperetorRight" />
      {/* Rendering bottom right part of the board */}
      <div className="botRight">
        {Triangles[19]}
        {Triangles[20]}
        {Triangles[21]}
        {Triangles[22]}
        {Triangles[23]}
        {Triangles[24]}
      </div>
      {/* Rendering dices */}
      <div className={"dices"}>
        <div id={"firstDice"} className={"firstDice"} />
        <div id={"secondDice"} className={"secondDice"} />
      </div>
    </div>
  );
};

export default CreatBoard;
