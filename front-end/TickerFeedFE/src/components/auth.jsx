import React from 'react'
import "../index.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from "../components/nav"
import PropTypes from "prop-types";
const BackendURL = process.env.REACT_APP_BackendURL;




const handleSignIn = async (formInputs, navigate)=>{
    try{
      const response = await fetch(`${BackendURL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formInputs),
      });
      
      if(response.ok){
        const result =await response.json()
        navigate("/home")
      }else{
        const errorText = await response.text(); 
        console.log("Error:", errorText);
      }
    }catch(err){
      console.log("Network error", err)
    }
  }

const handleSignUp=async(formInputs,navigate)=>{
  
  console.log("sending data:", formInputs)
    try{
      console.log("sending signup")
      const response = await fetch(
        `${BackendURL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formInputs),
        }
      );
      
      if(response.ok){
        const result =await response.json()
        navigate("/signin");
      }else{
        const errorText = await response.text();
        console.log("Error:", errorText)
      }
    }catch(err){
      console.log("Network error", err)
    }
}

function auth({type}) {
  const navigate = useNavigate();
const [formData, setFormData] = useState({
  firstname: "",
  lastname: "",
  email: "",
  password: "",
});


const handleChange=(e)=>{
  const {name, value}= e.target
  setFormData((prevData )=>({
    ...prevData,
    [name]:value
  }));
};


const handleSubmit= async (e)=>{
   e.preventDefault(); 


  
  if(type==='signin'){
     const { email, password} = formData;
  if (!email || !password) {
    alert("Please fill in all required fields.");
    return;
  }
   await  handleSignIn({email, password }, navigate);
 
  }
else if(type === 'signup'){
    const { email, password, firstname, lastname } = formData;
if (
  !email ||
  !password ||
  !firstname ||
  !lastname
) {
  alert("Please fill in all required fields.");
  return;
}
  await handleSignUp({firstname, lastname, email, password}, navigate)
}
setFormData({firstname:"",lastname:"", email:"", password:""})

  //once form is created switch this to post req to backend

}

  return (
    <>
      <Nav />

      <div className="form-container">
        <h2 className="form-title">
          {type === "signin" ? "Sign In" : "Sign up"}
        </h2>
        <form onSubmit={handleSubmit}>
          {type === "signup" && (
            <>
              <div className="form-group">
                <label htmlFor="firstname" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastname" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="form-submit">
            {type === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </>
  );
}
auth.propTypes = {
  type: PropTypes.oneOf(["signin", "signup"]).isRequired,
};
export default auth