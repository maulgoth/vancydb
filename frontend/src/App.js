import './App.css';
import NavBar from './component/NavBar';
import Chart from './component/Chart';
import Map from './component/Map';
import SearchBar from './component/SearchBar';
import { Grid, GridRow, Segment} from 'semantic-ui-react'

function App() {
  return (
    <div className="App">
      <NavBar/>
      <SearchBar/>
      <Grid columns={2} divided padded>
        <Grid.Column>
          <Segment>
             <Chart/>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment>
          <Map/>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default App;
