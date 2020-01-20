import React, { Component } from 'react';
import './App.css';
import Button2 from './Buttons/Button';
import Modal from './Modal/Modal';
import Chart from './Chart/Chart';
//import Spec from './EduA/Opt-challenge.js'';
import Wst from './Visualization/Visualization';
import Wst_buttons from './Buttons/ButtonSpec';
import Raport from './Raport/Raport';


let edua = window.edua;

let spec = window.Spec.split('\n');
let scen = edua.parse(spec);
let sim = edua.newSim(scen);
let info = edua.info(sim);
let result = false;
let setIntervalId;

let dt = new Date(2019, 6, 0, 0, 0);
console.log(info);


//console.log( document.getElementById('container'));

//window.draw("container", handlers, info, edua.visInfo(sim));



let cashEndOfWeek=0;
let boughtOnPA=0;
let boughtOnPB=0;


class App extends Component {

  state = {
    startButton: 'Start',
    startButtonState: false,
    nameOfClass: 'start',
    sliderValue: 1,
    week: 0,
    day:"Monday",
    time:'0:00',
    money: info.assets[0].value ,
    purchasing: false,
    chartVisibility: false,
    identifier: "Chart",
    showMenu: false,
    showRaport: false,
    showTransferMenu: false,
    workstation_id:'1',
    resOnWorkstation_1:0,
    resOnWorkstation_2:0,
    productQuantity:0,
    cashEndOfWeek:0,
    productIn:0,
    productOut:0,
    rawMaterial:0,
    rawMaterial2:'',
    readyProduct:0,
  }

  handlers = [
    ['workstation', 1, () => this.menuShowingHandler(1)],
    ['workstation', 2, () => this.menuShowingHandler(2)],
    ['workstation', 3, () => this.menuShowingHandler(3)],
    ['workstation', 4, () => this.menuShowingHandler(4)],
    ['workstation', 5, () => this.menuShowingHandler(5)]
  ];

  componentDidMount()
  {
    window.draw("container", this.handlers, info, edua.visInfo(sim));
    //console.log(edua.visInfo(sim));
  }

  dayOfWeek = (numberOfDay) => {
    switch(numberOfDay)
    {
      case 0:
        {
          return("Monday");
        }
      case 1:
        {
          return("Tuesday");
        }
      case 2:
        {
          return("Wednesday");
        }
      case 3:
        {
          return("Thursday");
        }
      case 4:
        {
          return("Friday");
        }
      default:
        {
          return(0);
        }
    }
  }

  gameTime = () => {
      sim = edua.tick(sim);//Every minute of simulation
      info = edua.info(sim);
      this.startOperation(1);
      this.startOperation(2);
      this.startOperation(3);
      this.startOperation(4);
      this.startOperation(5);
      window.refreshSim("container", "container-parent");
      window.draw("container", this.handlers, info, edua.visInfo(sim));
      dt.setMinutes(dt.getMinutes()+1);
      if(dt.getHours()<8)//End of day
        this.setState({time:dt.getHours() +':'+ (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())});
      else
      {
        dt.setDate(dt.getDate()+1)
        this.setState({day:this.dayOfWeek(dt.getDay())});
        if(dt.getDay() === 5)//End of week
        {
          this.setState({week:this.state.week+1});
          dt.setDate(0)
          this.setState({day:dt.getDay()});
          this.raport();
        }
        dt.setHours(0);
        dt.setMinutes(0);
      }
  }

