import React from 'react';
import { db }  from './firebase';
import './App.css';
import CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var products= [];
var grafica1 = [];
var grafica2 =[];


export default class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      prestamos: [],
      usuarios: [],
      productos: [],
      grafProd:[],
      grafUsers:[]
      
    };
  }
  componentDidMount() {
    db.collection("usuarios")
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc);
        this.setState({ usuarios: data });
      });
    db.collection("prestamos")
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        data.forEach(d=>{
          if(!products.includes(d.producto)){
            products.push(d.producto)
          }
          this.setState({
            prestamos:data,
            productos:products
          })
        });
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
        if(this.state.usuarios.length!==0 && this.state.prestamos.length!==0)
          {
            this.state.usuarios.forEach(u=>{
              var count = 0;
              this.state.prestamos.forEach(p=>{
                if(u.id===p.recibe.id){
                  count++;
                }
              })
              grafica2.push({usuario: u, y: count})
              console.log("EL USUARIO "+ u.data().email+ "HIZO "+ count +"PEDIDOS")
              this.setState({
                grafUsers : grafica2
              })
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

  masPide(){
    var max = 0;
    var indiceRta= 0;
    if(this.state.grafUsers.length !==0){
      for (const key in this.state.grafUsers) {
        var actual = this.state.grafUsers[key]
        if (actual.y > max) {
          indiceRta = key;
          max=actual.y;
        }
      }
      return "El usuario que más pide es "+ this.state.grafUsers[indiceRta].usuario.data().email + " con un total de " +this.state.grafUsers[indiceRta].y + " pedidos";
    }
  }

  menosPide(){
    var min = Number.MAX_SAFE_INTEGER;
    var indiceRta= 0;
    if(this.state.grafUsers.length !==0){
      for (const key in this.state.grafUsers) {
        var actual = this.state.grafUsers[key]
        if (actual.y < min) {
          indiceRta = key;
          min=actual.y;
        }
      }
      return "El usuario que menos pide es "+ this.state.grafUsers[indiceRta].usuario.data().email + " con un total de " +this.state.grafUsers[indiceRta].y + " pedidos";
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
		

    return(
      <div id="Container" className="container">
        <br></br>
        <h1 className="text-xs font-weight-bold text-uppercase mb-1">Papayapp Analytics</h1>
        <br></br>
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
                <CanvasJSChart options = {optionsGraph1} 
				/* onRef={ref => this.chart = ref} */
			/>
                </div>
              </div>
          </div>
          <div className="col-6">
          <div  className="card shadow mb-4">
                <div  className="card-body">
                  <h4 className="text" >Porcentaje de pedidos por producto</h4>
                  <br></br>
                  {this.state.grafProd.map(function(e){
                    return <div>
                      <h4  className="small font-weight-bold">{e.label} <span  className="float-right">{e.porcentaje}%</span></h4>
                      <div  className="progress mb-4">
                      <div  className="progress-bar" role="progressbar" style={{width: e.porcentaje +'%' }} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                    </div>;
                  })}
                </div>
              </div>
          </div>
        </div>
        <div className="row" >
        <div className="col-6">
        <div  id="Card2" className="card border-left-primary shadow h-100 py-2">
                <div  className="card-body">
                  <div  className="row no-gutters align-items-center">
                    <div  className="col mr-2">
                      <div  id="titCard2" className="text-xs font-weight-bold text-uppercase mb-1">Usuario que más pide</div>
                        <div  className="h5 mb-0 font-weight-bold text-gray-800">{this.masPide()}</div>
                    </div>
                    <div  className="col-auto">
                      <i  className="fas fa-calendar fa-2x text-gray-300"></i>
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
                    <div  className="col-auto">
                      <i  className="fas fa-calendar fa-2x text-gray-300"></i>
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

