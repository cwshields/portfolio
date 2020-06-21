import React from "react";
import { Switch, Route } from "react-router-dom";
import Welcome from "./components/welcome/Welcome";
import Info from "./components/info/Info";

export default (
  <Switch>
    <Route exact path='/' component={Welcome} />
    <Route path='/info' component={Info} />
  </Switch>
);
