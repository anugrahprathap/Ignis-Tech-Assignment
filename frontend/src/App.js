import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import EventHome from './components/EventHome';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import LikedEvents from './components/LikedEvents';


function App() {
  return (
    <div className="App">
      <Router>
                <Routes>
                <Route path="/" element={<EventHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/liked-events" element={<LikedEvents />} />
                </Routes>
            </Router>
      {/* <EventHome/> */}
    </div>
  );
}

export default App;
