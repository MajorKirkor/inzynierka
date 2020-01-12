import React from 'react';
import './Buttons.css';

const buttonsList = (props) => {
  

    if (props.wst_buttons.length > 0) {
      return (	
        <div>
            {props.wst_buttons[props.workstation_id-1].map(button => 
              <button 
                key={button.id} 
                className={props.klasa}
                id={button.name}
                onClick={() => props.selectAction(button.id,props.workstation_id)}>

                {button.name}

              </button>)}
        </div>
      );
    }
        
    return (
      <p>No results!</p>
    );
  };

export default buttonsList;