  raport = () => {
    console.log('End of the week');
    this.switchValueHandler();
    cashEndOfWeek = info.assets[0].value - 2500;//Zmienic wartosc na ta z specyfikacji  
    this.setState({showRaport:true});
    
    if(cashEndOfWeek>0)
    {
      [result, sim] = edua.execAction(sim, 6);
      console.log(result);
      info = edua.info(sim);
      this.setState({money: info.assets[0].value}); 
    }
    else//End of the game
    {
        //How to zero all variables
        dt = new Date(2019, 6, 0, 0, 0);
        edua = window.edua;
        spec = window.Spec.split('\n');
        scen = edua.parse(spec);
        sim = edua.newSim(scen);
        info = edua.info(sim);
        this.setState({
          week: 0,
          day:"Monday",
          time:'0:00',
          money: info.assets[0].value 
        });
        cashEndOfWeek=0;
        boughtOnPA=0;
        boughtOnPB=0;
        Wst_buttons[0][1].sold=0;
        Wst_buttons[3][0].sold=0;
        Wst_buttons[4][0].sold=0;
    }
    
  }

  hideRaportHandler = () => {
    this.setState({showRaport:false});
  }

  getInfo = () => {
    console.log(info); 
    console.log(edua.visInfo(sim));  
  }
  
  getingOtherValues = () => {
    //this.state.productIn.map(x=>console.log('aaaa'));
    //console.log(this.state.productIn);
    console.log(edua);
  }


  sliderValueHandler = (e) => {
    this.setState({sliderValue: e.target.value}, () => this.gameTimeRun());
  }

  gameTimeRun = () => {
    if(this.state.startButtonState)
    {
      clearInterval(setIntervalId);
      setIntervalId = setInterval(() => this.gameTime(), Math.floor(1000/this.state.sliderValue));
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
      //console.log(result);
      info = edua.info(sim); 
      [result, sim] = edua.startMode(sim, wst_id, wst_id);
      //console.log(result);
      info = edua.info(sim);
      if(res_id===1) 
        this.setState({resOnWorkstation_1:wst_id});
      else if(res_id ===2)
        this.setState({resOnWorkstation_2:wst_id});
    }
    else
    {
      switch(res_id){
        case 1:
        {
          //console.log(this.state.resOnWorkstation_1,res_id);
          if(info.workstations[this.state.resOnWorkstation_1-1].status!=="setup")
          {
            [result, sim] = edua.releaseResource(sim, this.state.resOnWorkstation_1, res_id, 1);
            if(result)
            {
              this.setState({resOnWorkstation_1:wst_id});
            }
            info = edua.info(sim);
            //console.log(result);
          } 
          break;
        }
        case 2:
        {
          //console.log(this.state.resOnWorkstation_1,res_id);
          if(info.workstations[this.state.resOnWorkstation_2-1].status!=="setup")
          {
            [result, sim] = edua.releaseResource(sim, this.state.resOnWorkstation_2, res_id, 1);
            if(result)
            {
              this.setState({resOnWorkstation_2:wst_id});
            }
            info = edua.info(sim); 
            //console.log(result);
          }
          break;
        }
        default:
        {
          console.log('Coś poszło nie tak');
          break;
        }
      }
      [result, sim] = edua.assignResource(sim, wst_id, res_id, 1);
      info = edua.info(sim); 
      //console.log(result);
      [result, sim] = edua.startMode(sim, wst_id, wst_id);
      //console.log(result);
      info = edua.info(sim);
    }
  } 

