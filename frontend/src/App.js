import "./App.css";
import NavBar from "./component/NavBar";
import Chart from "./component/Chart";
import MapPage from "./component/MapPage";
import SearchBar from "./component/SearchBar";
import HPI from "./component/HPI";
import Address from "./component/Address";

import { Grid, GridRow, Segment, Image } from "semantic-ui-react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Segment>
              {/* <h1>Vancouver Property Database</h1> */}
              <Image fluid src='https://res.cloudinary.com/simpleview/image/upload/v1486505969/clients/vancouverbc/Aerial_Sunset_Vancouver_d3_copy_1bb86ed0-1edc-4cda-841d-0b033ca0bb72.jpg' />
            </Segment>
          </Route>
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
          <Route path="/hpi">
            <Segment>
              <HPI />
            </Segment>
          </Route>
          <Route path="/address">
            <Segment>
              <Address />
            </Segment>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
