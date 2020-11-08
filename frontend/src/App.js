import logo from './logo.svg';
import './App.css';
import NavBar from './component/NavBar';
import SearchBar from './component/SearchBar';

function App() {
  return (
    <div className="App">
        <SearchBar/>
        <NavBar/>
    </div>
  );
}

export default App;
