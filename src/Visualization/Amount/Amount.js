import React from 'react'
import './Amount.css'

const pickingAmount = (props) => {

    let upperCaseText = props.text.charAt(0).toUpperCase() + props.text.slice(1); 
    if(props.action==="0")
    {
        return(
            <div>
                <h3>How much product do you want to {props.text}?</h3>
                <input type="number" min="0" placeholder="Quantity" className="Quantity" 
                    onChange={props.setPurchase} 
                    onInput={props.setPurchase}/>
                <div>
                    <button 
                        type="submit" 
                        className="AcceptAmount" 
                        onClick={() => props.acceptPurchase(props.workstation_id)}>
                    
                        {upperCaseText}</button>
                    <button type="reset" className="DeclineAmount" onClick={props.modalClosed}>Cancel</button>
                </div>
            </div>
        );
    }
    else if(props.action==="1")
    {
        return(
            <div>
                <h3>How much product do you want to {props.text}?</h3>
                <input type="number" min="0" placeholder="Quantity" className="Quantity" 
                    onChange={props.setPurchase} 
                    onInput={props.setPurchase}/>
                <div>
                    <button 
                        type="submit" 
                        className="AcceptAmount" 
                        onClick={() => props.acceptPurchase(props.workstation_id,0)}>
                    
                    {upperCaseText}</button>
                    <button
                        type="submit" 
                        className="AcceptAmount" 
                        onClick={() => props.acceptPurchase(props.workstation_id,1)}
                        >
                        
                        All</button>
                    <button type="reset" className="DeclineAmount" onClick={props.modalClosed}>Cancel</button>
                </div>
            </div>
        );
    }
    else
    {
        return(
            <p>No results!</p>
        );
    }
};

export default pickingAmount;