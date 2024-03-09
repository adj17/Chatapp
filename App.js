import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Signin from './components/Signin';
import SignUp from './components/Register';
import Chat from './components/Chat';
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom';
import Profile from './components/Profile';
function App() {
  return (
    <div className="App">

 <Router>
      <Routes>
      <Route exact path="/" element={<Home/>} />
        <Route path="/SignUp" element={<SignUp/>} />
        <Route path="/Signin" element={<Signin/>} />
        <Route path="/Chat" element={<Chat/>} />
        <Route path="/Profile" element={<Profile/>} />
        </Routes>
        </Router>
    </div>
  );
}

export default App;
