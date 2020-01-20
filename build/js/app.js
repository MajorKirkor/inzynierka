// We might not need jQuery...

let onClick = (id, handler) => {
  document.getElementById(id).onclick = handler;
};

let setValueById = (id, value) =>
  document.getElementById(id).innerHTML = value;

let setButtonState = (id, active) => {
  if ( active === true )
    document.getElementById(id).removeAttribute("disabled");
  else
    document.getElementById(id).setAttribute("disabled", true);
};

let setButtonLabel = (id, label) =>
  document.getElementById(id).innerHTML = label;

// The app starts here.

const SETUP_LABEL = "Setup the workstation";
const PRODUCE_LABEL = "Produce the product";

var scen = null,
    sim = null,
    time = null;

let initScen = () => {
  let spec = document.getElementById("spec").innerHTML;
  spec = spec.split("\n");
  scen = edua.parse(spec);
};

let initSim = () => {
  sim = edua.newSim(scen);
  time = 0;
  let visInfo = edua.visInfo(sim)
  let info = edua.info(sim)

  
  return (
    {
      visInfo,
      info
    }
  ) 
};

let getMoney = (info) => 
  info.assets.filter( (x) => x.name === "money" )[0].value;

let getQtyFromBuffer = (info, b_id, p_id) => {
  // perhaps a little overengineered, but it's not guaranteed, that the order
  // of buffers, or products, will be the same every time the edua.info function
  // is called
  let products = info.buffers.filter( (b) => b.id === b_id )[0].products.filter( (p) => p.product_id === p_id );
  if ( products.length === 0 )
    return 0;
  else
    return products[0].qty;
};

let getRawQty = (info) => getQtyFromBuffer(info, 1, 1);
let getProductQty = (info) => getQtyFromBuffer(info, 2, 2);
let getSoldQty = (info) => getQtyFromBuffer(info, 3, 3);

let getWorkstationProperty = (info, w_id, prop_name, def = "") => {
  let wss = info.workstations.filter( (w) => w.id === w_id );
  if ( wss.length === 0 )
    return def;
  let val = wss[0][prop_name];
  if ( ( val === null ) || (val === undefined) )
    return def;
  else
    return val;
};

let showInfo = () => {
  let info = edua.info(sim);
  setValueById("sim-cash", getMoney(info));
  setValueById("sim-time", time);
  setValueById("sim-raw", getRawQty(info));
  setValueById("sim-products", getProductQty(info));
  setValueById("sim-sold", getSoldQty(info));
  setValueById("ws-status", getWorkstationProperty(info, 1, "status"));
  setValueById("ws-mode", getWorkstationProperty(info, 1, "machine_mode", "(none)"));
  setValueById("ws-time", getWorkstationProperty(info, 1, "time", "(none)"));
};

var refreshSim = (dom_elm_id_name, dom_parent_elm_id_name) => {
  const container = document.querySelector("#" + dom_elm_id_name);
  const containerAppended = document.createElement("div");
  containerAppended.setAttribute("id", dom_elm_id_name)
  const parentContainer = document.querySelector("#" + dom_parent_elm_id_name)
  container.parentNode.removeChild(container);
  parentContainer.appendChild(containerAppended)
}

let handlers = [
  ['workstation', 1, () => {
    alert("Workstation callback")
  }],
  ['buffer', 1, () => {
    alert("Buffer callback")
  }]
]

