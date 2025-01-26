import { useState } from 'react'
import './App.css'
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn";
import HomePage from "./pages/homePage"
import ProtectedRoute from "./components/protectedRoutes";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
function App() {
  //{<ProtectedRoute element={<HomePage/>}

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route
          path="/home"
           element={<ProtectedRoute element={<HomePage/>}/>}
        />
      </Routes>
    </Router>
  );
}

export default App
