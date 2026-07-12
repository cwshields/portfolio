import React from "react";
import { Switch, Route } from "react-router-dom";
import Welcome from "./pages/welcome/Welcome";
import Home from "./pages/home/Home";
import ScrabbleGame from "./pages/ScrabbleGame/ScrabbleGame";

export default (
  <Switch>
    <Route exact path='/' component={Welcome} />
    <Route path='/home' component={Home} />
    <Route path='/scrabble-game' component={ScrabbleGame} />
  </Switch>
);
