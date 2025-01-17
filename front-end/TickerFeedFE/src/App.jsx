import { useState } from 'react'
import './App.css'
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn";
import {BrowserRouter, Routes, Route} from "react-router-dom"
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