var draw = (dom_elm_id_name, handlers, info, visInfo ) => {

  let infoData = info
  let data = visInfo
  console.log(infoData)
  console.log(data)
  let workstationsInfo = infoData.workstations
  let buffersInfo = []
  let allBuffersInfo = infoData.buffers

  const firstBuffer = allBuffersInfo.splice(0,1)
  const lastBuffer = allBuffersInfo.splice(allBuffersInfo.length - 1, 1)
  buffersInfo.push(firstBuffer[0])
  buffersInfo.push(lastBuffer[0])
  const scale = 2;
  const w = 4000;
  const h = 4000 * scale;
  const svg = d3.select("div#" + dom_elm_id_name).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
  // CHANGE "w" and "h" to manipulate the window width and height
    .attr("viewBox", "0 0 " + w + " " + h)
    .style("padding", 0)
    .style("margin", 0)

  // PREPARE SCALES   
  const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, w]);

  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, h]);

  let textData = [];

  // PREPARE AXES 
  // scale the axis and prepare and apply the number of ticks on each axis
  const xAxisBottom = d3.axisBottom(xScale).ticks(20);
  const xAxisTop = d3.axisTop(xScale).ticks(20);
  const yAxisLeft = d3.axisLeft(yScale).ticks(20);
  const yAxisRight = d3.axisRight(yScale).ticks(20);

  const paths = [{
    d1: "M32,43a15.862,15.862,0,0,0,10.856-4.264c.009-.008.017-.017.025-.025l.01-.01a15.957,15.957,0,0,0,4.192-17.034c-.006-.016-.014-.031-.02-.047l-.007-.017A16.013,16.013,0,0,0,37.1,11.858,6.038,6.038,0,0,0,34.405,9.5,1,1,0,0,0,33,10.41v4.176l-1,1-1-1V10.41A1,1,0,0,0,29.6,9.5a6.039,6.039,0,0,0-2.687,2.351A15.991,15.991,0,0,0,32,43Zm-5.5-8a.5.5,0,0,1,0-1H28a1,1,0,0,0,0-2H26.5a.5.5,0,0,1,0-1H28a1,1,0,0,0,0-2H26.5a.5.5,0,0,1,0-1H28a1,1,0,0,0,0-2H26.5a.5.5,0,0,1,0-1H40V35Zm7.231,2a2,2,0,0,1-3.462,0ZM36,22h.465l.667,1H36Zm6,14.756V23h3.4A13.844,13.844,0,0,1,42,36.756ZM44.635,21H41a1,1,0,0,0-1,1v1h-.465l-1.7-2.555A1,1,0,0,0,37,20H36v-.529A6.038,6.038,0,0,0,38,15a5.885,5.885,0,0,0-.048-.652A14.029,14.029,0,0,1,44.635,21ZM29.293,15.707l2,2a1,1,0,0,0,1.414,0l2-2A1,1,0,0,0,35,15V12.356a4,4,0,0,1-.6,5.845,1,1,0,0,0-.4.8v4H30V19a1,1,0,0,0-.4-.8,4,4,0,0,1-.6-5.845V15A1,1,0,0,0,29.293,15.707Zm-3.245-1.364A5.975,5.975,0,0,0,26,15a6.038,6.038,0,0,0,2,4.471V23H26.5A2.5,2.5,0,0,0,24,25.5a2.471,2.471,0,0,0,.513,1.5,2.449,2.449,0,0,0,0,3,2.449,2.449,0,0,0,0,3A2.471,2.471,0,0,0,24,34.5,2.5,2.5,0,0,0,26.5,37h1.642a3.981,3.981,0,0,0,7.716,0H40v1a.985.985,0,0,0,.088.4A13.873,13.873,0,0,1,32,41a13.991,13.991,0,0,1-5.952-26.657ZM8,32h3.6a20.827,20.827,0,0,0,2.446,5.888l-2.552,2.544a1,1,0,0,0,0,1.415l5.66,5.66a1,1,0,0,0,.707.293h0a1,1,0,0,0,.707-.294l2.543-2.551A20.842,20.842,0,0,0,27,47.4V51a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V47.4a20.842,20.842,0,0,0,5.889-2.446l2.543,2.551a1,1,0,0,0,.707.294h0a1,1,0,0,0,.707-.293l5.66-5.66a1,1,0,0,0,0-1.415l-2.552-2.544A20.827,20.827,0,0,0,52.4,32H56a1,1,0,0,0,1-1V23a1,1,0,0,0-1-1H52.4a20.76,20.76,0,0,0-2.446-5.889l2.552-2.543a1,1,0,0,0,0-1.415l-5.66-5.66A1,1,0,0,0,46.14,6.2h0a1,1,0,0,0-.707.294L42.889,9.046A20.84,20.84,0,0,0,37,6.6V3a1,1,0,0,0-1-1H28a1,1,0,0,0-1,1V6.6a20.84,20.84,0,0,0-5.889,2.446L18.568,6.494a1,1,0,0,0-.707-.294h0a1,1,0,0,0-.707.293l-5.66,5.66a1,1,0,0,0,0,1.415l2.552,2.543A20.76,20.76,0,0,0,11.6,22H8a1,1,0,0,0-1,1v8A1,1,0,0,0,8,32Zm1-8h3.4a1,1,0,0,0,.981-.8,18.81,18.81,0,0,1,2.773-6.677,1,1,0,0,0-.128-1.261l-2.411-2.4,4.244-4.243,2.4,2.41a1,1,0,0,0,1.259.128A18.893,18.893,0,0,1,28.2,8.38,1,1,0,0,0,29,7.4V4h6V7.4a1,1,0,0,0,.8.98,18.893,18.893,0,0,1,6.679,2.774,1,1,0,0,0,1.259-.128l2.4-2.41,4.244,4.243-2.411,2.4a1,1,0,0,0-.128,1.261A18.81,18.81,0,0,1,50.619,23.2a1,1,0,0,0,.981.8H55v6H51.6a1,1,0,0,0-.98.8,18.869,18.869,0,0,1-2.774,6.678,1,1,0,0,0,.128,1.26l2.411,2.4-4.244,4.243-2.4-2.41a1,1,0,0,0-1.259-.128A18.839,18.839,0,0,1,35.8,45.62a1,1,0,0,0-.8.98V50H29V46.6a1,1,0,0,0-.8-.98,18.839,18.839,0,0,1-6.678-2.774,1,1,0,0,0-1.259.128l-2.4,2.41-4.244-4.243,2.411-2.4a1,1,0,0,0,.128-1.26A18.869,18.869,0,0,1,13.38,30.8a1,1,0,0,0-.98-.8H9Z",
    d2: "M14.092,88.769L172.1,164.826c1.833,0.882,3.969,0.882,5.802,0L335.91,88.768c5.051-2.429,5.051-9.621,0-12.051L177.9,0.662c-1.832-0.882-3.968-0.882-5.801,0L14.092,76.718C9.041,79.148,9.041,86.339,14.092,88.769z M14.092,181.024L172.1,257.082c1.833,0.882,3.969,0.882,5.802,0l158.008-76.057c5.051-2.429,5.051-9.621,0-12.053l-33.336-16.044l-105.881,50.962c-6.726,3.236-14.228,4.946-21.692,4.946s-14.964-1.71-21.702-4.951L47.43,152.924l-33.339,16.047C9.041,171.404,9.041,178.595,14.092,181.024z M335.91,261.229l-33.336-16.047l-105.881,50.965c-6.726,3.236-14.228,4.946-21.692,4.946s-14.964-1.71-21.702-4.951L47.43,245.182L14.091,261.23c-5.051,2.432-5.051,9.621,0,12.053l158.008,76.057c1.833,0.882,3.969,0.882,5.802,0l158.008-76.057C340.961,270.85,340.961,263.66,335.91,261.229z",
    d3: "M414.41,24.123C398.333,8.042,378.963,0,356.315,0H82.228C59.58,0,40.21,8.042,24.126,24.123C8.045,40.207,0.003,59.576,0.003,82.225v274.084c0,22.647,8.042,42.018,24.123,58.102c16.084,16.084,35.454,24.126,58.102,24.126h274.084c22.648,0,42.018-8.042,58.095-24.126c16.084-16.084,24.126-35.454,24.126-58.102V82.225C438.532,59.576,430.49,40.204,414.41,24.123z",
    d4: "M437.019,74.98C388.667,26.629,324.38,0,256,0C187.619,0,123.331,26.629,74.98,74.98C26.628,123.332,0,187.62,0,256s26.628,132.667,74.98,181.019C123.332,485.371,187.619,512,256,512c68.38,0,132.667-26.629,181.019-74.981C485.371,388.667,512,324.38,512,256S485.371,123.333,437.019,74.98z M256,482C131.383,482,30,380.617,30,256S131.383,30,256,30s226,101.383,226,226S380.617,482,256,482z M378.305,173.859c-5.857-5.856-15.355-5.856-21.212,0.001L224.634,306.319l-69.727-69.727c-5.857-5.857-15.355-5.857-21.213,0c-5.858,5.857-5.858,15.355,0,21.213l80.333,80.333c2.929,2.929,6.768,4.393,10.606,4.393c3.838,0,7.678-1.465,10.606-4.393l143.066-143.066C384.163,189.215,384.163,179.717,378.305,173.859z",
    d5: "M405.6,69.6C360.7,24.7,301.1,0,237.6,0s-123.1,24.7-168,69.6S0,174.1,0,237.6s24.7,123.1,69.6,168s104.5,69.6,168,69.6s123.1-24.7,168-69.6s69.6-104.5,69.6-168S450.5,114.5,405.6,69.6z M386.5,386.5c-39.8,39.8-92.7,61.7-148.9,61.7s-109.1-21.9-148.9-61.7c-82.1-82.1-82.1-215.7,0-297.8C128.5,48.9,181.4,27,237.6,27s109.1,21.9,148.9,61.7C468.6,170.8,468.6,304.4,386.5,386.5zM342.3,132.9c-5.3-5.3-13.8-5.3-19.1,0l-85.6,85.6L152,132.9c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1l85.6,85.6l-85.6,85.6c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l85.6-85.6l85.6,85.6c2.6,2.6,6.1,4,9.5,4c3.5,0,6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1l-85.4-85.6l85.6-85.6C347.6,146.7,347.6,138.2,342.3,132.9z"
  }];

  const dataset = [1];

  const drawProgressBar = (height, width, posY, posX, color, outline, translation, name) => {
    svg.append("rect")
      .attr("height", function () {
        return yScale(height);
      })
      .attr("width", function () {
        return xScale(width);
      })
      .attr("y", function () {
        return yScale(posY * 10);
      })
      .attr("x", function () {
        return xScale(posX * 10);
      })
      .attr("fill", color)
      .attr("style", outline)
      .attr("class", "rectangle")
      .attr("transform", `translate(0,${translation * 40})`)
      .attr("id", function() { return name });
  }

  const drawState = (posX, posY, name, empty) => {
    if(posX === "9") {
      svg.selectAll("state")
      .data(dataset)
      .enter()
      .append('path')
      .attr("class", "state")
      .attr("d", paths[0].d3)
      .attr("id", function() { return name })
      .style("transform", `scaleX(${0.18})
       scaleY(${0.18})
       translate(${4450 / scale * posX + 2000 - 1800}px,
       ${2225 * posY - 1200}px)`)
      .style("fill", empty === "true" ? "gray" : "red" )
    }
    else {
      svg.selectAll("state")
      .data(dataset)
      .enter()
      .append('path')
      .attr("class", "state")
      .attr("d", paths[0].d3)
      .attr("id", function() { return name })
      .style("transform", `scaleX(${0.18})
       scaleY(${0.18})
       translate(${4450 / scale * posX + 2200}px,
       ${2225 * posY - 100}px)`)
      .style("fill", empty === "true" ? "gray" : "red" )
    }
  }

  const drawResource = (posX, posY, name) => {
    if(posX === "9") {
      let resourcesFar = svg.selectAll("resourcesFar")
      resourcesFar
      .data(dataset)
      .enter()
      .append('path')
      .attr("class", "resourcesFar")
      .attr("d", paths[0].d4)
      .attr("id", function() { return name })
      .style("transform", `scaleX(${0.16})
       scaleY(${0.16})
       translate(${5000 / scale * posX + 270}px,
       ${2500 * posY - 700}px)`)
      .style("fill", "green" )
    }
    else {
      let resources = svg.selectAll("resources")
      resources
      .data(dataset)
      .enter()
      .append('path')
      .attr("class", "resources")
      .attr("d", paths[0].d4)
      .attr("id", function() { return name })
      .style("transform", `scaleX(${0.16})
       scaleY(${0.16})
       translate(${5000 / scale * posX + 2500}px,
       ${2500 * posY + 500}px)`)
      .style("fill", "green" )
    }
  }

  const drawNoResource = (posX, posY, name) => {
    let noResources = svg.selectAll("noResources")
    noResources
    .data(dataset)
    .enter()
    .append('path')
    .attr("class", "noResources")
    .attr("d", paths[0].d5)
    .attr("id", function() { return name })
    .style("transform", `scaleX(${0.16})
     scaleY(${0.16})
     translate(${5000 / scale * posX + 2500}px,
     ${2500 * posY + 500}px)`)
    .style("fill", "red" )
  }

  const drawResources = (drawResource, drawNoResource) => {
    for(let i = 0 ; i < workStations.length ; i++) {
      if(infoData.workstations[i].resources.length > 0) {
        drawResource(
        workStations[i].x * 1,
        workStations[i].y * 1, 
        // element.name, 
        )
      }
      else {
        drawNoResource(
          workStations[i].x * 1,
          workStations[i].y * 1, 
          // element.name, 
          )
      }
  }
}

