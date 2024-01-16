import React from 'react'
import axios from 'axios'
export default function AuthUser(){
    const http = axios.create({
       baseURL: "http://localhost:8000/api",
       header:{
        "Content-type": "application/json"
       }
    });
    return{
        http
    }
}
