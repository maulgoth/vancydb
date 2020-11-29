import "./App.css";
import NavBar from "./component/NavBar";
import Chart from "./component/Chart";
import MapPage from "./component/MapPage";
import SearchBar from "./component/SearchBar";

import { Grid, GridRow, Segment } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        {/* <SearchBar/> */}
        <Switch>
          <Route path="/chart">
            <Segment>
              <Chart />
            </Segment>
          </Route>
          <Route path="/map">
            <Segment>
              <MapPage />
            </Segment>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
