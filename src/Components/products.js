import React from 'react';
import '../App.css';
import { db }  from '../firebase';
import CanvasJSReact from '../canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var products= [];
var grafica1 = [];
var grafica2 = [];


export default class Productos extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          prestamos: [],
          productos: [],
          grafProd:[], 
          grafAtencion:[]
         
        };
      }

      componentDidMount(){
        db.collection("prestamos")
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          var atendidos = 0; 
          data.forEach(d=>{
            if(!products.includes(d.producto)){
              products.push(d.producto)
            }
            if(d.presta !== null ){
                atendidos++;
            }
            

          });
          var noAtendidos = data.length - atendidos;
          grafica2.push({y: ((noAtendidos*100)/data.length), label :"Pedidos sin atender"})
          grafica2.push({y: ((atendidos*100)/data.length), label :"Pedidos atendidos"})
          this.setState({
                prestamos:data,
                productos:products,      
                grafAtencion:grafica2,      
              })
          if(this.state.productos.length !== 0){
            this.state.productos.forEach(e=>{
            db.collection("prestamos").where("producto","==", ""+e).
            get().then(querySnapshot => {
              const data = querySnapshot.docs.map(doc => doc.data());
              grafica1.push({label:e, y: data.length, porcentaje: ((data.length)/(this.state.prestamos.length)*100)})
              this.setState({
                grafProd: grafica1
              }) 
            }
          );
          })     
          }
        });

      }

      masPrestado(){
        var max = 0;
        var indiceRta= 0;
        if(this.state.grafProd.length !==0){
          for (const key in this.state.grafProd) {
            var actual = this.state.grafProd[key]
            if (actual.y > max) {
              indiceRta = key;
              max=actual.y;
            }
          }
          return "El producto que más piden es "+ this.state.grafProd[indiceRta].label + " con un total de " +this.state.grafProd[indiceRta].y + " pedidos";
        }
      }


      render(){
        const optionsGraph1 = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", //"light1", "dark1", "dark2"
			title:{
        text: "Número de pedidos por producto",
        fontSize: 25,
        fontColor: "black"
			},
			data: [{
				type: "column", //change type to bar, line, area, pie, etc
				//indexLabel: "{y}", //Shows y value on all Data Points
				indexLabelFontColor: "#5A5757",
				indexLabelPlacement: "outside",
				dataPoints: this.state.grafProd
			}]
        }
        const optionsAtencion = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: "% Pedidos sin Atender"
			},
			data: [{
				type: "pie",
				indexLabel: "{label}: {y}%",		
                startAngle: -90,
                yValueFormatString: "####.00",
				dataPoints: this.state.grafAtencion
			}]
		}
        return(
            <div className="container">
            <div className="row">
          <div className="col-12">
          <div  id="Card1" className="card border-left-primary shadow h-100 py-2">
                <div  className="card-body">
                  <div  className="row no-gutters align-items-center">
                    <div  className="col mr-2">
                      <div  id="titCard1" className="text-xs font-weight-bold text-uppercase mb-1">Producto más pedido</div>
                      <br></br>
                      <div  className="h5 mb-0 font-weight-bold text-gray-800">{this.masPrestado()}</div>
                    </div>
                    <div  className="col-auto">
                      <i  className="fas fa-calendar fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
        <br></br>
        </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-6">
          <div  className="card shadow mb-4">
                <div  className="card-body">
                <CanvasJSChart options = {optionsGraph1}/>
                </div>
              </div>
          </div>
          <div className="col-6">
          <div  className="card shadow mb-4">
                <div  className="card-body">
                  <h4 className="text" >Porcentaje de pedidos por producto</h4>
                  <br></br>
                  {this.state.grafProd.map(function(e){
                    return(<div>
                        <h4  className="small font-weight-bold">{e.label} <span  className="float-right">{e.porcentaje}%</span></h4>
                        <div  className="progress mb-4">
                        <div  className="progress-bar" role="progressbar" style={{width: e.porcentaje +'%' }} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                      </div>);
                  })}
                </div>
              </div>
          </div>
        </div>
        <br></br>
        <div className="row" >
            <div className="col-12">
            <div  id="Card1" className="card border-left-primary shadow h-100 py-2">
                    <div  className="card-body">
                      <div  className="row no-gutters align-items-center">
                        <div  className="col mr-2">
                          <div  id="titCard1" className="text-xs font-weight-bold text-uppercase mb-1">Pedidos sin responder</div>
                          <div  className="card-body">
                            <CanvasJSChart options = {optionsAtencion}/>
                            </div>
                            <h5>Total Pedidos: {this.state.prestamos.length}</h5>
                            
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
            </div>
            <br></br>
        </div>
        );
      }
}
