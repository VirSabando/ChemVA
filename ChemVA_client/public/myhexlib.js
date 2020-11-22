var mouseIsDown = false;
var mouseIsSelecting = false;

//function for creating a svg hexagon
//tag can be [hex, scatter, diff]
function drawHex(canvas, projection, id, tag, center_x, center_y, radius, px, opacity, hue, stroke, projection2) {
	//I need to draw six points with same distance from the center
	// let px = Math.sqrt((3*radius*radius)/4);

	//let's start with the definition of the endocings


	//Formula for drawing one hex
	poly = [{"x":center_x+radius, "y":center_y},
        {"x":center_x+radius/2,"y":center_y-px},
        {"x":center_x-radius/2,"y":center_y-px},
        {"x":center_x-radius,"y":center_y},
        {"x":center_x-radius/2,"y":center_y+px},
        {"x":center_x+radius/2,"y":center_y+px}];



	var hex = canvas.append("polygon")
	  	.data([poly])
	    .attr("points",function(d) { 
	        return d.map(function(d) {
	            return [d.x,d.y].join(",");
	        }).join(" ");
	    })
	    // .attr("transform", function(d) { return "translate(" + d + ")"; })
	    .attr('id', (isNaN(id)) ? id : ("hex-" + id))
	    .attr('class', 'hex')
	    .attr('tag', tag)
	    .attr('projection', projection)
	    .attr('hue', hue)
	    .style("fill",hue)
	    .attr("stroke",(selectedHexes.has("hex-" + id) && tag === 'hex') ? "red" : "gray")
	    .attr("stroke-width",(selectedHexes.has("hex-" + id) && tag === 'hex') ? 4 : stroke)
	    .attr('opacity', opacity)
	    .attr('fill-opacity', (hue === 'white') ? 0.2 : opacity)
	    .on("mousedown", function(){

	        mouseIsDown = true;
	        if(selectedHexes.has(d3.select(this).attr('id'))) {mouseIsSelecting = false;}
	        else {mouseIsSelecting = true}

	    	if(tag == 'diff' || tag === 'diffhexShade'){
	    		d3.selectAll("#diffhex").remove()
	    		d3.selectAll("#diffhexShade").remove()
	    	}

	    })
	    .on("mousemove", function(){
	        if(mouseIsDown) {
	        	if(tag === 'hex'){
		        	if(mouseIsSelecting){
		        		// if(!selectedHexes.has(d3.select(this))) {

		        		// }
			            // d3.selectAll("#" + d3.select(this).attr("id")).attrs({
			            d3.select(this).attrs({
			              // "fill", "orange"
			              stroke: "red",
			              "stroke-width": 4
			            });
			            selectedHexes.add(d3.select(this).attr('id'))
			        } else {
			        	d3.selectAll("#" + d3.select(this).attr("id")).attrs({
			              // "fill", "orange"
			              stroke: "grey",
			              "stroke-width": 1
			            });
			            selectedHexes.delete(d3.select(this).attr('id'))
			        }	
			    }        
		    }

		    //now this is a little bit tricky
	    	//For the difference graph, if you would click on one of the hexes,it will get all the compounds in it
	    	//and scatter them in their positions in the second projection
	    	if(tag == 'diff' && mouseIsDown){

	    		if(mouseIsSelecting){
			    	drawHex(canvas, projection, "diffhexShade", "diffhexShade", center_x, center_y, radius, px, 0.5, 'black', stroke, projection2)
			    }
	    	
	    		// drawHex(canvas, projection, 'kokot', 'turbo', 100, 100, )
	    		let thisHex = hexes[projections.indexOf(projection)].find(obj => {return obj.id === id});
	    		let newHexesss = [];
	    		// console.log(thisHex)
	    		for(let comp of thisHex.compounds) {
	    			// console.log(comp + "    " + data[comp][projection2])
	    			if(newHexesss[data[comp][projection2]]) {newHexesss[data[comp][projection2]]++;}
	    			else {newHexesss[data[comp][projection2]] = 1};
	    		}
	    		// console.log(newHexesss)
	    		//newHexesss is a scarse array, where 
	    		//index is the id of newHex and value is num of compounds fitting there
	    		for(let newHex in newHexesss){
	    			// console.log(newHex + "   " + newHexesss[newHex])
	    			let newHexInProj2 = hexes[projections.indexOf(projection2)].find(obj => {return obj.id === ("hex-" + newHex)})
	    			// console.log(newHexInProj2)
	    			let radiusss = hexSize*newHexesss[newHex]/thisHex.numOfComp * canvas.node().clientWidth;
	    			let offsetusss = Math.sqrt((3*radiusss*radiusss)/4);
	    			drawHex(canvas, projection, "diffhex", "diffhex", newHexInProj2.x, newHexInProj2.y, radiusss, offsetusss, 0.9, 'black', stroke, projection2)
	    		}
	    	}
	     })
	    .on("mouseup", function(){
	        mouseIsDown = false;
	        //scattercanvas.remove();
	        // hex_drawScatterPlot("fucker");
	        if(canvas === mainHexCanvas) drawEnhancedScatterPlot("mainMiddle", projection, mainScatterEncoding);

	        //Deal with the selection of hexes - just LineUp correction
	        //dealWithTheSelection();
	        lineupData = [];
	        for(let hex of selectedHexes){
	        	for (let comp of hexes[projections.indexOf(projection)].find(obj => {return obj.id === hex}).compounds){
	        		lineupData.push(data[comp])
	        	}
	        }
	        if(lineupData.length !== 0) {
	        	//So lineup listener would think it was again selected from the zoomed scatter
	        	lineUpSelection = selectedCompounds;
	        	if(tag == 'hex') createLineUp('lineup', lineupData);
	        }
	        else { if(tag == 'hex') createLineUp('lineup', data);}

	        //The hex in hex view remained highlighted, so we need to get rid of that as well.. :-/ 
	        if(d3.select(this).attr("tag") === "background") {
	        	d3.selectAll("#" + d3.select(this).attr("id"))
					.each(function(d) {
						d3.select(this).styles({
							fill : (d3.select(this).attr("tag") == "bioactive") ? d3.select(this).attr("hue") : "white"
						})
				})
	        }
	    })
	    //highlight on hover
	    .on("mouseover", function(){
	    	// console.log("Hovering over this hex: " + d3.select(this).attr("id"));
	    	if(tag === 'hex' || tag === 'scatter' || tag === 'diff'){
		    	d3.selectAll("#" + d3.select(this).attr("id"))
		    		.each(function(d) {
		    			if(d3.select(this).attr('projection') == projection){
							d3.select(this).styles({
								fill: (d3.select(this).attr("tag") == "diff") ? 'black' : colours[3]
							})
						}

					})
		    }
	    })
	    //aaaaand return back to the previous state
		.on('mouseout', function(){
			if(tag === 'hex' || tag === 'scatter' || tag === 'diff'){
				d3.selectAll("#" + d3.select(this).attr("id"))
					.each(function(d) {
						d3.select(this).styles({
							fill : (d3.select(this).attr("tag") == "hex" || d3.select(this).attr("tag") == "diff") ? d3.select(this).attr("hue") : "white"
						})
					})
			}
	    });

	return hex;
}

