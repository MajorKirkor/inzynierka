import React, { Component } from 'react';
import './App.css';
//import Button from './Person/Person';
import Button2 from './Button/Button';
import ButtonsList from './Buttons/Buttons';
import Modal from './Modal/Modal';
import Amount from './PickingAmount/PickingAmount';
import Chart from './Chart/Chart';
import Spec from './EduA/Opt-challenge.js';
import Wst from './Visualization/Visualization';

let edua = window.edua;
let spec = Spec.split('\n');
let scen = edua.parse(spec);
let sim = edua.newSim(scen);
let info = edua.info(sim);
let result = false;
let setIntervalId;
//console.log(info);
//console.log(scen);
//console.log(edua);


let array = [];

for(let i=0;i<scen[2].length;i++)
{
  array[i] = scen[2][i][1]; 
}
//console.log(info.workstations[0]);

class App extends Component {

  state = {
    startButton: 'Start',
    startButtonState: false,
    nameOfClass: 'start',
    buyButtons: array,
    sellButtons: ['Sell Product 1', 'Sell Product 2'],
    sliderValue: 1,
    week:'...',
    day:'...',
    time:'...',
    money: info.assets[0].value ,
    purchasing: false,
    chartVisibility: false,
    identifier: "Chart",
    zmienna:0
  }


  gameTime = () => {
      edua.tick;
      console.log('aaa');
  }

  getInfo = () => {
    console.log(info);
    console.log(edua);
    console.log(info.buffers);
    this.setState(state => ({zmienna:5}))
    console.log(this.state.zmienna);
  }



  sliderValueHandler = (e) => {
    this.setState({sliderValue: e.target.value}, () => this.gameTimeRun());
  }

  gameTimeRun = () => {
    if(this.state.startButtonState)
    {
      clearInterval(setIntervalId);
      let bagno = Math.floor(1000/this.state.sliderValue);
      console.log(bagno);
      setIntervalId = setInterval(() => this.gameTime(), bagno);
    }
  }

  switchValueHandler = () => {
    //console.log(this.state.nameOfClass);
    if(!this.state.startButtonState)
    {
      
      //console.log('Clicked');
  	  this.setState(state => ({
        startButtonState: true,
        startButton: "Stop",
        nameOfClass: "stop",
      }),() => this.gameTimeRun());
    }
    else //if (this.state.wartosc === "Stop")
    {
      clearInterval(setIntervalId);
      //console.log('Clicked else');
      this.setState(state => ({
        startButtonState: false,
        startButton: "Start",
        nameOfClass: "start"
      }));
    }
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing:false});
    this.setState({productQuantity: 0});
  }

  purchaseAcceptHandler = () => {
    this.setState({purchasing:false});
    let i=0;
    do
    {
      console.log(this.state.productQuantity);
      [result, sim] = edua.execAction(sim, 1);
      info = edua.info(sim);
      this.setState({money: info.assets[0].value});
      i++;
    }while((i<Math.abs(this.state.productQuantity))&&(result===true))

    [result, sim] = edua.assignResource(sim, 1, 1, 1);
    console.log(info);
    /*for(let i=0;i<this.state.productQuantity;i++)
    {
      console.log(this.state.productQuantity);
      [result, sim] = edua.execAction(sim, 1);
      info = edua.info(sim);
      this.setState({money: info.assets[0].value});
    }*/
    
    console.log(info.assets[0].value);
  }

  purchaseSetHandler = (e) => {
    
    this.setState({productQuantity: e.target.value});
    //console.log(this.state.productQuantity);
  }

  purchaseHandler = () => {
    //console.log(this.state.purchasing);
    this.setState({purchasing:true});
  }

  showChart = () => {
    this.setState({chartVisibility:true});
  }

  hideChart = () => {
    this.setState({chartVisibility:false});
  }

  render() {
    return (

      <div className="App">

        <div className="Panel">

          <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
            <Amount modalClosed={this.purchaseCancelHandler} setPurchase={this.purchaseSetHandler} acceptPurchase={this.purchaseAcceptHandler}/>
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
                  
          <div className="Buying">
            <p>Buy product</p>
            <ButtonsList ordered={this.purchaseHandler} buttons={this.state.buyButtons} klasa="BuyingButton"/>
          </div>
          <div className="Selling">
            <p>Sell product</p>
            <ButtonsList buttons={this.state.sellButtons} klasa="SellingButton"/>
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

          <Button2 click={this.gameTime}>Time</Button2>
          <Button2 click={this.getInfo}>Info</Button2>

        </div>

        <div className="Visualization">

          <Wst info={info}/>

        </div>

      </div>
    );
  }
}

export default App;
