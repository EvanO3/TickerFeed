import { useState } from 'react'
import './App.css'
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn";
import HomePage from "./pages/homePage"
import {BrowserRouter, Routes, Route} from "react-router-dom"
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Signin" element={<SignIn />} />
        <Route path="/home" element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
