import React from 'react';
import Modal from '../Modal/Modal';
import './Raport.css';



const raport = (props) => {

    return(
        <Modal show={props.showRaport} modalClosed={props.hideRaportHandler} identifier="raport">
            <table>
                <tbody>
                    <tr>
                        <td>Cash at the end of the week</td> 
                    
                        <td>{props.cashEndOfWeek}</td>
                    </tr>
                </tbody>
                    
                <tbody>
                    <tr>
                        <td>Bought</td>
                        <td>
                            <table>
                                <tbody>
                                    <tr>             
                                        <td>PA: {props.boughtOnPA}</td>
                                        <td>PB: {props.boughtOnPB}</td>
                                    </tr>
                                </tbody> 
                            </table>  
                        </td>
                    </tr>
                </tbody>

                <tbody>
                    <tr>
                        <td>Sold</td>
                        <td>
                            <table>
                                <tbody>
                                    <tr>             
                                        <td>PA: {props.wst_buttons[0][1].sold}</td>
                                        <td>PD: {props.wst_buttons[3][0].sold}</td>
                                        <td>PE: {props.wst_buttons[4][0].sold}</td>
                                    </tr>
                                </tbody> 
                            </table>  
                        </td>
                    </tr>
                </tbody>

            </table>

            <button onClick={props.hideRaportHandler} className="hide">Hide</button>
        </Modal>
    );
}

export default raport;