import React from 'react';
import '../App.css';
import { db }  from '../firebase';
import CanvasJSReact from '../canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var products= [];
var grafica1 = [];
var grafica2 = [];
var grafMed = [];
var grafca = [];
var cantidades = [];
var grafCalPorcentaje= [];
var grafCal= [];
var grafPag=[];

export default class Productos extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          prestamos: [],
          productos: [],
          grafProd:[], 
          grafAtencion:[],
          medidas:["KG","Unidades","Gramos","Litros"],
          grafmedidas: [],
          cant: [],
          grafCant : [],
          calificaciones: [],
          grafCalificacionesPorcentaje: [],
          grafCalificaciones:[],
          grafPagos:[]
        };
      }

      componentDidMount(){
        db.collection("prestamos")
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          var atendidos = 0; 
          var pagados = 0; 
          var x = 0;
          data.forEach(d=>{
            x++;
            if(!products.includes(d.producto)){
              products.push(d.producto)
            }
            if(!cantidades.includes(parseInt(d.cantidad, 10))){
              cantidades.push(parseInt(d.cantidad, 10))
            }
            if(d.presta !== null ){
                atendidos++;
                if(d.calificacion !== null && d.calificacion !== undefined)
                {
                  grafCal.push({y:parseInt(d.calificacion,10)})}
                if(d.estado !== null && d.estado !== undefined){
                  pagados++;
                }
            }
          });
          var noAtendidos = data.length - atendidos;
          grafica2.push({y: ((noAtendidos*100)/data.length), label :"Pedidos sin atender"})
          grafica2.push({y: ((atendidos*100)/data.length), label :"Pedidos atendidos"})
          grafCalPorcentaje.push({y:(grafCal.length*100)/atendidos, label:"Pedidos calificados"})
          grafCalPorcentaje.push({y:((atendidos-grafCal.length)*100)/atendidos, label:"Pedidos sin calificar"})
          grafPag.push({y:(pagados*100)/atendidos, label:"Pedidos pagados"})
          grafPag.push({y:((atendidos-pagados)*100)/atendidos, label:"Pedidos sin pagar"})
          this.setState({
                prestamos:data,
                productos:products,      
                grafAtencion:grafica2,   
                cant:cantidades,
                grafCalificaciones: grafCal,
                grafCalificacionesPorcentaje: grafCalPorcentaje,  
                grafPagos: grafPag
              })
          if(this.state.productos.length !== 0 && this.state.prestamos.length !== 0 && this.state.cant !== 0){

            this.state.productos.forEach(e=>{
              var count = 0;
              this.state.prestamos.forEach(p=>{
                if(p.producto===e){
                  count++;
                }
              })
              grafica1.push({label:e, y: count, porcentaje: ((count)/(this.state.prestamos.length)*100).toFixed(2)})
              this.setState({
                grafProd: grafica1
              }) 
          })
          this.state.cant.sort();
          this.state.cant.forEach(e=>{
            var count = 0;
            this.state.prestamos.forEach(p=>{
              if(p.cantidad===e){
                count++;
              }
            })
            grafca.push({label:e, y: count, porcentaje: ((count)/(this.state.prestamos.length)*100)})
            this.setState({
              grafCant: grafca
            }) 
        })
          this.state.medidas.forEach(m=>{
            var count= 0;
            this.state.prestamos.forEach(p=>{
                if(p.medida === m){
                    count++;
                }
            })
            grafMed.push({label:m, y: (count*100/this.state.prestamos.length)})  
          }
          
        ) 
        this.setState({
          grafmedidas:grafMed
        })    
      }
        });

      }
      calificacionProm(){
        var suma=0;
        var prom=0;
          if(this.state.grafCalificaciones.length !==0){
              this.state.grafCalificaciones.forEach(e=>{
                  suma += e.y;
              })
              prom = suma/this.state.grafCalificaciones.length
          }
        return "El total de pedidos atendidos calificados es: "+ this.state.grafCalificaciones.length + " y la calificación promedio es: " +prom.toFixed(2);
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

      medidaMasPedida(){
        var max = 0;
        var indiceRta= 0;
        if(this.state.grafmedidas.length !==0){
          for (const key in this.state.grafmedidas) {
            var actual = this.state.grafmedidas[key]
            if (actual.y > max) {
              indiceRta = key;
              max=actual.y;
            }
          }
          return "La medida más común en los pedidos es "+ this.state.grafmedidas[indiceRta].label + " con un total de " +this.state.grafmedidas[indiceRta].y + "% de ocurrencia";
        }
      }

      cantidadMasPedida(){
        var max = 0;
        var indiceRta= 0;
        if(this.state.grafCant.length !==0){
          for (const key in this.state.grafCant) {
            var actual = this.state.grafCant[key]
            if (actual.y > max) {
              indiceRta = key;
              max=actual.y;
            }
          }
          return "La cantidad que más se pide en cualquier producto es "+ this.state.grafCant[indiceRta].label + " con un total de " +this.state.grafCant[indiceRta].y + " pedidos";
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
    const optionmedidas = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: "Medida más pedida"
			},
			data: [{
				type: "pie",
				indexLabel: "{label}: {y}%",		
                startAngle: -90,
                yValueFormatString: "####.00",
				dataPoints: this.state.grafmedidas
			}]
    }
    const optionscalificacionesporcentaje = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: "% Pedidos atendidos calificados"
			},
			data: [{
				type: "pie",
				indexLabel: "{label}: {y}%",		
                startAngle: -90,
                yValueFormatString: "####.00",
				dataPoints: this.state.grafCalificacionesPorcentaje
			}]
    }

    const optionsPagos = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: "% Pedidos pagados"
			},
			data: [{
				type: "pie",
				indexLabel: "{label}: {y}%",		
                startAngle: -90,
                yValueFormatString: "####.00",
				dataPoints: this.state.grafPagos
			}]
    }

    const optionsCant = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", //"light1", "dark1", "dark2"
			title:{
        text: "Cantidades solicitadas por pedido",
        fontSize: 25,
        fontColor: "black"
			},
			data: [{
				type: "spline", //change type to bar, line, area, pie, etc
				//indexLabel: "{y}", //Shows y value on all Data Points
				indexLabelFontColor: "#5A5757",
				indexLabelPlacement: "outside",
				dataPoints: this.state.grafCant
			}]
        }
        const optionsCal = {
          animationEnabled: true,
          exportEnabled: true,
          theme: "light2", //"light1", "dark1", "dark2"
          title:{
            text: "Calificaciones por pedido finalizado",
            fontSize: 20,
            fontColor: "black"
          },
            axisX:{
                labelFormatter: function(){
                  return " ";
                }
              },
          data: [{
            type: "spline", //change type to bar, line, area, pie, etc
            //indexLabel: "{y}", //Shows y value on all Data Points
            indexLabelFontColor: "#5A5757",
            indexLabelPlacement: "outside",
            dataPoints: this.state.grafCalificaciones
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
            <div className="row" >
                <div className="col-12">
                <div  id="Card1" className="card border-left-primary shadow h-100 py-2">
                        <div  className="card-body">
                          <div  className="row no-gutters align-items-center">
                            <div  className="col mr-2">
                              <div  id="titCard1" className="text-xs font-weight-bold text-uppercase mb-1">Calificaciones</div>
                              <div  className="card-body">
                                <div className="row">
                                  <div className="col-6">
                                  <CanvasJSChart options = {optionscalificacionesporcentaje}/>
                                  </div>
                                  <div className="col-6">
                                  <h5>{this.calificacionProm()}</h5>
                                  <br></br>
                                  <CanvasJSChart options = {optionsCal}/>
                                  </div>
                                </div>
                                </div>
                              </div>
                          </div>
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
                                  <div  id="titCard1" className="text-xs font-weight-bold text-uppercase mb-1">Pedidos pagados</div>
                                  <div  className="card-body">
                                    <CanvasJSChart options = {optionsPagos}/>
                                    </div>
                                </div>
                              </div>
                            </div>
                          </div>
                    </div>
                    </div>
            <br></br>
            <div className="row" >
            <div className="col-6">
            <div  className="card border-left-primary shadow h-100 py-2">
                    <div  className="card-body">
                      <div  className="row no-gutters align-items-center">
                        <div  className="col mr-2">
                          <div  id="titCard1" className="text-xs font-weight-bold text-uppercase mb-1">Medidas</div>
                            <div  className="h5 mb-0 font-weight-bold text-gray-800">{this.medidaMasPedida()}</div>
                            <br></br>
                            <div>
                            <CanvasJSChart options = {optionmedidas}/>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
            <div className="col-6">
                  <div  className="card border-left-primary shadow h-100 py-2">
                    <div  className="card-body">
                      <div  className="row no-gutters align-items-center">
                        <div  className="col mr-2">
                          <div  id="titCard1" className="text-xs font-weight-bold text-uppercase mb-1">Cantidades</div>
                            <div  className="h5 mb-0 font-weight-bold text-gray-800">{this.cantidadMasPedida()}</div>
                            <br></br>
                            <div>
                            <CanvasJSChart options = {optionsCant}/>
                            </div>
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
