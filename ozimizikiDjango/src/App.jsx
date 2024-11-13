import './App.css';
import Header from './components/Header';
import Options from './components/Options';
import About from './pages/about';
import Contract from './pages/contract';
import Detail from './pages/detail';
import GovernmentBuildings from './pages/governmentBuildings';
import Register from './pages/register';
import Login from './pages/login';
import Rent from './pages/rent';
import Profile from './pages/profile';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Buildings from './pages/buildings';
import Rooms from './pages/rooms';
import Governments from './pages/Governments';
import Customers from './pages/customers';
import Rents from './pages/rents';
import RentChoice from './pages/rentChoice';
import CreateRoomForGovernment from './pages/createRoomForGovernment';
import { useState } from 'react';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const handleLogin = () => {
    setIsAuthenticated(true);
  };


  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <>
        <Header />
        <Options isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/government-buildings" element={<GovernmentBuildings />} />
          <Route path="/governments" element={<Governments />} />
          <Route path='/buildings' element={<Buildings />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path='/customers' element={<Customers />} />
          <Route path='/rents' element={<Rents />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/rent/:roomId" element={<Rent />} />
          <Route path='/register' element={<Register onLogin={handleLogin} />} />
          <Route path='/login' element={<Login onLogin={handleLogin} />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/contract' element={<Contract />} />
          <Route path='/rent-choice' element={<RentChoice />} />
          <Route path='/create-room' element={<CreateRoomForGovernment />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
