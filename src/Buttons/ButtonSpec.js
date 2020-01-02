class Wst_button {
    constructor(id, name, action_id, connection_id) {
      this.id = id;
      this.name = name;
      this.action_id = action_id;
      this.connection_id = connection_id;
    }
  }

const btt0 = new Wst_button(0,'Buy product',1,null);
const btt1 = new Wst_button(1,'Sell product',2,2);
const btt2 = new Wst_button(2,'Setup',null,null);
const btt3 = new Wst_button(3,'Transfer A to E',null,7);
const btt4 = new Wst_button(4,'Cancel',null,null);

const btt5 = new Wst_button(0,'Buy product',3,null);
const btt6 = new Wst_button(2,'Setup',null,null);
const btt7 = new Wst_button(3,'Transfer B to C',null,4);
const btt8 = new Wst_button(4,'Cancel',null,null);

const btt9 = new Wst_button(2,'Setup',null,null);
const btt10 = new Wst_button(3,'Transfer C to D',null,5);
const btt11 = new Wst_button(4,'Cancel',null,null);

const btt12 = new Wst_button(1,'Sell product',4,6);
const btt13 = new Wst_button(2,'Setup',null,null);
const btt14 = new Wst_button(3,'Transfer D to E',null,8);
const btt15 = new Wst_button(4,'Cancel',null,null);

const btt16 = new Wst_button(1,'Sell product',5,9);
const btt17 = new Wst_button(2,'Setup',null,null);
const btt18 = new Wst_button(4,'Cancel',null,null);


const wst_buttons = [
    [btt0,btt1,btt2,btt3,btt4],
    [btt5,btt6,btt7,btt8],
    [btt9,btt10,btt11],
    [btt12,btt13,btt14,btt15],
    [btt16,btt17,btt18]
  ]

export default wst_buttons;