import React, { Component } from 'react';
import './App.css';
//import Button from './Person/Person';
import Button2 from './Button/Button';
import Modal from './Modal/Modal';
import Amount from './PickingAmount/PickingAmount';
import Chart from './Chart/Chart';
import Spec from './EduA/Opt-challenge.js';
import Wst from './Visualization/Visualization';
import Wst_buttons from './Buttons/ButtonSpec';

let edua = window.edua;
let spec = Spec.split('\n');
let scen = edua.parse(spec);
let sim = edua.newSim(scen);
let info = edua.info(sim);
let result = false;
let setIntervalId;
//console.log(info);
console.log( edua.allActions(sim));
//console.log(edua);
let dt = new Date(2019, 6, 0, 0, 0);

//console.log(Wst_buttons[0][0]);

/*
const wst_buttons = [
  ['Buy product', 'Sell product','Setup'],
  ['Buy product','Setup'],
  ['Setup'],
  ['Sell product','Setup'],
  ['Sell product','Setup']
]
*/



class App extends Component {

  state = {
    startButton: 'Start',
    startButtonState: false,
    nameOfClass: 'start',
    sliderValue: 1,
    week: 0,
    day:dt.getDay(),
    time:'0:00',
    money: info.assets[0].value ,
    purchasing: false,
    chartVisibility: false,
    identifier: "Chart",
    showMenu: false,
    resources: [0,0,0,0,0],
    workstation_id:'1',
    resOnWorkstation_1:0,
    resOnWorkstation_2:0,
  }


  gameTime = () => {
      sim = edua.tick(sim);//Every minute of simulation
      info = edua.info(sim);
      this.startOperation(1);
      this.startOperation(2);
      this.startOperation(3);
      this.startOperation(4);
      this.startOperation(5);
      dt.setMinutes(dt.getMinutes()+1);
      if(dt.getHours()<8)//End of day
        this.setState({time:dt.getHours() +':'+ (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())});
      else
      {
        dt.setDate(dt.getDate()+1)
        this.setState({day:dt.getDay()});
        if(dt.getDay() === 5)//End of week
        {
          this.setState({week:this.state.week+1});
          dt.setDate(0)
          this.setState({day:dt.getDay()});
          
        }
        dt.setHours(0);
        dt.setMinutes(0);
      }
  }

  raport = () => {
    console.log('End of the week');
  }

  getInfo = () => {
    //console.log(info.buffers[2].products);
    //console.log(edua.allActions(sim));
    console.log(info);  
  }
  
  getingOtherValues = () => {
    //let actions = edua.readyActions(sim);
    console.log(edua.workstationInfo(sim,1).modes[0].operations[0].results[0].id);
    //console.log(actions);
    
    /*[result, sim] = edua.execAction(sim, 6);
    console.log(result);
    info = edua.info(sim);*/

  }


  sliderValueHandler = (e) => {
    this.setState({sliderValue: e.target.value}, () => this.gameTimeRun());
  }

  gameTimeRun = () => {
    if(this.state.startButtonState)
    {
      clearInterval(setIntervalId);
      setIntervalId = setInterval(() => this.gameTime(), Math.floor(100/this.state.sliderValue));
    }
  }

  switchValueHandler = () => {
    if(!this.state.startButtonState)
    {
  	  this.setState(state => ({
        startButtonState: true,
        startButton: "Stop",
        nameOfClass: "stop",
      }),() => this.gameTimeRun());
    }
    else
    {
      clearInterval(setIntervalId);
      this.setState(state => ({
        startButtonState: false,
        startButton: "Start",
        nameOfClass: "start"
      }));
    }
  }

