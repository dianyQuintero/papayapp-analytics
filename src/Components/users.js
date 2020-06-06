import React from 'react';
import '../App.css';
import { db }  from '../firebase';
import CanvasJSReact from '../canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var grafica1 =[];
var grafica2 =[];
var grafica3 =[];
var locales =[];
var tabla =[];
var tabla2 =[];


export default class Usuarios extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          prestamos: [],
          usuarios: [],
          stands: [],
          grafPide:[],
          grafPresta:[],
          grafTot:[],
          table:[],
          table2:[],

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
                
                if(!locales.includes(u.data().local)){
                    locales.push(u.data().local)
                }

                this.state.prestamos.forEach(p=>{
                  if(u.id===p.recibe.id){
                    countPide++;
                  }
                  if(p.presta !== null && u.id===p.presta.id) {
                    countPresta++;}
                })
                grafica1.push({label: u.data().email, y: countPide})
                grafica2.push({label: u.data().email, y: countPresta})
                grafica3.push({label: u.data().email, y: countPide+countPresta})

              })
                         
                this.setState({
                    grafPide : grafica1,
                    grafPresta : grafica2,
                    grafTot: grafica3,
                    stands : locales,
                  })
                  if(this.state.stands.length !== 0){
                    this.state.stands.forEach(e=>{
                    db.collection("usuarios").where("local","==", ""+e).
                    get().then(querySnapshot => {
                      const data = querySnapshot.docs.map(doc => doc.data());
                      tabla.push({NumeroLocal:e, usuarios: data.length})
                      this.setState({
                        table: tabla
                      }) 
                    }
                  );
                  })
                  
                  this.state.stands.forEach(local=>{
                    var count= 0;
                    this.state.usuarios.forEach(u=>{
                        if(u.data().local === local){
                            this.state.prestamos.forEach(p=>{
                                if(u.id === p.recibe.id){
                                    count++;
                                }
                            })
                        }
                    })
                    tabla2.push({label:local, y: count})  
                  }
                )
                this.setState({
                    table2: tabla2
                  })
                  
                  } 

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
          return "El usuario que más pide es "+ this.state.grafPide[indiceRta].label+ " con un total de " +this.state.grafPide[indiceRta].y + " pedidos";
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
      localMasPide(){
        var max = 0;
        var indiceRta= 0;
        if(this.state.table2.length !==0){
          for (const key in this.state.table2) {
            var actual = this.state.table2[key]
            if (actual.y > max) {
              indiceRta = key;
              max=actual.y;
            }
          }
          return "El local en el que se realizan más pedidos es el número "+ this.state.table2[indiceRta].label + " con un total de " +this.state.table2[indiceRta].y + " pedidos";
        }
      }

      localMenosPide(){
        var min = Number.MAX_SAFE_INTEGER;
        var indiceRta= 0;
        if(this.state.table2.length !==0){
          for (const key in this.state.table2) {
            var actual = this.state.table2[key]
            if (actual.y < min) {
              indiceRta = key;
              min=actual.y;
            }
          }
          return "El local en el que se realizan menos pedidos es el número "+ this.state.table2[indiceRta].label + " con un total de " +this.state.table2[indiceRta].y + " pedidos";
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
      prom(cat){
          var suma=0;
          var prom=0;
          if(cat === 1){
            if(this.state.table.length !==0){
                this.state.table.forEach(e=>{
                    suma += e.usuarios;
                })
                prom = suma/this.state.table.length
            }
            return "El número de usuarios promedio por local es: " +prom.toFixed(2);
          }
          else{
            if(this.state.table2.length !==0){
                this.state.table2.forEach(e=>{
                    suma += e.y;
                })
                prom = suma/this.state.table2.length
            }
            return "El número de pedidos promedio por local es: " +prom.toFixed(2);
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

      masActivo(){
            var max = 0;
            var indiceRta= 0;
            if(this.state.grafTot.length !==0){
              for (const key in this.state.grafTot) {
                var actual = this.state.grafTot[key]
                if (actual.y > max) {
                  indiceRta = key;
                  max=actual.y;
                }
              }
              return "El usuario más activo de la aplicación es "+ this.state.grafTot[indiceRta].label+ " con un total de " +this.state.grafTot[indiceRta].y + " pedidos (realizados y aceptados)";
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
                markerSize: 15,
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
                markerSize: 15,
				indexLabelFontColor: "#5A5757",
				indexLabelPlacement: "outside",
				dataPoints: this.state.grafPresta
			}]
        }
        const optionsGraphActivo = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", //"light1", "dark1", "dark2"
			title:{
        text: "Solicitudes Totales por usuario",
        fontSize: 25,
        fontColor: "black"
            },
            axisX:{
                labelFormatter: function(){
                  return " ";
                }
              },
			data: [{
				type: "column", //change type to bar, line, area, pie, etc
				//indexLabel: "{y}", //Shows y value on all Data Points
				indexLabelFontColor: "#5A5757",
				indexLabelPlacement: "outside",
				dataPoints: this.state.grafTot
			}]
        }

        const optionsPedidosLocales = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", //"light1", "dark1", "dark2"
			title:{
        text: "Número de Pedidos por Local",
        fontSize: 25,
        fontColor: "black"
            },
            axisX:{
                labelFormatter: function(){
                  return " ";
                }
              },
			data: [{
				type: "column", //change type to bar, line, area, pie, etc
				//indexLabel: "{y}", //Shows y value on all Data Points
				indexLabelFontColor: "#5A5757",
				indexLabelPlacement: "outside",
				dataPoints: this.state.table2
			}]
        }
        const optionslocales = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: "% de Locales que usan la app"
			},
			data: [{
				type: "doughnut",
				showInLegend: true,
				indexLabel: "{label}: {y}%",		
                startAngle: -90,
                yValueFormatString: "####.00",
				dataPoints:[
                    { name: "Locales que usan la app", y: (this.state.stands.length*100)/450 },
					{ name: "Locales que no usan la app", y: ((450 - this.state.stands.length)*100)/450 }
                ]
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
              <br></br>
                <div className="row" >
                    <div className="col-12">
                    <div  id="Card1" className="card border-left-primary shadow h-100 py-2">
                            <div  className="card-body">
                            <div  className="row no-gutters align-items-center">
                                <div  className="col mr-2">
                                <div  id="titCard1" className="text-xs font-weight-bold text-uppercase mb-1">Usuario más activo</div>
                                <div  className="card-body">
                                    <CanvasJSChart options = {optionsGraphActivo}/>
                                    </div>
                                    <h5>{this.masActivo()}</h5>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    </div>
              <br></br>
              <div className="row">
                  <div className ="col-6">
                    <div  className="card shadow mb-4">
                    <div  className="card-body">
                    <div  className="row no-gutters align-items-center">
                        <div  className="col mr-2">
                          <div  id="titCard1" className="text-xs font-weight-bold text-uppercase mb-1">Usuarios promedio por local</div>
                          <br></br>
                          <table className="table table-hover">
                          <thead>
                                <tr>
                                <th scope="col">Número del local</th>
                                <th scope="col">Usuarios que tienen la app</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.table.map(e =>{
                                return(
                                    <tr>
                                        <td>{e.NumeroLocal}</td>
                                        <td>{e.usuarios}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                          </table>
                        <h5>{this.prom(1)}</h5>

                    </div>
                    </div>
                    </div>
                </div>
                  </div>
                  <div className ="col-6">
                    <div  className="card shadow mb-4">
                    <div  className="card-body">
                    <div  className="row no-gutters align-items-center">
                        <div  className="col mr-2">
                          <div  id="titCard1" className="text-xs font-weight-bold text-uppercase mb-1">Pedidos promedio por Local</div>
                          <br></br>
                          <table className="table table-hover">
                          <thead>
                                <tr>
                                <th scope="col">Número del local</th>
                                <th scope="col">Número de pedidos</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.table2.map(e =>{
                                return(
                                    <tr>
                                        <td>{e.label}</td>
                                        <td>{e.y}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                          </table>
                        <h5>{this.prom(2)}</h5>

                    </div>
                    </div>
                    </div>
                </div>
                  </div>
              </div>
              <br></br>
              <div className="row" >
            <div className="col-6">
            <div  id="Card2" className="card border-left-primary shadow h-100 py-2">
                    <div  className="card-body">
                      <div  className="row no-gutters align-items-center">
                        <div  className="col mr-2">
                          <div  id="titCard2" className="text-xs font-weight-bold text-uppercase mb-1">Local con más pedidos</div>
                            <div  className="h5 mb-0 font-weight-bold text-gray-800">{this.localMasPide()}</div>
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
                          <div  id="titCard3" className="text-xs font-weight-bold text-uppercase mb-1">Local con menos pedidos</div>
                            <div  className="h5 mb-0 font-weight-bold text-gray-800">{this.localMenosPide()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
            </div>
            <br></br>
            <div  className="card shadow mb-4">
                <div  className="card-body">
                <CanvasJSChart options = {optionsPedidosLocales}/>
                </div>
              </div>
              <br></br>
                <div className="row" >
                    <div className="col-12">
                    <div  id="Card1" className="card border-left-primary shadow h-100 py-2">
                            <div  className="card-body">
                            <div  className="row no-gutters align-items-center">
                                <div  className="col mr-2">
                                <div  id="titCard1" className="text-xs font-weight-bold text-uppercase mb-1">Uso de la app en toda la plaza</div>
                                <div  className="card-body">
                                    <CanvasJSChart options = {optionslocales}/>
                                    </div>
                                    <h5>Teniendo en cuenta que la plaza cuenta con 450 locales de frutas y verduras.</h5>
                                    <h5>Locales que usan la app: {this.state.stands.length}</h5>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    </div>
            </div>
          )
      }
}

