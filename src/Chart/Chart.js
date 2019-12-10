import React from 'react';
import CanvasJSReact from './canvasjs.react';
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

const chart = (props) => {

    const options = {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Gantt chart"
        },
        axisY: {
            title: "Time [s]",
            labelFormatter: this.addSymbols
        },
        data: [
        {
            type: "stackedBar",
            dataPoints: 
            [
                { label: "Machine 1", y: 30 }
            ]           
        },
        {
            type: "stackedBar",
            dataPoints: 
            [
                { label: "Machine 1", y: 20 }
            ]
        }
        ]
    }

    return (
		<div>
			<CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
        
		);

}

export default chart;