function onMouseOver () {
  d3.select(this)
  .style("opacity", "0.8")}

function onMouseOut () {
  d3.select(this)
  .style("opacity", "1")}

  const drawBuffer = (posX, posY, fill, id) => {
    let bufferRect = svg.selectAll("BufferRect")
    bufferRect
    .data(dataset)
    .enter()
    .append("rect")
    .attr("id", function() { return ("buffer " + id) })
    .attr("class", "BufferRect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 53)
    .attr("height", 53)
    .style("cursor", "pointer")
    .style("transition", "0.3s")
    .style("fill", "transparent")
    .style("transform", `scale(${7.467}) translate(${53.4 *  1 * posX - 9}px, ${48.7 * 1 * posY}px)`)

    let buffer = svg.selectAll("Buffer")
    buffer
    .data(dataset)
    .enter()
    .append('path')
    .attr("class", "Buffer")
    .attr("d", paths[0].d2)
    .attr("id", function() { return "buffer " + id })
    .style("transform", `scaleX(${1.18}) scaleY(${1.1428}) translate(${337.5 * 1 * posX}px, ${350 * 1 * posY}px)`)
    .style("cursor", "pointer")
    .style("fill", fill)
    .style("transition", "0.3s")
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut)
  }

  const buffers = data.filter(element => {
    return element.type.includes("buffer"
    )});

    const drawBuffers = ((drawBuffer) => {
      buffers.forEach(element => {
        drawBuffer(
          element.x,
          element.y,
          element.color,
          element.id
        )
        // drawState(
        //   element.x,
        //   element.y,
        //   element.name,
        //   element.isActive
        // )
      })
    })
  
  const drawWorkStation = (posX, posY, fill, id) => {
    
    let stationRect = svg.selectAll("StationRect")
    stationRect
    .data(dataset)
    .enter()
    .append("rect")
    .attr("id", function() { return ("workstation " + id) })
    .attr("class", "StationRect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 53)
    .attr("height", 53)
    .style("cursor", "pointer")
    .style("transition", "0.3s")
    .style("fill", "transparent")
    .style("transform", `scale(${7.467}) translate(${52.4 * 1 *posX - 5}px, ${48.7 * 1 * posY}px)`)

    let stations = svg.selectAll("Station")
    stations
    .data(dataset)
    .enter()
    .append('path')
    .attr("class", "Station")
    .attr("d", paths[0].d1)
    .attr("id", function() { return ("workstation " + id) })
    .style("transform", `scale(${7.467}) translate(${53.6 *  1 * posX - 5}px, ${53.6 * 1 * posY}px)`)
    .style("fill", fill)
    .style("cursor", "pointer")
    .style("transition", "0.3s")
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut)


    // .on("mouseover", onMouseOver)
    // .on("mouseout", onMouseOut)
  }

  const workStations = data.filter(element => {
    return element.type.includes("station"
    )});

    const createTextData = () => {
      for(let i = 0 ; i < workStations.length ; i++) {

        if(workStations.x === 9) {
          textData.push(
            {
              "posX": workStations[i].x * 1 * 400 - 110,
              "posY": workStations[i].y * 1 * 400 - 200,
              "title": `${workstationsInfo[i].name} ${workstationsInfo[i].id}`,
              "mode": workstationsInfo[i].status,
              "timeLeft": infoData.workstations[i].time
            }
          )
        }
        else {
          textData.push(
            {
              "posX": workStations[i].x * 1 * 400 + 150,
              "posY": workStations[i].y * 1 * 400,
              "title": `${workstationsInfo[i].name} ${workstationsInfo[i].id}`,
              "mode": workstationsInfo[i].status,
              "timeLeft": infoData.workstations[i].time
            }
          )
        }
      }

      for(let i = 0 ; i < buffers.length ; i++) {

        if(buffers.x === 9) {
          textData.push(
            {
              "posX": buffers[i].x * 1 * 400 - 110,
              "posY": buffers[i].y * 1 * 400 - 200,
              "title": `${buffersInfo[i].name}`,
              // "mode": workstationsInfo[i].machine_mode,
              // "timeLeft": element.timeLeft
            }
          )
        }
        else {
          textData.push(
            {
              "posX": buffers[i].x * 1 * 400 + 240,
              "posY": buffers[i].y * 1 * 400,
              "title": `${buffersInfo[i].name}`,
              // "mode": workstationsInfo[i].machine_mode,
              // "timeLeft": element.timeLeft
            }
          )
        }
      }

    let text = svg.selectAll("text")
      .data(textData)
      .enter()
      .append("text");

    text
      .attr("x", function (d) { return d.posX + 30; })
      .attr("y", function (d) { return d.posY - 40; })
      .text(function (d) { return `${d.title}`; })
      .attr("font-family", "sans-serif")
      .attr("font-weight", "bold")
      .attr("font-size", "77px")
      .attr("fill", "black");

    let modes = svg.selectAll("mode")
    .data(textData)
    .enter()
    .append("text");

    modes
      .attr("x", function (d) { return d.posX + 260; })
      .attr("y", function (d) { return d.posY + 50; })
      .text(function (d) {
        if (d.mode === "not ready") return `N${d.timeLeft > 0 ? `(${d.timeLeft})` : ("")}`
        else if (d.mode === "setup") return `S${d.timeLeft > 0 ? `(${d.timeLeft})` : ("")}`
        else if (d.mode === "idle") return `I${d.timeLeft > 0 ? `(${d.timeLeft})` : ("")}`
        else if (d.mode === "operation") return `O${d.timeLeft > 0 ? `(${d.timeLeft})` : ("")}`
        else return ""
      })
        // return `${d.mode}${d.timeLeft > 0 ? `(${d.timeLeft})` : ("")}`; })
      .attr("font-family", "sans-serif")
      .attr("font-weight", "bold")
      .attr("font-size", "75px")
      .attr("fill", function (d) {
        if (d.mode === "not ready") return "red"
        else if (d.mode === "setup") return "orange"
        else if (d.mode === "idle") return "blue"
        else if (d.mode === "operation") return "green"
        else return "black"
      });
    }




    
  const drawWorkStations = ((drawWorkStation, drawProgressBar) => {

    for(let i = 0 ; i < workStations.length ; i++) {
       let percentageFill = 1 - infoData.workstations[i].time / infoData.workstations[i].totalTime;
      drawWorkStation(
        workStations[i].x,
        workStations[i].y,
        workStations[i].color,
        workStations[i].id)
        if (percentageFill >= 0) {
          drawProgressBar(
            5 / scale,
            2.2, workStations[i].y * 1 / scale - 0.07,
            workStations[i].x * 1 - 0.2,
            "white",
            "outline: 5px solid black",
            0)
          drawProgressBar(
            (4 * percentageFill) * 1.23 / scale,
            2.2,
            workStations[i].y * 1 / scale - 0.07,
            workStations[i].x * 1 - 0.2,
            "green",
            "outline: 5px solid black",
            5 - percentageFill * 1.23 * 4
          )
        }
    // drawState(
    //   element.x,
    //   element.y,
    //   element.name,
    //   element.isActive
    // )
    }
  })

  const drawVerticalAxis = (translation, axis) => {
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + translation + ")")
    // .call(axis);
    // Toggling the axis tick values
  }

  const drawHorizontalAxis = (translation, axis) => {
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + translation + ",0)")
    // .call(axis);
    // Toggling the axis tick values
  }

  const prepareGridLinesHorizontal = (tickSize, ticks) => {
    const gridLine = d3.axisTop()
      .tickFormat("")
      .tickSize(tickSize)
      .ticks(ticks)
      .scale(xScale);
    return (gridLine);
  }

  const prepareGridLinesVertical = (tickSize, ticks) => {
    const gridLine = d3.axisLeft()
      .tickFormat("")
      .tickSize(tickSize)
      .ticks(ticks)
      .scale(yScale);
    return (gridLine);
  }

  const appendGridLines = (gridClass, gridline) => {
    svg.append("g")
      .attr("class", gridClass)
      .call(gridline);
  }

  svg.append("svg:defs").append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 70)
    .attr("refY", 40)
    .attr("markerWidth", 200)
    .attr("markerHeight", 200)
    .attr("markerUnits", "userSpaceOnUse")
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 83 40 0 80 0 0")
    .style("fill", "black");

    const drawLine = (posX1, transX1, posY1, transY1, posX2, transX2, posY2, transY2) => {

      svg.append("line")
        .attr("x1", function () {
          return xScale(posX1 * 10 + transX1);
        })
        .attr("y1", function () {
          return xScale(posY1 * 10 + transY1);
        })
        .attr("x2", function () {
          return xScale(posX2 * 10 + transX2);
        })
        .attr("y2", function () {
          return xScale(posY2 * 10 + transY2);
        })
        .attr("stroke-width", 15)
        .attr("stroke", "black")
    }

    let occupiedFields = []

    checkHowToDrawArrow = (posX1, posY1, posX2, posY2) => {
      let transitionX1, transitionY1, transitionX2, transitionY2
      let x1 = parseInt(posX1), x2 = parseInt(posX2), y1 = parseInt(posY1), y2 = parseInt(posY2);
      
      if((posX1 < posX2 && posY1 === posY2)) {
        transitionX1 = 10
        transitionY1 = 5
        transitionX2 = 0
        transitionY2 = 5
        transition = {
          transitionX1,
          transitionY1,
          transitionX2,
          transitionY2
        }
        return transition
      }

      else if(x1 < x2 && y1 < y2) {
        
          const firstField = {
            posX: x1 + 1,
            posY: y1
          }

          const lastField = {
            posX: x2,
            posY: y2 - 1
          }
          
          let containsField;
          
          occupiedFields.filter(field => {
             if(field.posX === firstField.posX && field.posY === firstField.posY
              || field.posX === lastField.posX && field.posY === lastField.posY ) {
              containsField = true;
             }
            })
             if(containsField) {
              transitionX1 = 5
              transitionY1 = (posY2 - posY1) * 10 + 5
              transitionX2 = 0
              transitionY2 = 5
              transition = {
                transitionX1,
                transitionY1,
                transitionX2,
                transitionY2
              }
              drawLine(x1, 5, posY1, 10, x1, 5, posY2, 5)
              return transition
             }

             else {
              transitionX1 = x2 * 10 + 5 - x1 * 10
              transitionY1 = 5
              transitionX2 = 5
              transitionY2 = 0
              transition = {
                transitionX1,
                transitionY1,
                transitionX2,
                transitionY2
              }
               drawLine(x1, 10, posY1, 5, x2, 5, posY1, 5)
               return transition
            }
        }

      else if(x1 < x2 && y1 > y2) {
        
          const firstField = {
            posX: x1,
            posY: y1 - 1
          }

          const lastField = {
            posX: x2 - 1,
            posY: y2
          }
          let containsField;

          occupiedFields.filter(field => {
            if(field.posX === firstField.posX && field.posY === firstField.posY
              || field.posX === lastField.posX && field.posY === lastField.posY) {
                containsField = true;
              }})

            if(containsField) {
              transitionX1 = (x2 - x1) * 10 + 5
              transitionY1 = 5
              transitionX2 = 5
              transitionY2 = 10
              transition = {
                transitionX1,
                transitionY1,
                transitionX2,
                transitionY2
              }
              drawLine(x1, 10, y1, 5, x2, 5, y2, (y1 - y2) * 10 + 5)
              return transition
            }

            else {
              transitionX1 = 5
              transitionY1 = (y2 - y1) * 10 + 5
              transitionX2 = 0
              transitionY2 = 5
              transition = {
                transitionX1,
                transitionY1,
                transitionX2,
                transitionY2
              }
              drawLine(x1, 5, y1, 0, x1, 5, y2, 5)
              return transition
            }
        }

      else if(x1 > x2 && y1 === y2) {
        transitionX1 = 0
        transitionY1 = 5
        transitionX2 = 10
        transitionY2 = 5
        transition = {
          transitionX1,
          transitionY1,
          transitionX2,
          transitionY2
        }
        return transition
      }

      else if(x1 > x2 && y1 > y2) {
        const firstField = {
          posX: x1 - 1,
          posY: y1
        }

        const centerField = {
          posX: x1,
          posY: y2
        }

        const lastField = {
          posX: x2,
          posY: y2 + 1
        }

        let containsField;

        occupiedFields.filter(field => {
          if(field.posX === firstField.posX && field.posY === firstField.posY
            || field.posX === lastField.posX && field.posY === lastField.posY
            || (field.posX === centerField.posX && field.posY === centerField.posY)) {
              containsField = true;
            }})
            
            if(containsField) {
              transitionX1 = (x2 - x1) * 10 + 5
              transitionY1 = (0) * 10 + 5
              transitionX2 = 5
              transitionY2 = 10
              transition = {
                transitionX1,
                transitionY1,
                transitionX2,
                transitionY2
              }
              drawLine(x1, 0, y1, 5, x2, 5, y1, 5)
              return transition
            }
        
        transitionX1 = 5
        transitionY1 = (y2 - y1) * 10 + 5
        transitionX2 = 10
        transitionY2 = 5
        transition = {
          transitionX1,
          transitionY1,
          transitionX2,
          transitionY2
        }
        drawLine(x1, 5, y1, 0, x1, 5, y2, 5)
        return transition
      }

      else if(x1 > x2 && y1 < y2) {

        const firstField = {
          posX: x1,
          posY: y1 + 1
        }

        const centerField = {
          posX: x1,
          posY: y2
        }

        const lastField = {
          posX: x2 + 1,
          posY: y2
        }

        let containsField;

        occupiedFields.filter(field => {
      if(field.posX === firstField.posX && field.posY === firstField.posY
        || field.posX === lastField.posX && field.posY === lastField.posY
        || (field.posX === centerField.posX && field.posY === centerField.posY)) {
          containsField = true;
        }})
      if(containsField) {
              
        transitionX1 = (x2 - x1) * 10 + 5
        transitionY1 = 5
        transitionX2 = 5
        transitionY2 = 0
        transition = {
          transitionX1,
          transitionY1,
          transitionX2,
          transitionY2
        }
        drawLine(x1, 0, y1, 5, x2, 5, y1, 5)
        return transition
      }
        
        transitionX1 = 5
        transitionY1 = (y2 - y1) * 10 + 5
        transitionX2 = 10
        transitionY2 = 5
        transition = {
          transitionX1,
          transitionY1,
          transitionX2,
          transitionY2
        }
        drawLine(x1, 5, y1, 10, x1, 5, y2, 5)
        return transition
      }

      else if(x1 === x2 && y1 < y2) {
        transitionX1 = 5
        transitionY1 = 10
        transitionX2 = 5
        transitionY2 = 0
        transition = {
          transitionX1,
          transitionY1,
          transitionX2,
          transitionY2
        }
        return transition
      }

      else if(x1 === x2 && y1 > y2) {
        transitionX1 = 5
        transitionY1 = 0
        transitionX2 = 5
        transitionY2 = 10
        transition = {
          transitionX1,
          transitionY1,
          transitionX2,
          transitionY2
        }
        return transition
      }
    }

  const drawArrowLine = (posX1, posY1, posX2, posY2, triangle) => {

    const transitionX1 = checkHowToDrawArrow(posX1, posY1, posX2, posY2).transitionX1
    const transitionY1 = checkHowToDrawArrow(posX1, posY1, posX2, posY2).transitionY1
    const transitionX2 = checkHowToDrawArrow(posX1, posY1, posX2, posY2).transitionX2
    const transitionY2 = checkHowToDrawArrow(posX1, posY1, posX2, posY2).transitionY2
    
    svg.append("line")
      .attr("x1", function () {
        return xScale(posX1 * 1 * 10 + transitionX1);
      })
      .attr("y1", function () {
        return xScale(posY1 * 1 * 10 + transitionY1);
      })
      .attr("x2", function () {
        return xScale(posX2 * 1 * 10 + transitionX2);
      })
      .attr("y2", function () {
        return xScale(posY2 * 1 * 10 + transitionY2);
      })
      .attr("stroke-width", 15)
      .attr("stroke", "black")
      .attr("marker-end", triangle);

      let x1 = parseInt(posX1), x2 = parseInt(posX2), y1 = parseInt(posY1), y2 = parseInt(posY2);

      if(y1 === y2) {
        let numOfFieldsX = Math.abs(x1 - x2) - 1
        for(let i = 0 ; i < numOfFieldsX; i++){
          if(x1 < x2) {
            const occupiedField = {
              posX: x1 + i + 1,
              posY: y1
            }
            occupiedFields.push(occupiedField)
          }
          else {
            const occupiedField = {
              posX: x2 + i + 1,
              posY: y1
            }
            occupiedFields.push(occupiedField)
          }
        }
      }

      else if(x1 === x2) {
        let numOfFieldsY = Math.abs(y1 - y2)- 1
        for(let i = 0 ; i < numOfFieldsY; i++){
          if(y1 < y2) {
            const occupiedField = {
              posX: x1,
              posY: y1 + i + 1
            }
            occupiedFields.push(occupiedField)
          }
          else {
            const occupiedField = {
              posX: x1,
              posY: y2 + i + 1
            }
            occupiedFields.push(occupiedField)
          }
        }
      }
      else {
        if(x1 < x2 && y1 > y2) {
          let numOfFieldsX = Math.abs(x1 - x2)
          let numOfFieldsY = Math.abs(y1 - y2)
          for(let i = 0 ; i < numOfFieldsX ; i++) {
            const occupiedField = {
              posX: x1 + i,
              posY: y2
            }
            if(!occupiedFields.includes(occupiedField)){
              occupiedFields.push(occupiedField)
            }
          }
          for(let i = 0 ; i < numOfFieldsY ; i++) {
            const occupiedField = {
              posX: x1,
              posY: y2 + i
            }
            if(!occupiedFields.includes(occupiedField)){
              occupiedFields.push(occupiedField)
            }
          }
        }

        else if(x1 > x2 && y1 > y2) {
          let numOfFieldsX = Math.abs(x1 - x2)
          let numOfFieldsY = Math.abs(y1 - y2) - 1
          for(let i = 0 ; i < numOfFieldsX ; i++) {
            const occupiedField = {
              posX: x2 + i + 1,
              posY: y2
            }
            if(!occupiedFields.includes(occupiedField)){
              occupiedFields.push(occupiedField)
            }
          }
          for(let i = 0 ; i < numOfFieldsY ; i++) {
            const occupiedField = {
              posX: x1,
              posY: y1 - i - 1
            }
            if(!occupiedFields.includes(occupiedField)){
              occupiedFields.push(occupiedField)
            }
          }
        }

        else if(x1 < x2 && y1 < y2) {
          let numOfFieldsX = Math.abs(x1 - x2)
          let numOfFieldsY = Math.abs(y1 - y2) - 1
          for(let i = 0 ; i < numOfFieldsX ; i++) {
            const occupiedField = {
              posX: x1 + i,
              posY: y2
            }
            if(!occupiedFields.includes(occupiedField)){
              occupiedFields.push(occupiedField)
            }
          }
          for(let i = 0 ; i < numOfFieldsY ; i++) {
            const occupiedField = {
              posX: x1,
              posY: y1 + i + 1
            }
            if(!occupiedFields.includes(occupiedField)){
              occupiedFields.push(occupiedField)
            }
          }
        }

        else if(x1 > x2 && y1 < y2) {
          let numOfFieldsX = Math.abs(x1 - x2)
          let numOfFieldsY = Math.abs(y1 - y2) - 1
          for(let i = 0 ; i < numOfFieldsX ; i++) {
            const occupiedField = {
              posX: x2 + i + 1,
              posY: y2
            }
            if(!occupiedFields.includes(occupiedField)){
              occupiedFields.push(occupiedField)
            }
          }
          for(let i = 0 ; i < numOfFieldsY ; i++) {
            const occupiedField = {
              posX: x1,
              posY: y1 + i + 1
            }
            if(!occupiedFields.includes(occupiedField)){
              occupiedFields.push(occupiedField)
            }
          }
        }
      }
  }

  drawArrowLines = (drawArrowLine) => {
    let simOutputs = [];
    
    for(let i = 0 ; i < data.length ; i++) {
      simOutputs.push(data[i].outputs)
    }
    
    for(let i = 0 ; i < data.length ; i++) {
      if(simOutputs[i].length === 0) {
        return
      }
      simOutputs[i].forEach(element => {
        let posX = data[element.id - 1].x
        let posY = data[element.id - 1].y
        drawArrowLine(
          parseInt(data[i].x),
          parseInt(data[i].y),
          posX,
          posY,
          "url(#triangle)"
        )
      })
    }
  }


    // simOutputs.forEach((simOutput) => {
    //   if(simOutput.length === 0) return;
    //   else {
    //     simOutput.forEach((element, i) => {
    //       console.log(element, i)
    //     })
    //   }
    // })

    // simOutputs.forEach(simOutput => {
    //   if(simOutput.length === 0) return
    //   else {
    //     simOutput.forEach((element, i) => {
    //       let posX = data[element.id - 1].x
    //       let posY = data[element.id - 1].y
    //       drawArrowLine(
    //         parseInt(data[i].x),
    //         parseInt(data[i].y),
    //         posX,
    //         posY,
    //         "url(#triangle)"
    //       )
    //     })
    //   }
    // })
    
    // for(let i = 0 ; i < data.length ; i++) {
    //   if(simOutputs[i].length === 0) {
    //     return
    //   }
    //   simOutputs[i].forEach(element => {
    //     let posX = data[element.id - 1].x
    //     let posY = data[element.id - 1].y
    //     drawArrowLine(
    //       parseInt(data[i].x),
    //       parseInt(data[i].y),
    //       posX,
    //       posY,
    //       "url(#triangle)"
    //     )
    //   })
    // }
  

  // APPEND BUFFER AND STATION NAMES
  createTextData()
  drawResources(drawResource, drawNoResource)
  
  // DRAW AXES
  drawVerticalAxis(h, xAxisBottom);
  drawVerticalAxis(0, xAxisTop);
  drawHorizontalAxis(0, yAxisLeft);
  drawHorizontalAxis(w, yAxisRight);

  // DRAW MAIN GRID LINES
  const xGridLines = prepareGridLinesHorizontal(-h, 10);
  const yGridLines = prepareGridLinesVertical(-w, 20);

  // DRAW MINOR GRID LINES
  const yGridLinesMin = prepareGridLinesHorizontal(-h, 100);
  const xGridLinesMin = prepareGridLinesVertical(-w, 100);

  // APPEND GRID LINES
  appendGridLines("main-grid", yGridLines);
  appendGridLines("main-grid", xGridLines);
  // appendGridLines("minor-grid", yGridLinesMin);
  // appendGridLines("minor-grid", xGridLinesMin);

  // FIND WORKSTATIONS AND DRAW THEM
  drawWorkStations(drawWorkStation, drawProgressBar)
  drawBuffers(drawBuffer)

  // ADD EVENT LISTENERS TO FIGURES AND SHOW ELEMENT NAME ASSIGNED BY ID
  
  let stationRect = d3.selectAll(".StationRect")
  stationRect
  .on("click", function(d) {
    console.log(this.id)
    if(this.id.slice(0,3) === "wor") {
      const id = parseInt(this.id.slice(12,99))
      for(let i = 0 ; i < handlers.length ; i++) {
        const handlersCallback = handlers[i][2]
        if(handlers[i][1] === id && handlers[i][0] === "workstation") {
          handlersCallback()
        }
      }
    } else {
      const id = parseInt(this.id.slice(7,99))
      for(let i = 0 ; i < handlers.length ; i++) {
        const handlersCallback = handlers[i][2]
        if(handlers[i][1] === id && handlers[i][0] === "buffer") {
          handlersCallback()
        }
      }
    }
  })

  let bufferRect = d3.selectAll(".BufferRect")
  bufferRect
  .on("click", function(d) {
    console.log(this.id)
    if(this.id.slice(0,3) === "wor") {
      const id = parseInt(this.id.slice(12,99))
      for(let i = 0 ; i < handlers.length ; i++) {
        const handlersCallback = handlers[i][2]
        if(handlers[i][1] === id && handlers[i][0] === "workstation") {
          handlersCallback()
        }
      }
    } else {
      const id = parseInt(this.id.slice(7,99))
      for(let i = 0 ; i < handlers.length ; i++) {
        const handlersCallback = handlers[i][2]
        if(handlers[i][1] === id && handlers[i][0] === "buffer") {
          handlersCallback()
        }
      }
    }
  })

  // DRAW LINES CONNECTING EACH ELEMENT
  drawArrowLines(drawArrowLine)
}

