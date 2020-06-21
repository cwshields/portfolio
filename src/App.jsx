import React from "react";
import "./styles/App.scss";
import { BrowserRouter } from "react-router-dom";
import routes from "./routes";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {routes}
      </BrowserRouter>
    </div>
  );
}

export default App;
