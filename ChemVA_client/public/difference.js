
//Function for drawing difference view in the selected div
function drawDifferenceView(div, proj1, proj2){

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
          width = d3.select("#" + div).node().clientWidth;
          height = width;

    var thisCanvas;

	let thisRegisteredCanvas = differenceCanvases.find(el => el.div == div);
	if(thisRegisteredCanvas) {
		thisRegisteredCanvas.canvas.remove();
		differenceCanvases.pop(thisRegisteredCanvas);
	}
	thisCanvas = d3v3.select("#" + div).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);
	differenceCanvases.push({div: div, canvas: thisCanvas, projection1: proj1, projection2: proj2})

	let encodingString = proj1.split('_')[0] + '_' + encodings[1];
	// console.log(encodingString)

	//prepare hexes for any of those two projections, if they are missing
	if(!hexes[projections.indexOf(proj1)]) {
		hexes[projections.indexOf(proj1)] = [];
		calculateHexesForProjection(div, proj1);
	}

	if(!hexes[projections.indexOf(proj2)]) {
		hexes[projections.indexOf(proj2)] = [];
		calculateHexesForProjection(div, proj2);
	}

	hex_drawHexesIntoDiffPlot(thisCanvas, proj1, encodingString, proj2)

	// hex_drawHexesIntoDiffPlot(thisCanvas, proj2, encodingString)
	// hex_drawHexView(0.07, div, proj1)

	// hex_drawHexView(0.07, div, proj1);
	//hex_drawHexView(0.07, div, proj2);
	
}


//Function for filling hexes of input projection with corresponding compounds and assesing projection hex to compound in data array
function calculateHexesForProjection(div, projection){
	
	width = d3.select("#" + div).node().clientWidth;
    height = width;

	let rad = hexSize;
    let radius = width * rad;
    let offset = Math.sqrt((3*radius*radius)/4);
    // console.log("radius: " + radius + "  offset: " + offset)

    // selectedHexes = new Set();
    let numOfHexes = 0;

    //console.log(projection)

    if(!hexes[projections.indexOf(projection)]) {
		hexes[projections.indexOf(projection)] = [];
	}

	function fabricateHex(){
		//calculate whether hex should be even printed
			// let thisHex = createHexInHexView(thisCanvas, projection, numOfHexes++, i, j, radius, offset);	
			let values = processCompoundsInBins(++numOfHexes, projection, i, j, radius, offset);	
			if (values[0] > 0) {
				var thisHex = {
							id : 'hex-' + numOfHexes,
							x : i,
							y : j,
							radius : radius, 
							offset : offset,
							numOfComp : values[0],
							compounds : values[2],
							containsNew : values[3]
						}
				hexes[projections.indexOf(projection)].push(thisHex);
			}
			// let values = processCompoundsInBins(id, projection, x, y, radius, offset);
	}

    //even rows of hexs 
	for (var i = 0; i <= width; i+=3*radius) {
		for (var j = -offset; j <= height; j+=2*offset) {

			fabricateHex();		
		}
	}
	//odd rows of hexs
	for (var i = -1.5*radius; i <= width; i+=3*radius) {
		for (var j = 0; j <= height; j+=2*offset) {

			fabricateHex();	
		}
	}
}