// UI
let isStarted = false;
onClick("start", () => {
  initScen();

  initSim();
  showInfo();
  
  setButtonLabel("setup-produce", SETUP_LABEL);
  setButtonState("setup-produce", true);
  setButtonState("buy", true);
  setButtonState("tick", true);
  /* It would be enough to do it only once (the spec doesn't change). */
  
  let sim = edua.newSim(scen);
  refreshSim("container", "parent-container");
  draw("container", handlers, edua.info(sim), edua.visInfo(sim))
  console.log(edua.info(sim))
});

onClick("buy", () => {
  // is the buy action ready?
  let ready_actions = edua.readyActions(sim);
  if ( ! ready_actions.includes(1) )
    return;
  let [result, new_sim] = edua.execAction(sim, 1);
  if ( result !== true ) // very, very strange!
    return;
  sim = new_sim;
  showInfo();

  // disable the buy button, when not enough money
  let info = edua.info(sim);
  if ( getMoney(info) < 10 )
    setButtonState("buy", false);

  // enable the produce button, when workstation is idle
  if ( getWorkstationProperty(info, 1, "status") === "idle" ) {
    setButtonState("setup-produce", true);
  }
  refreshSim("container", "parent-container")
  draw("container", handlers, edua.info(sim), edua.visInfo(sim))
  console.log(edua.info(sim))
});

