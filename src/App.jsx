import React, { Component } from "react";
import "./styles/App.scss";
import { BrowserRouter } from "react-router-dom";
import routes from "./routes";

class App extends Component {

  wheel = (e) => {
    console.log(e.deltaY)
  }
  
  render() {
    return (
      <div /*onWheel={(e) => this.wheel(e)}*/ className="App">
        <BrowserRouter>
          {routes}
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
