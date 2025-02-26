import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./authform/login";
import Signup from "./authform/Signup";
import QuizForm from "./pages/quizform.jsx";
import GoogleFormView from "./pages/GoogleFormView.jsx";
import ViewResponse from "./pages/ViewResponse.jsx";
import Home from "./pages/home.jsx";
import PrivateRoute from "./authform/PrivateRoute.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/quizform" element={
          <PrivateRoute>
            <QuizForm/>
          </PrivateRoute>
      } />
        <Route path="/viewform/:id" element={
                <PrivateRoute>
                   <GoogleFormView/>
              </PrivateRoute>
      
          }/>
        <Route path="/submitedform/:id" element={
              <PrivateRoute>
             <ViewResponse/>
             </PrivateRoute>

          }/>
          <Route path = "/googleform" element ={
               <PrivateRoute>
             <QuizForm/>
               </PrivateRoute>
         
            }/>
          <Route path = "/home" element ={<Home/>}/>
          <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