//Function for finding out if a point is in a triangle
function ptInTriangle(p, p0, p1, p2) {
    var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    var sign = A < 0 ? -1 : 1;
    var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
    var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
    
    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}

//Function for calculating which compounds belong to a hex on pos x and y with given power radius
function processCompoundsInBins(id, projection, x, y, radius, offset, encoding){
	
	let num = 0;
	let bioPos = 0.;
	let compounds = [];

	let includesNewCompound = false;

	var width = mainHexCanvas.node().clientWidth;
	let height = mainHexCanvas.node().clientHeight

	// const slope = (radius/2)/offset; //always 0.5773502691896257 in hexagon
	// var radius_pow = radius * radius;
	
	//For simplicity, let's iterate over all the compunds
	//For the future, some optimalization would be appreciated - sorting of compounds into bins and comparing only suitable bins
	for (var i = 0; i < data.length; i++) {
		let x_pos = data[i][projection + 'x'] * width * 0.9 + 0.05*width;
		let y_pos = data[i][projection + 'y'] * height * 0.9 + 0.05*height;
		// let x_diff = x_pos - x;
		// let y_diff = y_pos - y;

		function resolvePointInHex(i){
			if(data[i].Molecule_ChEMBL_ID.substring(0, 3) === 'new') {
				if(projection == projections[2]){
					alert("Unable to compute projection for Molecular Descriptors.\nPlease try different projection.");
					return;
				}
				includesNewCompound = true;
			}
			num++;
			if(projection === mainProjection) data[i].hex = id;
			data[i][projection] = id;
			if(data[i][mainHexEncoding] != 0) bioPos++;
			compounds.push(i);
		}

		//Easiest solution with two multiplications
		// if( x_diff * x_diff + 
		// 	y_diff * y_diff <
		// 	radius_pow) {
		// 	resolvePointInHex();
		// }

		//Fuck this I will deal with that later
		//Quick test to test the very far ones
		if(x_pos < x-radius || x_pos > x+radius || y_pos < y-offset || y_pos > y+offset) continue;

		// console.log("Point pos: " + x_pos + " Hex pos: " + x + " Diff: " + x_diff + " Radius: " + radius + " Offset: " + offset); 

		if( x_pos > x-radius/2 && x_pos < x+radius/2 && y_pos > y-offset && y_pos < y+offset) {resolvePointInHex(i)} 
		else {
			//same thing but less comparing for special cases of hexagon sides
			let thisPoint = { x: x_pos, y: y_pos };
			//Up Left
			let p0 = { x: x-radius/2, y: y };
			let p1 = { x: x-radius/2, y: y-offset };
			let p2 = { x: x-radius, y: y };
			if(ptInTriangle(thisPoint, p0, p1, p2)) resolvePointInHex(i);
			//Down Left
			p1 = { x: x-radius/2, y: y+offset };
			if(ptInTriangle(thisPoint, p0, p1, p2)) resolvePointInHex(i);
			//Up Right
			p0 = { x: x+radius/2, y: y };
			p1 = { x: x+radius/2, y: y-offset };
			p2 = { x: x+radius, y: y };
			if(ptInTriangle(thisPoint, p0, p1, p2)) resolvePointInHex(i);
			//Down Right
			p1 = { x: x+radius/2, y: y+offset };
			if(ptInTriangle(thisPoint, p0, p1, p2)) resolvePointInHex(i);
		}

	}
	// console.log(num + "  pos: " + x + ", " + y)

	let colorEncoding = bioPos / num;

	// console.log("Biopositivity: " + bioPositivity + " and numbers " + bioPos + " " + num + " " + bioPos / num)
	return [num, colorEncoding, compounds, includesNewCompound];
}

