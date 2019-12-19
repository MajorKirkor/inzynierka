import React from 'react'
import './Visualization.css'

const wst = (props) => {
    return(
        
        <div>
            {props.info.workstations.map(workstation =>
            <div className="workstation" key={workstation.id}>    
                <h4> {workstation.name} </h4>
                <div>Id: {workstation.id}</div>
                <div>Resources: {workstation.resources}</div>
                <div>Status: {workstation.status} </div>
                <div>Done product: {props.doneProduct}</div>
                <div>Avaiable actions: </div>
            </div>
            )}
        </div>
        
    );
}

export default wst;