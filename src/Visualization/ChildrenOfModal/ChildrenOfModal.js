import React from 'react';
import ButtonsList from './Buttons/Buttons';



const childrenOfModal = (props) => {
    
    return(
        <div>
            <h1>{props.info.workstations[props.workstation_id-1].name}</h1>
            <ButtonsList  
                workstation_id={props.workstation_id} 
                wst_buttons={props.wst_buttons}
                selectAction={props.selectAction} 
                klasa="Buttons"/>
            <h5>Raw material: {props.productIn} {props.productIn2}</h5>
            <h5>Ready product: {props.productOut}</h5>
        </div>
    );
}

export default childrenOfModal;