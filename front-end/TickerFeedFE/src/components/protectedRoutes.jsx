import React from "react"
import { useState, useEffect } from "react"
import {Navigate} from "react-router-dom"

const BackendURL = process.env.REACT_APP_BackendURL;
const protectedRoutes =({element, ...rest})=>{
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading]= useState(true)

    useEffect(()=>{
        const checkAuth= async ()=>{
            try{
                console.log("making auth request")
                const response = await fetch(`${BackendURL}/api/auth/check`, {
                  method: "GET",
                  credentials: "include",
                });

                if(response.ok){
                     console.log("Auth request  good");
                    setIsAuthenticated(true)
                }else{
                    setIsAuthenticated(false)
                }
            }catch(err){
                console.error('Error has occurred', err)
                setIsAuthenticated(false)
            }finally{
                setIsLoading(false)
            }
        };
        checkAuth();
    },[])


    if(isLoading){
        return <div>Loading....</div>
    }

 return isAuthenticated ? element : <Navigate to="/login" replace />;
        
     
}

export default protectedRoutes;