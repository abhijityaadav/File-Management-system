import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import individual components
import FileUpload from './Components/FileUpload';
import FileList from './Components/FileList';
import FileDownload from './Components/FileDownload';
import FileDelete from './Components/FileDelete';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              File Management System
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/upload" className="nav-link">Upload File</Link>
              </li>
              <li className="nav-item">
                <Link to="/list" className="nav-link">List Files</Link>
              </li>
              <li className="nav-item">
                <Link to="/download" className="nav-link">Download File</Link>
              </li>
              <li className="nav-item">
                <Link to="/delete" className="nav-link">Delete File</Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/list" element={<FileList />} />
          <Route path="/download" element={<FileDownload />} />
          <Route path="/delete" element={<FileDelete />} />
          <Route 
            path="/" 
            element={
              <div className="home-container">
                <h1>Welcome to File Management System</h1>
                <p>Choose an option from the navigation menu</p>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;