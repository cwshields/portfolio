import React, { Component } from 'react';
import '../../styles/ScrabbleGame.scss';
import { Link } from "react-router-dom"
import Tiles from '../Tiles/Tiles';

class ScrabbleGame extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // p1turn is to cycle between turns
      p1turn: true,
      // when firstTurn is false, the player will have to use letters currently on the board
      firstTurn: true,
      // p#inv is the players current inventory of letters 
      p1inv: [],
      p2inv: [],
      p1count: 0,
      p2count: 0,
      // increments by the score of each letter used
      wordScore: 0,
      // adds the wordScore to the applicable player
      p1score: 0,
      p2score: 0,
      // the board is an array of numbers (also keys or ids) that are mapped through to be created 
      board: [],
      // lettersUsed is what letters are currently on the board for later use
      lettersUsed: [],
      // full alphabet with scores
      letters: [
        { name: 'a', score: 1 },
        { name: 'b', score: 3 },
        { name: 'c', score: 3 },
        { name: 'd', score: 2 },
        { name: 'e', score: 1 },
        { name: 'f', score: 4 },
        { name: 'g', score: 2 },
        { name: 'h', score: 4 },
        { name: 'i', score: 1 },
        { name: 'j', score: 8 },
        { name: 'k', score: 5 },
        { name: 'l', score: 1 },
        { name: 'm', score: 3 },
        { name: 'n', score: 1 },
        { name: 'o', score: 1 },
        { name: 'p', score: 3 },
        { name: 'q', score: 10 },
        { name: 'r', score: 1 },
        { name: 's', score: 1 },
        { name: 't', score: 1 },
        { name: 'u', score: 1 },
        { name: 'v', score: 4 },
        { name: 'w', score: 4 },
        { name: 'x', score: 8 },
        { name: 'y', score: 4 },
        { name: 'z', score: 10 },
      ]
    }
    // creates board of input squares reffered to as "tiles"
    for ( let j = 0; j < 11; j++ ) {
      var x = []
      for ( var i = 0; i < 11; i++ ) {
        x.push(`${i+1},${j+1}`)
      }
      this.state.board.push(x)
    }
  }
  
  // generates player letters
  generateInv = (name, length) => {
    let result = '';
    let characters = 'abcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    let final = result.split('')
    this.setState({ [name]: final })
  }
  
  componentDidMount = () => {
    this.generateInv('p1inv', 8)
    this.generateInv('p2inv', 8)
  }

  updateInv = (newVal, oldVal, inv) => {
    let { p1turn, p1count, p2count, letters, lettersUsed, wordScore } = this.state
    // this checks for a new value, then adds/removes the wordScore and the lettersUsed array related to the letter used
    // by checking for the score in the letters array
    if ( newVal !== oldVal ) {
      if ( inv.includes(newVal) ) {
        inv.splice(inv.indexOf(newVal), 1, oldVal)
        if ( !oldVal ) {
          lettersUsed.push(letters.find(i => i.name === newVal))
          this.setState({ wordScore: wordScore + letters.find(i => i.name === newVal).score })
          // these if statements increment/decrement p#count depending on if value is inputted or removed
          if ( p1turn ) {
            this.setState({ p1count: p1count + 1 })
          } else {
            this.setState({ p2count: p2count + 1 })
          }
        } else {
          lettersUsed.splice(letters.find(i => i.name === oldVal), 1)
          this.setState({ wordScore: wordScore - letters.find(i => i.name === oldVal).score })
          if ( p1turn ) {
            this.setState({ p1count: p1count - 1 })
          } else {
            this.setState({ p2count: p2count - 1 })
          }
        }
      }
      if ( oldVal && !inv.includes(oldVal) ) {
        inv.push(oldVal)
      }
    }
  }

  submit = () => {
    const { p1turn, wordScore } = this.state
    this.setState({ p1turn: !p1turn, wordScore: 0 })
    if ( p1turn ) {
      this.setState({ p1score: wordScore, p1count: 0 })
      this.generateInv('p1inv', 8)
    } else {
      this.setState({ p2score: wordScore, p2count: 0 })
      this.generateInv('p2inv', 8)
    }
  }
  
  render () {
    const {  board, p1turn, p1inv, p2inv, wordScore, p1score, p2score } = this.state
    return (
      <div className="scrabble-game">
        <Link to="/home" className="back">
          <svg
            className="arrow"
            viewBox="0 0 75 75"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="back-button"
          >
            <path
              d="m32 56c1.104 0 2-.896 2-2v-39.899l14.552 15.278c.393.413.92.621 1.448.621.495 
                      0 .992-.183 1.379-.552.8-.762.831-2.028.069-2.828l-16.619-17.448c-.756-.755-1.76-1.172-2.829-1.172s-2.073.417-2.862 
                      1.207l-16.586 17.414c-.762.8-.731 2.066.069 2.828s2.067.731 2.828-.069l14.551-15.342v39.962c0 1.104.896 2 2 2z"
            />
            <div id="back-button" className="display-none">Back Button</div>
          </svg>
        </Link>
        <div className="score">Score: {p1score}</div>
        <div className="letters">
          { p1inv.map((letter, index) => {
              return <div key={index} className="letter">{letter}</div>
            })
          }
        </div>
        <div className="tile-wrap">
          <div className="tile-container">
            { board.map(row => {
              var tiles = []
              for (let index = 0; index < row.length; index++) {
                tiles.push(
                  <Tiles
                    key = {row[index]}
                    id = {row[index]}
                    inv = {
                      p1turn
                      ? p1inv
                      : p2inv
                    }
                    updateInv = {this.updateInv}
                  />
                  )
                }
                return tiles
              })
            }
          </div>
          <div className="tutorial">
            <h3>How to play</h3>
            To play, just type each letter in the tiles to make a word. When your 
            word is complete, click submit to end your turn and start player 2's 
            turn. Whoever gets to 100 points first wins. You can refresh the page to 
            reset the board. Thanks for playing!
          </div>
          <div className="turn">Player {p1turn ? 1 : 2 }'s turn</div>
          <div className="word-score">{wordScore}</div>
          <button onClick={this.submit} className="submit">Submit</button>
        </div>
        <div className="letters">
          { p2inv.map((letter, index) => {
              return <div key={index} className="letter">{letter}</div>
            })
          }
        </div>
        <div className="score">Score: {p2score}</div>
      </div>
    );
  }
}

export default ScrabbleGame;
