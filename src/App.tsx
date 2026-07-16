import { Component } from "react";
import "./styles/App.scss";
import { BrowserRouter } from "react-router-dom";
import routes from "./routes";
import HexagonBackground from "./components/HexagonBackground/HexagonBackground";

class App extends Component {

  render() {
    return (
      <div className="App">
        <HexagonBackground />
        <BrowserRouter>
          {routes}
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
