import React from "react";
import { Switch, Route } from "react-router-dom";
import Welcome from "./components/welcome/Welcome";
import Home from "./components/home/Home";
import ScrabbleGame from "./components/ScrabbleGame/ScrabbleGame";

export default (
  <Switch>
    <Route exact path='/' component={Welcome} />
    <Route path='/home' component={Home} />
    <Route path='/scrabble-game' component={ScrabbleGame} />
  </Switch>
);
