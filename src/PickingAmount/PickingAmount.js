import React from 'react'
import './PickingAmount.css'

const pickingAmount = (props) => {
    return(
        <div>
            <h3>How much product do you want to buy?</h3>
            <input type="number" min="0" placeholder="Quantity" className="Quantity" 
            onChange={props.setPurchase} 
            onInput={props.setPurchase}/>
            <div>
                <button type="submit" className="AcceptAmount" onClick={props.acceptPurchase}>BUY</button>
                <button type="reset" className="DeclineAmount" onClick={props.modalClosed}>CANCEL</button>
            </div>
        </div>
    );
};

export default pickingAmount;