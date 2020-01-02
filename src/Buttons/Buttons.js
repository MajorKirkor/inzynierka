import React from 'react';

const buttonsList = (props) => {
  

    if (props.buttons.length > 0) {
      return (	
        <div>
            {props.buttons.map(button => <button onClick={props.ordered} key={button} >{button}</button>)}
        </div>
      );
    }
        
    return (
      <p>No results!</p>
    );
  };

export default buttonsList;