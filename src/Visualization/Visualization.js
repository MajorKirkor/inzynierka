import React from 'react'
import './Visualization.css'

const wst = (props) => {
    return(
        
        <div>
            {props.info.workstations.map(workstation =>
            <div className="workstation" key={workstation.id}>    
                <h3> {workstation.name} </h3>
                <h4>Id: {workstation.id}</h4>
                <p>Resources: {workstation.resources}</p>
                <p>Status: {workstation.status} </p>
                <p>Done product: {props.doneProduct}</p>
                <p>Avaiable actions: </p>
            </div>
            )}
        </div>
        
    );
}

export default wst;