//function for drawing hexagonal grid with hexes of certain radius
//radius can be in the range [0.03, 0.1], so it would divide the view into matrix from cca 30x30 to 10x10 
function hex_drawHexView(rad, div, projection, encoding) {

	let thisCanvas;
	let thisViewWidth = d3.select("#" + div).node().clientWidth

	//so it wouldn't fuck up scatter if there is something selected
	// selectedHexes = [];

	//Decide whether it is a main hex plot in the front row, or it should register a new one
    if(div == 'mainLeft'){
		if(mainHexCanvas)mainHexCanvas.remove()
		let thisViewWidth = d3.select("#" + div).node().clientWidth
		mainHexCanvas = d3.select("#" + div).append("svg")
									.attr("width", thisViewWidth)
									.attr("height", thisViewWidth)
      	thisCanvas = mainHexCanvas;

    } else {
      let thisRegisteredCanvas = hexCanvases.find(el => el.div == div);
      if(thisRegisteredCanvas) {
        thisRegisteredCanvas.canvas.remove();
        hexCanvases.pop(thisRegisteredCanvas);
      }
      thisCanvas = d3.select("#" + div).append("svg")
									.attr("width", thisViewWidth)
									.attr("height", thisViewWidth)
      hexCanvases.push({div: div, canvas: thisCanvas, projection: projection, encoding: encoding})
    }

	// //Reset the canvas - TODO there is probably a better method to do this
	// if(mainHexCanvas)mainHexCanvas.remove()
 //    mainHexCanvas = d3.select("#" + div).append("svg")
	// 								.attr("width", thisViewWidth)
	// 								.attr("height", thisViewWidth)
	// 						     //    .call(zoom)
								    // .on("wheel.zoom", null);
	
    let radius = thisViewWidth * rad;
    let offset = Math.sqrt((3*radius*radius)/4);
    // console.log("radius: " + radius + "  offset: " + offset)

    hexes[projections.indexOf(projection)] = [];
    // selectedHexes = new Set();
    let numOfHexes = 0;

    //even rows of hexs 
	for (var i = 0; i <= thisCanvas.node().clientWidth; i+=3*radius) {
		for (var j = -offset; j <= thisCanvas.node().clientHeight; j+=2*offset) {

			//calculate whether hex should be even printed
			let thisHex = createHexInHexView(thisCanvas, projection, numOfHexes++, i, j, radius, offset, encoding);			
			if(thisHex) hexes[projections.indexOf(projection)].push(thisHex);
		}
	}
	//odd rows of hexs
	for (var i = -1.5*radius; i <= thisCanvas.node().clientWidth; i+=3*radius) {
		for (var j = 0; j <= thisCanvas.node().clientHeight; j+=2*offset) {

			let thisHex = createHexInHexView(thisCanvas, projection, numOfHexes++, i, j, radius, offset, encoding);			
			if(thisHex) hexes[projections.indexOf(projection)].push(thisHex);
		}
	}

	highlightHexesContainingSelectedCompounds();

}