  setup = (wst_id) => {
    let res_id = edua.workstationInfo(sim,wst_id).resources[0].id;
    if(info.resources[res_id-1].available===1)
    {
      [result, sim] = edua.assignResource(sim, wst_id, res_id, 1);
      console.log(result);
      info = edua.info(sim); 
      [result, sim] = edua.startMode(sim, wst_id, wst_id);
      console.log(result);
      info = edua.info(sim);
      if(res_id===1) 
        this.setState({resOnWorkstation_1:wst_id}, () => console.log(this.state.resOnWorkstation_1));
      else if(res_id ===2)
        this.setState({resOnWorkstation_2:wst_id}, () => console.log(this.state.resOnWorkstation_2));
    }
    else
    {
      switch(res_id){
        case 1:
        {
          [result, sim] = edua.releaseResource(sim, this.state.resOnWorkstation_1, res_id, 1);
          info = edua.info(sim);
          console.log(result); 
          break;
        }
        case 2:
        {
          [result, sim] = edua.releaseResource(sim, this.state.resOnWorkstation_2, res_id, 1);
          info = edua.info(sim); 
          console.log(result);
          break;
        }
        default:
        {
          console.log('Coś poszło nie tak');
          break;
        }
      }
      [result, sim] = edua.assignResource(sim, wst_id, res_id, 1);
      //info = edua.info(sim); 
      console.log(result);
      [result, sim] = edua.startMode(sim, wst_id, wst_id);
      //console.log(result);
      info = edua.info(sim);
    }
  } 

  purchaseAcceptHandler = (wst_id) => {
    let action_id = Wst_buttons[wst_id-1][0].action_id;
    let product_id = edua.workstationInfo(sim,wst_id).modes[0].operations[0].requirements[0].id;
    //console.log(action_id);
    this.setState({purchasing:false});
    let i=0;
    while(i<Math.abs(this.state.productQuantity))
    {
      [result, sim] = edua.execAction(sim, action_id);
      //console.log(result);
      [result, sim] = edua.transfer(sim, action_id, product_id, 1);
      //console.log(result);
      info = edua.info(sim);
      this.setState({money: info.assets[0].value});
      i++;
    }
  }

  sellingAcceptHandler = (wst_id) => {
    let action_id; 
    let connection_id;
    for(let i=0;i<Wst_buttons[wst_id-1].length;i++)
    {
      if(Wst_buttons[wst_id-1][i].id===1)
      {
        action_id = Wst_buttons[wst_id-1][i].action_id;
        connection_id = Wst_buttons[wst_id-1][i].connection_id;
      }
    }
    let product_id = edua.workstationInfo(sim,wst_id).modes[0].operations[0].results[0].id;
    /*
    let quantity_array = info.buffers[wst_id+1].products.filter(product => product.product_id === product_id);
    let quantity; 
    quantity_array.map(quantity =>quantity = quantity.qty);*/

    let products = info.buffers[wst_id+1].products.filter(product => product.product_id === product_id);
    let quantity = products.map(x => x.qty);
    
    if(quantity[0]!==undefined)
    {
      [result, sim] = edua.transfer(sim, connection_id, product_id, quantity[0]);
      info = edua.info(sim);
      console.log(connection_id, product_id, quantity[0]);
      console.log(result);
      while(quantity[0]>0)
      {
        [result, sim] = edua.execAction(sim, action_id);
        console.log(action_id);
        console.log(result);
        info = edua.info(sim);
        this.setState({money: info.assets[0].value});
        quantity[0]--;
      }
    }
  }

