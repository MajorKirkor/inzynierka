import React from 'react';
import './Visualization.css';
import Modal from '../Modal/Modal';
import ChildrenOfModal from './ChildrenOfModal/ChildrenOfModal';
import Amount from './Amount/Amount';

const wst = (props) => {
    return(
        
        <div>
            
            {props.info.workstations.map(workstation =>
            <div onClick={() => props.showMenuHandler(workstation.id)} className="workstation" key={workstation.id}>    
                <h4> {workstation.name} </h4>
                <div>Id: {workstation.id}</div>
                <div>Status: {workstation.status} </div>
                <div>
                    {/*<div>Products: {props.info.buffers[workstation.id+1].products.map(product => 
                    
                        <div key={product.product_id}>{product.qty}</div>
                        
                    )}</div>*/}
                </div>
            </div>
                    )}
            <div id="container"></div>
            <Modal show={props.showMenu} modalClosed={props.hideMenu} className="menu"> {/*Modal for main menu*/}
                <ChildrenOfModal 
                    info={props.info} 
                    workstation_id={props.workstation_id}
                    wst_buttons={props.wst_buttons}
                    selectAction={props.selectAction}
                    
                    productIn={props.productIn}
                    productIn2={props.productIn2}
                    productOut={props.productOut}/>

            </Modal>


                        
            <Modal show={props.showBuyMenu} modalClosed={props.modalClosed}> {/*Modal for buying menu*/}
                <Amount 
                    modalClosed={props.modalClosed} 
                    setPurchase={props.setPurchase} 
                    acceptPurchase={props.acceptPurchase}
                    workstation_id={props.workstation_id}
                    wst_buttons={props.wst_buttons}
                    action="0"
                    text="buy"
                    />
            </Modal>


            <Modal show={props.showTransferMenu} modalClosed={props.hideTransferMenuHandler}> {/*Modal for transfer menu*/}
                <Amount 
                    modalClosed={props.hideTransferMenuHandler}
                    setPurchase={props.setPurchase}
                    acceptPurchase={props.transferHandler}
                    workstation_id={props.workstation_id}
                    wst_buttons={props.wst_buttons}
                    action="1"
                    text="transfer"
                    />
            </Modal>

                        
        </div>
        
    );
}

export default wst;