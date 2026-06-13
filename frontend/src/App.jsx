import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Base URL Redirect: Automatically slides users to the Login gates */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 2. Authentication Channels */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* 3. Secure Medical Chat Dashboard Portal */}
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;