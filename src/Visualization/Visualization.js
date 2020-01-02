import React from 'react';
import './Visualization.css';
import Modal from '../Modal/Modal';
import ChildrenOfModal from './ChildrenOfModal/ChildrenOfModal';


const wst = (props) => {

    return(
        
        <div>
            {props.info.workstations.map(workstation =>
            <div onClick={() => props.showMenu(workstation.id)} className="workstation" key={workstation.id}>    
                <h4> {workstation.name} </h4>
                <div>Id: {workstation.id}</div>
                <div>Status: {workstation.status} </div>
                <div>
                    <div>Products: {props.info.buffers[workstation.id+1].products.map(product => 
                    
                        <div key={product.product_id}>{product.qty}</div>
                        
                        )}</div>
                </div>
            </div>
            )}
            <Modal show={props.show} modalClosed={props.hideMenu} className="menu">
                <ChildrenOfModal 
                    info={props.info} 
                    workstation_id={props.workstation_id}
                    wst_buttons={props.wst_buttons}
                    selectAction={props.selectAction}/>
            </Modal>
        </div>
        
    );
}

export default wst;