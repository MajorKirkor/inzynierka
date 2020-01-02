import React from 'react'

const pickingAmount = (props) => {
    return(
        <div>
            <input type="number" min="0" placeholder="Quantity" className="Quantity" 
                onChange={props.setPurchase} 
                onInput={props.setPurchase}/>
        </div>
    );
};

export default pickingAmount;