onClick("sell", () => {
  let info = edua.info(sim);

  if ( getProductQty(info) < 1 ) {
    setButtonState("sell", false);
    return;
  }

  // move the product to the buffer 3
  let [result, new_sim] = edua.transfer(sim, 2, 2, 1);
  if ( result !== true )
    throw "Couldn't move product to buffer 3!";

  sim = new_sim;

  [result, sim] = edua.execAction(sim, 2);
  if ( result !== true )
    throw "Couldn't sell the product!";

  info = edua.info(sim);
  if ( getProductQty(info) < 1 ) {
    setButtonState("sell", false);
  }

  if ( getMoney(info) >= 10 ) {
    setButtonState("buy", true);
  }

  showInfo();
  refreshSim("container", "parent-container")
  draw("container", handlers, edua.info(sim), edua.visInfo(sim))
  console.log(edua.info(sim))
});

onClick("setup-produce", () => {
  let info = edua.info(sim);
  let st = getWorkstationProperty(info, 1, "status");
  let result = null;
  let new_sim = null;

  switch (st) {
    case "not ready":
      // is the mode ready? (it should be...)
      result = edua.readyModes(sim, 1);
      if ( ! result.includes(1) )
        throw "The mode is not ready!";
    
      // assign the resource
      [result, sim] = edua.assignResource(sim, 1, 1, 1);
      if ( result == false )
        throw "Cannot assign the resource!";
    
      // start the mode
      [result, sim] = edua.startMode(sim, 1, 1);
      if ( result == false )
        throw "Cannot start the mode!";
    
      showInfo();
      setButtonState("setup-produce", false);

      break;

    case "idle":
      // is there a raw material in buffer 1?
      if ( getRawQty(info) < 1 ) {
        setButtonState("setup-produce", false);
        return;
      }

      // move the raw material to the buffer 2
      [result, new_sim] = edua.transfer(sim, 1, 1, 1);
      sim = new_sim;
      if ( result !== true )
        throw "Couldn't transfer the raw material!";

      // start the operation
      [result, new_sim] = edua.startOperation(sim, 1, 1);
      sim = new_sim;
      if ( result !== true )
        throw "Couldn't start the operation!";

      showInfo();
      setButtonState("setup-produce", false);

      break;

    default:
      setButtonState("setup-produce", false);
  };
  refreshSim("container", "parent-container")
  draw("container", handlers, edua.info(sim), edua.visInfo(sim))
  console.log(edua.info(sim))
});

onClick("tick", () => {
  sim = edua.tick(sim);

  showInfo();

  let info = edua.info(sim);
  let st = getWorkstationProperty(info, 1, "status");
  if ( st === "idle" ) {
    setButtonLabel("setup-produce", PRODUCE_LABEL);
  }

  if ( (getRawQty(info) > 0) && (st === "idle") ) {
    setButtonState("setup-produce", true);
  }

  if ( getProductQty(info) > 0 ) {
    setButtonState("sell", true);
  }
  refreshSim("container", "parent-container")
  draw("container", handlers, edua.info(sim), edua.visInfo(sim))
  // console.log(edua.info(sim))
});

// the initial state of buttons
setButtonState("start", true);
setButtonState("buy", false);
setButtonState("setup-produce", false);
setButtonState("sell", false);
setButtonState("tick", false);
setButtonLabel("setup-produce", SETUP_LABEL);
