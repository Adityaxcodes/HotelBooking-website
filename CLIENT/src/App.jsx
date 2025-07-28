import React from 'react';
import Navbar from './components/Navbar.jsx';
import { useLocation, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AllRooms from './pages/AllRooms.jsx';
import RoomDetails from './components/RoomDetails.jsx';
import Footer from './components/Footer.jsx';
import MyBookings from './pages/MyBookings.jsx';
import HotelReg from './components/HotelReg.jsx'
import Layout from './pages/hotelOwner/Layout.jsx';
import Dashboard from './pages/hotelOwner/Dashboard.jsx';
import AddRoom from './pages/hotelOwner/AddRoom.jsx';
import Listroom from './pages/hotelOwner/Listroom.jsx';

const App = () => {
  const isOwnerPath = useLocation().pathname.toLowerCase().includes("owner");

  return (
    <div>
      {false && <HotelReg/>}
      {!isOwnerPath && <Navbar />}
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/rooms' element={<AllRooms/>}/>
    <Route path='/rooms/:id' element={<RoomDetails/>} />
    <Route path='/mybookings' element={<MyBookings/>} />
    <Route path='/owner' element={<Layout/>}>
      <Route index element={<Dashboard/>}/>
      <Route path='add-room' element={<AddRoom/>}/>
      <Route path='list-room' element={<Listroom/>}/>
    </Route>
  </Routes>
      {!isOwnerPath && <Footer />}
    </div>
  );
}

export default App;