  purchaseAcceptHandler = (wst_id) => {
    let action_id = Wst_buttons[wst_id-1][0].action_id;
    let product_id = edua.workstationInfo(sim,wst_id).modes[0].operations[0].requirements[0].id;
    //console.log(product_id);
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
      if(result)
      {
        switch(wst_id)
        {
          case 1:{
              boughtOnPA++;
              break;
            }
          case 2:{
              boughtOnPB++;
              break;
            }
          default:{
              break;
            }
        }
      }
      i++;
    }
  }

  sellingAcceptHandler = (wst_id) => {
    switch(wst_id)
    {
      case 1:{
        //PA
        if(Wst_buttons[wst_id-1][1].sold<Wst_buttons[4][0].sold)
        {
          this.sellingHandler(wst_id);
        }
        else 
        {
          alert("First you have to sell product on Workstation E")
        }
        break;
      }
      case 4:{
        //PD
        if(Wst_buttons[wst_id-1][0].sold<Wst_buttons[4][0].sold)
        {
          this.sellingHandler(wst_id);
        }
        else 
        {
          alert("First you have to sell product on Workstation E")
        }
        break;
      }
      case 5:{
        //PE
        this.sellingHandler(wst_id);
        break;
      }
      default:{
        console.log("Coś poszło nie tak");
        break;
      }
    }
  }

  sellingHandler = (wst_id) => {
    let action_id; 
    let connection_id;
    let sold;
    let index;
    for(let i=0;i<Wst_buttons[wst_id-1].length;i++)
    {
      if(Wst_buttons[wst_id-1][i].id===1)
      {
        action_id = Wst_buttons[wst_id-1][i].action_id;
        connection_id = Wst_buttons[wst_id-1][i].connection_id;
        sold = Wst_buttons[wst_id-1][i].sold;
        index = i;
      }
    }
    let product_id = edua.workstationInfo(sim,wst_id).modes[0].operations[0].results[0].id;

    let products = info.buffers[wst_id-1].products.filter(product => product.product_id === product_id);
    let quantity = products.map(x => x.qty);
    
    //Wst_buttons[wst_id-1][0].sold>sold;

    if(quantity[0]!==undefined)
    {
      console.log(quantity[0]);
      //console.log(connection_id, product_id, quantity[0]);
      //console.log(result);
      while(quantity[0]>0)
      {
        console.log(Wst_buttons[4][0].sold);
        console.log(sold);
        if(wst_id===5)
        {
          [result, sim] = edua.transfer(sim, connection_id, product_id, 1);
          info = edua.info(sim);
          console.log(result);
          [result, sim] = edua.execAction(sim, action_id);
          console.log(result);
          info = edua.info(sim);
          this.setState({money: info.assets[0].value});
          Wst_buttons[wst_id-1][index].sold++;
          console.log(Wst_buttons[wst_id-1][index].sold);
        }
        else if(Wst_buttons[4][0].sold>sold)
        {
          [result, sim] = edua.transfer(sim, connection_id, product_id, 1);
          info = edua.info(sim);
          console.log(result);
          [result, sim] = edua.execAction(sim, action_id);
          console.log(result);
          //console.log(action_id);
          //console.log(result);
          info = edua.info(sim);
          this.setState({money: info.assets[0].value});
          Wst_buttons[wst_id-1][index].sold++;
          sold++;
          console.log(Wst_buttons[wst_id-1][index].sold);
        }
        else
        {
          quantity[0]=0;
          break;
        }
        quantity[0]--;
      }
    }
  }

  transferAcceptHandler = (wst_id,action) => {
    
    let connection_id;
    for(let i=0;i<Wst_buttons[wst_id-1].length;i++)
    {
      if(Wst_buttons[wst_id-1][i].id===3)
      {
        connection_id = Wst_buttons[wst_id-1][i].connection_id;
      }
    }
    let product_id = edua.workstationInfo(sim,wst_id).modes[0].operations[0].results[0].id;
    let products = info.buffers[wst_id-1].products.filter(product => product.product_id === product_id);
    let quantity = products.map(x => x.qty);
    //console.log(quantity[0]);
    if(quantity[0]!==undefined)
    {
      if(action===1)
      {
        [result, sim] = edua.transfer(sim, connection_id, product_id, quantity[0]);
        //console.log(result);
        info = edua.info(sim);
      }
      else if(action===0)
      {
        if(Math.abs(this.state.productQuantity)>quantity[0])
        {
          let i=this.state.productQuantity;
          while(i>0) 
          {
            this.setState({productQuantity:quantity[0]});
            [result, sim] = edua.transfer(sim, connection_id, product_id, this.state.productQuantity);
            info = edua.info(sim);
            i--;
          }
        }
        else 
        {
          let i=this.state.productQuantity;
          while(i>0) 
          {
            [result, sim] = edua.transfer(sim, connection_id, product_id, 1);
            info = edua.info(sim);
            i--;
          }
        }
      }
    }
    this.setState({showTransferMenu:false});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing:false});
    this.setState({productQuantity: 0});
  }

  purchaseSetHandler = (e) => {
    this.setState({productQuantity: e.target.value});
  }

  purchaseHandler = () => {
    this.setState({purchasing:true});
    this.setState({showMenu:false});
  }

  transferHandler = () => {
    this.setState({showTransferMenu:true});
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
      //console.log(result,wst_id); 
    }
    info = edua.info(sim);
  }

  menuShowingHandler = (wst_id) => {
    this.setState({showMenu:true});
    this.setState({workstation_id:wst_id});
    this.productArray(wst_id);
    //this.state.productIn.map(product => console.log(product.qty));

  }

  menuHidingHandler = () => {
    this.setState({showMenu:false});
  }

  hideTransferMenuHandler = () => {
    this.setState({showTransferMenu:false});
  }

  productArray = (wst_id) => {

    this.setState({rawMaterial:0});
    this.setState({rawMaterial2:''});
    this.setState({readyProduct:0});
    let product_id_req = edua.workstationInfo(sim,wst_id).modes[0].operations[0].requirements[0].id;
    let productIn1 = info.buffers[wst_id-1].products.filter(product => product.product_id === product_id_req);
    let product_id_res = edua.workstationInfo(sim,wst_id).modes[0].operations[0].results[0].id;
    let productOut1 = info.buffers[wst_id-1].products.filter(product => product.product_id === product_id_res);
    if(wst_id===5)
    {
      let product_id_req2 = edua.workstationInfo(sim,wst_id).modes[0].operations[0].requirements[1].id;
      let productIn2 = info.buffers[wst_id-1].products.filter(product => product.product_id === product_id_req2);
      productIn2.map(product => this.setState({rawMaterial2:product.qty}));
    }

    productIn1.map(product => this.setState({rawMaterial:product.qty}));
    productOut1.map(product1 => this.setState({readyProduct:product1.qty}));

  }

  selectAction = (action,wst_id) => {

    switch(action){
      case 0:{
        this.purchaseHandler();
        break;
      }
      case 1:{
        this.sellingAcceptHandler(wst_id);
        break;
      }
      case 2:{
        this.setup(wst_id)
        break;
      }
      case 3:{
        this.transferHandler();
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

          <Raport 
            showRaport={this.state.showRaport} 
            hideRaportHandler={this.hideRaportHandler} 
            cashEndOfWeek={cashEndOfWeek}
            boughtOnPA={boughtOnPA}
            boughtOnPB={boughtOnPB}

            wst_buttons={Wst_buttons}

            />

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
        {/*}
          <div className="GanttChart">
            <Button2 nameOfClass="BuyingButton" click={this.showChart}>Gantt chart</Button2>
          </div>
          <Modal identifier="Chart" show={this.state.chartVisibility} modalClosed={this.hideChart}>
            <Chart/>
          </Modal>


          <Button2 click={this.getInfo}>Info</Button2>
          <Button2 click={this.getingOtherValues}>Edua</Button2>
          */}
        </div>

        

        <div className="Visualization">

          <Wst 
          info={info} 
          showMenu={this.state.showMenu} 
          showMenuHandler={this.menuShowingHandler} 
          hideMenu={this.menuHidingHandler} 
          resources={this.state.resources}
          wst_buttons={Wst_buttons}
          workstation_id={this.state.workstation_id}
          selectAction={this.selectAction}
          
          showBuyMenu={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
          setPurchase={this.purchaseSetHandler}
          acceptPurchase={this.purchaseAcceptHandler} 

          showTransferMenu={this.state.showTransferMenu}
          showTransferMenuHandler={this.showTransferMenuHandler}
          hideTransferMenuHandler={this.hideTransferMenuHandler}
          transferHandler={this.transferAcceptHandler}

          productIn={this.state.rawMaterial}
          productIn2={this.state.rawMaterial2}
          productOut={this.state.readyProduct}
          />
          
        </div>

        

      </div>
    );
  }
}

export default App;
