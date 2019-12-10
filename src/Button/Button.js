import React from 'react';

const button = (props) => {
    return (
        <button onClick={props.click} className={props.nameOfClass}>{props.children}</button>
    );
} 

export default button;