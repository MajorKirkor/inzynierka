import React, { Component } from 'react';
import './App.css';
//import Button from './Person/Person';
import Button2 from './Button/Button';
import ButtonsList from './Buttons/Buttons';
import Modal from './Modal/Modal';
import Amount from './PickingAmount/PickingAmount';
import Chart from './Chart/Chart';



class App extends Component {

  state = {
    startButton: 'Start',
    nameOfClass: 'start',
    buyButtons: ['Buy Product 1', 'Buy Product 2'],
    sellButtons: ['Sell Product 1', 'Sell Product 2'],
    sliderValue: 5,
    week:'...',
    day:'...',
    time:'...',
    money:'...' ,
    purchasing: false,
    chartVisibility: false,
    identifier: "Chart"
  }

  sliderValueHandler = (e) => {
    this.setState({sliderValue: e.target.value});
  }

  switchValueHandler = () => {
    //console.log(this.state.nameOfClass);
    if(this.state.startButton === "Start")
    {
      //console.log('Clicked');
  	  this.setState(state => ({
        startButton: "Stop",
        nameOfClass: "stop"
      }));
    }
    else //if (this.state.wartosc === "Stop")
    {
      //console.log('Clicked else');
      this.setState(state => ({
        startButton: "Start",
        nameOfClass: "start"
      }));
    }
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing:false});
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

        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          <Amount modalClosed={this.purchaseCancelHandler}/>
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

      </div>
    );
  }
}

export default App;
