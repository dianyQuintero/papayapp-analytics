import React from 'react';
import './App.css';
import Productos from './Components/products.js'
import Usuarios from './Components/users.js'

export default class App extends React.Component{
  
  render(){

    return(
      <div id="Container" className="container">
        <br></br>
        <h1 className="text-xs font-weight-bold text-uppercase mb-1">Papayapp Analytics</h1>
        <br></br>
        <Productos  ></Productos>    
        <br></br> 
        <Usuarios ></Usuarios>   
        <br></br>
      </div>
    );
  }
}