  transferHandler = (wst_id,connection_id) => {
    let product_id = edua.workstationInfo(sim,wst_id).modes[0].operations[0].results[0].id;
    let products = info.buffers[wst_id+1].products.filter(product => product.product_id === product_id);
    let quantity = products.map(x => x.qty);
    
    if(quantity[0]!==undefined)
    {
      [result, sim] = edua.transfer(sim, connection_id, product_id, quantity[0]);
      console.log(result);
      info = edua.info(sim);
    }
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing:false});
    this.setState({productQuantity: 0});
  }

  purchaseSetHandler = (e) => {
    
    this.setState({productQuantity: e.target.value});
    //console.log(this.state.productQuantity);
  }

  purchaseHandler = () => {
    //console.log(this.state.purchasing);
    this.setState({purchasing:true});
    this.setState({showMenu:false});
  }

  showChart = () => {
    this.setState({chartVisibility:true});
  }

  hideChart = () => {
    this.setState({chartVisibility:false});
  }

  showMenuHandler = () => {
    this.setState({showMenu:false});
  }

  startOperation = (wst_id) => {
    if(info.workstations[wst_id-1].status==="idle")
    {
      [result, sim] = edua.startOperation(sim, wst_id, wst_id);
      console.log(result,wst_id); 
    }
    //console.log(info.workstations[wst_id-1].machine_mode);
    info = edua.info(sim);
  }

  menuShowingHandler = (wst_id) => {
    this.setState({showMenu:true});
    //this.setState({buttons:wst_buttons[wst_id-1]});
    this.setState({workstation_id:wst_id});
  }

  menuHidingHandler = () => {
    this.setState({showMenu:false});
  }

  selectAction = (action,wst_id,connection_id) => {

    switch(action){
      case 0:{
        //console.log('Buy button');
        console.log(wst_id);
        this.purchaseHandler();
        break;
      }
      case 1:{
        console.log('Sell button');
        console.log(wst_id);
        this.sellingAcceptHandler(wst_id);
        break;
      }
      case 2:{
        console.log('Setup button');
        console.log(wst_id);
        this.setup(wst_id)
        break;
      }
      case 3:{
        console.log('Transfer');
        console.log(connection_id);
        this.transferHandler(wst_id,connection_id);
        break;
      }
      case 4:{
        this.setState({showMenu:false});
        break;
      }
      default:{
        console.log(action);
        break;
      }
    }
  }

  render() {
    return (

      <div className="App">

        <div className="Panel">

          <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
            <Amount 
              modalClosed={this.purchaseCancelHandler} 
              setPurchase={this.purchaseSetHandler} 
              acceptPurchase={this.purchaseAcceptHandler}
              workstation_id={this.state.workstation_id}
              wst_buttons={Wst_buttons}/>
          </Modal>

          <Button2 
            click={this.switchValueHandler} 
            nameOfClass={this.state.nameOfClass}>
              {this.state.startButton}
          </Button2>
          
          <div>
            <p>Game speed</p>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={this.state.sliderValue} 
              onChange={this.sliderValueHandler} 
              className="slider" 
              id="myRange">   
            </input>
            <p>Current value: {this.state.sliderValue}</p>
          </div>


          <div className="GameInfo">
            <p>Game informations</p>
            <ul>
              <li>Week: {this.state.week}</li>
              <li>Day: {this.state.day}</li>
              <li>Time: {this.state.time}</li>
              <li>Money: {this.state.money}</li>
            </ul>
          </div>

          <div className="GanttChart">
            <Button2 nameOfClass="BuyingButton" click={this.showChart}>Gantt chart</Button2>
          </div>
          <Modal identifier={this.state.identifier} show={this.state.chartVisibility} modalClosed={this.hideChart}>
            <Chart/>
          </Modal>


          <Button2 click={this.getInfo}>Info</Button2>
          {/*
          <Button2 click={this.getingOtherValues}>Ready Actions</Button2>
          <Button2 click={() => this.setup(2,2)}>Resources Assign</Button2> 
          <Button2 click={() => this.startOperation(1)}>StartOperation</Button2>
          */}
        </div>

        

        <div className="Visualization">

          <Wst 
          info={info} 
          show={this.state.showMenu} 
          showMenu={this.menuShowingHandler} 
          hideMenu={this.menuHidingHandler} 
          resources={this.state.resources}
          wst_buttons={Wst_buttons}
          workstation_id={this.state.workstation_id}
          selectAction={this.selectAction}/>

        </div>

      </div>
    );
  }
}

export default App;
