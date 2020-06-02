import React from 'react';
import '../App.css';
import { db }  from '../firebase';
import CanvasJSReact from '../canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var grafica1 =[];
var grafica2 =[];


export default class Usuarios extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          prestamos: [],
          usuarios: [],
          grafPide:[],
          grafPresta:[],

        };
      }
      componentDidMount(){
        
      db.collection("prestamos")
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
            this.setState({
              prestamos:data,
            })  
        db.collection("usuarios")
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc);
          this.setState({ usuarios: data });
          if(this.state.usuarios.length!==0 && this.state.prestamos.length!==0)
            {
              this.state.usuarios.forEach(u=>{
                var countPide = 0;
                var countPresta = 0;
                
                this.state.prestamos.forEach(p=>{
                  if(u.id===p.recibe.id){
                    countPide++;
                  }
                  if(p.presta !== null && u.id===p.presta.id) {
                    countPresta++;}
                })
                grafica1.push({label: u.data().email, y: countPide})
                grafica2.push({label: u.data().email, y: countPresta})

              })                
                this.setState({
                    grafPide : grafica1,
                    grafPresta : grafica2,
                  })
            } 
        }); 
        });
      }
      masPide(){
        var max = 0;
        var indiceRta= 0;
        if(this.state.grafPide.length !==0){
          for (const key in this.state.grafPide) {
            var actual = this.state.grafPide[key]
            if (actual.y > max) {
              indiceRta = key;
              max=actual.y;
            }
          }
          return "El label que más pide es "+ this.state.grafPide[indiceRta].label+ " con un total de " +this.state.grafPide[indiceRta].y + " pedidos";
        }
      }

      masPresta(){
        var max = 0;
        var indiceRta= 0;
        if(this.state.grafPresta.length !==0){
          for (const key in this.state.grafPresta) {
            var actual = this.state.grafPresta[key]
            if (actual.y > max) {
              indiceRta = key;
              max=actual.y;
            }
          }
          return "El usuario que más presta es "+ this.state.grafPide[indiceRta].label + " con un total de " +this.state.grafPresta[indiceRta].y + " pedidos";
        }
      }
    
      menosPide(){
        var min = Number.MAX_SAFE_INTEGER;
        var indiceRta= 0;
        if(this.state.grafPide.length !==0){
          for (const key in this.state.grafPide) {
            var actual = this.state.grafPide[key]
            if (actual.y < min) {
              indiceRta = key;
              min=actual.y;
            }
          }
          return "El usuario que menos pide es "+ this.state.grafPide[indiceRta].label + " con un total de " +this.state.grafPide[indiceRta].y + " pedidos";
        }
      }

      menosPresta(){
        var min = Number.MAX_SAFE_INTEGER;
        var indiceRta= 0;
        if(this.state.grafPresta.length !==0){
          for (const key in this.state.grafPresta) {
            var actual = this.state.grafPresta[key]
            if (actual.y < min) {
              indiceRta = key;
              min=actual.y;
            }
          }
          return "El usuario que menos presta es "+ this.state.grafPresta[indiceRta].label + " con un total de " +this.state.grafPresta[indiceRta].y + " pedidos";
        }
      }

      render(){
        const optionsGraphPide = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", //"light1", "dark1", "dark2"
			title:{
        text: "Solicitudes Realizadas por usuario",
        fontSize: 25,
        fontColor: "black"
            },
            axisX:{
                labelFormatter: function(){
                  return " ";
                }
              },
			data: [{
				type: "scatter", //change type to bar, line, area, pie, etc
				//indexLabel: "{y}", //Shows y value on all Data Points
				indexLabelFontColor: "#5A5757",
				indexLabelPlacement: "outside",
				dataPoints: this.state.grafPide
			}]
        }

        const optionsGraphPresta = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", //"light1", "dark1", "dark2"
			title:{
        text: "Solicitudes Aceptadas por usuario",
        fontSize: 25,
        fontColor: "black"
            },
            axisX:{
                labelFormatter: function(){
                  return " ";
                }
              },
			data: [{
				type: "scatter", //change type to bar, line, area, pie, etc
				//indexLabel: "{y}", //Shows y value on all Data Points
				indexLabelFontColor: "#5A5757",
				indexLabelPlacement: "outside",
				dataPoints: this.state.grafPresta
			}]
        }
          return(
            <div className="container">
            <div className="row" >
            <div className="col-6">
            <div  id="Card2" className="card border-left-primary shadow h-100 py-2">
                    <div  className="card-body">
                      <div  className="row no-gutters align-items-center">
                        <div  className="col mr-2">
                          <div  id="titCard2" className="text-xs font-weight-bold text-uppercase mb-1">Usuario que más pide</div>
                            <div  className="h5 mb-0 font-weight-bold text-gray-800">{this.masPide()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
            <div className="col-6">
                  <div  id="Card3" className="card border-left-primary shadow h-100 py-2">
                    <div  className="card-body">
                      <div  className="row no-gutters align-items-center">
                        <div  className="col mr-2">
                          <div  id="titCard3" className="text-xs font-weight-bold text-uppercase mb-1">Usuario que menos pide</div>
                            <div  className="h5 mb-0 font-weight-bold text-gray-800">{this.menosPide()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
            </div>
            <br></br>
            <div  className="card shadow mb-4">
                <div  className="card-body">
                <CanvasJSChart options = {optionsGraphPide}/>
                </div>
              </div>
            <div className="row" >
            <div className="col-6">
            <div  id="Card2" className="card border-left-primary shadow h-100 py-2">
                    <div  className="card-body">
                      <div  className="row no-gutters align-items-center">
                        <div  className="col mr-2">
                          <div  id="titCard2" className="text-xs font-weight-bold text-uppercase mb-1">Usuario que más presta</div>
                            <div  className="h5 mb-0 font-weight-bold text-gray-800">{this.masPresta()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
            <div className="col-6">
                  <div  id="Card3" className="card border-left-primary shadow h-100 py-2">
                    <div  className="card-body">
                      <div  className="row no-gutters align-items-center">
                        <div  className="col mr-2">
                          <div  id="titCard3" className="text-xs font-weight-bold text-uppercase mb-1">Usuario que menos presta</div>
                            <div  className="h5 mb-0 font-weight-bold text-gray-800">{this.menosPresta()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
            </div>
            <br></br>
            <div  className="card shadow mb-4">
                <div  className="card-body">
                <CanvasJSChart options = {optionsGraphPresta}/>
                </div>
              </div>
            </div>
          )
      }
}

