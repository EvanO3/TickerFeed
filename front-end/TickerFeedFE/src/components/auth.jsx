import React from 'react'
import "../index.css"
import { useState } from 'react';
import Nav from "../components/nav"
function auth({FormType}) {
const [email, setEmail]= useState('')
  return (
    <div className=" bg-slate-400">
      <Nav />
      <div className="h-screen flex items-center justify-center bg-gray-200">
        <form
          action=""
          className="bg-white p-9 rounded-lg shadow-md space-y-6 w-full max-w-sm"
        >
          <h2 className="font-serif text-2xl font-bold text-gray-800 text-center">
            Sign Up
          </h2>
          <div className="form-control">
            <label htmlFor="" className=" font-serif block text-gray-600">
              {" "}
              First Name
            </label>
            <input
              type="text"
              placeholder="Please Enter your first name"
              className="input input-bordered w-full p-2  border border-gray-500 rounded-lg  bg-slate-100"
            />
          </div>

          <div className="form-control">
            <label htmlFor="" className=" font-serif block text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Please Enter your last name"
              className="input input-bordered w-full p-2  border border-gray-300 rounded-lg  bg-slate-100"
            />
          </div>

          <div className="form-control">
            <label htmlFor="" className=" font-serif block text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Please Enter your email"
              className="input input-bordered w-full p-2  border border-gray-300 rounded-lg  bg-slate-100"
            />
          </div>

          <div className="form-control">
            <label htmlFor="" className=" font-serif block text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Please Enter a password"
              className="input input-bordered w-full p-2  border border-gray-300 rounded-lg bg-slate-100"
            />
          </div>

          <button
            type="submit"
            className=" font-serif w-full  bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-slate-600"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default auth