//function for calculating the properties of the hexes
//returnes an object with hex coordinations and informations
function createHexInHexView(canvas, projection, id, x, y, radius, offset, encoding){

	//this is a little bit tricky, fun processCompoundsInBins(id, ) returns an array 
	//value[0] is num of compounds that fall into hex
	//value[1] is bool whether the hex should be bioactive or not
	let values = processCompoundsInBins(id, projection, x, y, radius, offset, encoding);
	// console.log("Num of compound in a hex: " + values[0] + " is hex bioactive: " + values[1])
	if (values[0] > 0) {

		// console.log(values[1])
		// console.log(encoding)
		// console.log(encodings.indexOf(encoding))
		let color = colours[6];
		if(encodings.indexOf(encoding) > 6) color = (values[1] > 0.5) ? colours[3] : colours[6];
		if(encodings.indexOf(encoding) < 2) color = colours[6];
		let opacity = values[0]/(data.length/10) + (0.1 - hexSize) * 10;
		if(values[3]){
			color = colours[4];
			opacity = 1.0;
		}

		//For first six encodings it returns a number
		// if(!isNaN(values[1])) {
		// 	where = values[1]/topEncodings[encodings.indexOf(encoding)];
		// 	color =  d3.color("rgb(" + Math.round (255 * where + 37 * (1-where)) + ", " 
  //                              + Math.round (255 * where + 52 * (1-where)) + ", " 
  //                              + Math.round (204 * where + 148 * (1-where)) + ")");
		// }
		drawHex(canvas, projection, id, "hex", x, y, radius, offset, opacity, color, 1);

		var thisHex = {
					id : 'hex-' + id,
					x : x,
					y : y,
					radius : radius, 
					offset : offset,
					numOfComp : values[0],
					compounds : values[2]
				}
		return thisHex;
	} else {
		return false;
	}
}

//function for drawing all the filled hexes into the background of the scatterplot
function hex_drawHexesIntoScatterPlot(canvas, projection){
	for (var h of hexes[projections.indexOf(projection)]) {
		try {
			if(!(isNaN(h.x) || isNaN(h.y) || isNaN(h.radius) || isNaN(h.offset) || isNaN(h.numOfComp)))
			drawHex(canvas, projection, h.id, "scatter", h.x, h.y, h.radius, h.offset, 1.0, 'white', 1);
		} catch (e) {
			console.log("Hex " + h)
			console.log(e)
		}
	}
}

//function for drawing all the filled hexes into the background of the scatterplot
function hex_drawHexesIntoDiffPlot(canvas, projection, encoding, projection2){
	for (var h of hexes[projections.indexOf(projection)]) {
		try {
			if(!(isNaN(h.x) || isNaN(h.y) || isNaN(h.radius) || isNaN(h.offset) || isNaN(h.numOfComp))){
				let thisTransparency = 0.;
				for(let comp in h.compounds) {
					// console.log("For the hex " + h.id + ": compound num " + comp + " has correlation " + data[comp][encoding])
					thisTransparency += data[comp][encoding]
				}
				thisTransparency = (thisTransparency / h.numOfComp)
				drawHex(canvas, projection, h.id, "diff", h.x, h.y, h.radius, h.offset, thisTransparency, (h.containsNew) ? 'yellow' : colours[3], 2, projection2);
			}
		} catch (e) {
			console.log("Hex " + h)
			console.log(e)
		}
	}
}
