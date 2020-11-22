
// var lasso_items;

function drawEnhancedScatterPlot(div, projection, encoding){

    if(d3.select("#" + div))d3.select("#" + div).select("svg").remove();

    // console.log((encodings.indexOf(encoding) > 6) ? "cat" : "ord")

    //Functions for calculating the x and y position in the scatter plot
    var x = function(d){ return d * width * 0.9 + 0.05*width;}// * width/2 * 0.9 + width/2; };
    var y = function(d){ return d * height * 0.9 + 0.05*height;}// * -(height/2 * 0.9) + height/2; };

    var x_selected = function(d, form, center){
        return d - ((d - width/2) - (d - center) * form)
    }

    var y_selected = function(d, form, center){
        return d - ((d - height/2) - (d - center) * form)
    }

    var radius = function(start, index){
      if(start === 'new' || selectedCompounds.includes(index)) {return 7;}
        else {return 3.5;}
    }

    // var color = d3v3.scale.category10();
    var color = function(num, pos, start){
      if(start === 'new') return colours[4];
      if(encodings.indexOf(encoding) < 7 && encodings.indexOf(encoding) > 1){
        //ordinal values
        let where = num / topEncodings[encodings.indexOf(encoding)];
        //correlations can be negative
        if(where < 0) where = (where + 1)/2;
        return d3.color("rgb(" + Math.round (0 * where + 213 * (1-where)) + ", " 
                               + Math.round (114 * where + 94 * (1-where)) + ", " 
                               + Math.round (178 * where + 0 * (1-where)) + ")");
      } else if(encodings.indexOf(encoding) == 8){
        //Follows Lipinsky ro5
        return (num == 'TRUE') ? colours[3] : colours[6];
        
      } else if(encodings.indexOf(encoding) > 6){
        //categorical values
        //zero usually means
        let theseColors = [colours[6], colours[3], colours[2]]
        return theseColors[num];
      } else {
        //fucking correlations
        // console.log(pos)
        let where = pos / topEncodings[encodings.indexOf(encoding)];
        //correlations can be negative
        // if(where < 0) where = (where + 1)/2;
        return d3.color("rgb(" + Math.round (0 * where + 213 * (1-where)) + ", " 
                               + Math.round (114 * where + 94 * (1-where)) + ", " 
                               + Math.round (178 * where + 0 * (1-where)) + ")");
      }
    }

    // Lasso functions to execute while lassoing
    let lasso_start = function() {
      lasso.items().each(function(d) {
          d3.select(this).attr('r',3.5);
          d3.select(this).styles({
                stroke: d3.select(this).style('fill'),
                "stroke-width": 2,
                fill: null//(d3.select(this).attr("tag") == "diff") ? 'black' : "#1bc2a2"
              })
          d3.select(this).classed({"not_possible":true,"selected":false});
        })
        
        // .attr("r",3.5) // reset size
        // .style("stroke", d3.select(this).style("fill"))
        // .style("stroke-width", 1)
        // .style("fill",null) // clear all of the fills
        lasso.items().classed({"not_possible":true,"selected":false}); // style as not possible
    };

    let lasso_draw = function() {
      // Style the possible dots
      lasso.items().filter(function(d) {return d.possible===true})
        .classed({"not_possible":false,"possible":true});

      // Style the not possible dot
      lasso.items().filter(function(d) {return d.possible===false})
        .classed({"not_possible":true,"possible":false});
    };

    let lasso_end = function() {
      // lasso_items = lasso.items();
      // console.log(lasso_items)
      // Reset the color of all dots
      lasso.items()
         .style("fill", function(d) { return color(d[encoding], d[projection.split('_')[0]+'_'+encoding], d['Molecule_ChEMBL_ID'].substring(0, 3)) });

      // Style the selected dots
      lasso.items().filter(function(d) {return d.selected===true})
        .classed({"not_possible":false,"possible":false})
        .attr("r",7);

      // Reset the style of the not selected dots
      lasso.items().filter(function(d) {return d.selected===false})
        .classed({"not_possible":false,"possible":false})
        .attr("r",3.5)
        .style('stroke', 'black')
        .style("stroke-width", 1);

      //Add all selected items into the array of selected compounds
      selectedCompounds = [];
      for (let item of lasso.items().filter(function(d) {return d.selected===true})[0]){
        // console.log(item.id)
        selectedCompounds.push(parseInt(item.id.split('_')[1]));
      }

      //Deal with the selection of compounds - all the views
      lineUpSelection = selectedCompounds;
      lineup.setSelection(lineUpSelection);

    };

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
          width = d3.select("#" + div).node().clientWidth;
          height = width;

    var thisCanvas;

    //Decide whether it is a main scatter plot in the front row, or it should register a new one
    if(div == 'mainMiddle'){
      if(mainScatterCanvas) mainScatterCanvas.remove();
      thisCanvas = d3v3.select("#" + div).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
      mainScatterCanvas = thisCanvas;

    } else {
      let thisRegisteredCanvas = scatterCanvases.find(el => el.div == div);
      if(thisRegisteredCanvas) {
        thisRegisteredCanvas.canvas.remove();
        scatterCanvases.pop(thisRegisteredCanvas);
      }
      thisCanvas = d3v3.select("#" + div).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
      scatterCanvases.push({div: div, canvas: thisCanvas, projection: projection, encoding: encoding})
    }

    //prepare hexes for any of those two projections, if they are missing
    if(!hexes[projections.indexOf(projection)]) {
      hexes[projections.indexOf(projection)] = [];
      calculateHexesForProjection(div, projection);
    }

    // Create the area where the lasso event can be triggered
    let lasso_area = thisCanvas.append("rect")
                          .attr("width",width)
                          .attr("height",height)
                          .style("opacity",0);

    // Define the lasso
    let lasso = d3v3.lasso()
          .closePathDistance(75) // max distance for the lasso loop to be closed
          .closePathSelect(true) // can items be selected by closing the path?
          .hoverSelect(true) // can items by selected by hovering over them?
          .area(lasso_area) // area where the lasso can be started
          .on("start",lasso_start) // lasso start function
          .on("draw",lasso_draw) // lasso draw function
          .on("end",lasso_end); // lasso end function

    // Init the lasso on the svg:g that contains the dots
    if(div == 'mainMiddle')thisCanvas.call(lasso);

    if(selectedHexes.size == 0 || div !== 'mainMiddle') {

        //Draw all the compounds and all the hexes
        hex_drawHexesIntoScatterPlot(thisCanvas, projection)

        thisCanvas.selectAll(".dot")
              .data(data)
            .enter().append("circle")
              .attr("id",function(d,i) {return "dot_" + i;}) // added
              .attr("class", "dot dot" + div)
              .attr("r", function(d, i) { return radius(d['Molecule_ChEMBL_ID'].substring(0, 3), i)})
              .attr("stroke", 'black')
              .attr("cx", function(d) { return x(d[projection + 'x']); })
              .attr("cy", function(d) { return y(d[projection + 'y']); })
              .style("fill", function(d) { return color(d[encoding], d[projection.split('_')[0]+'_'+encoding], d['Molecule_ChEMBL_ID'].substring(0, 3)); });

        lasso.items(thisCanvas.selectAll(".dot" + div));
          
    } else {

        //Define which are the extreme boundaries from selected bins
        var xbottom = 9999, xtop = -9999, ybottom = 9999, ytop = -9999;


        //calculate how to move the selected hexes to the center and proportionally scale them
        for (let hexId of selectedHexes) {
          let thisHex = hexes[projections.indexOf(projection)].find(obj => {return obj.id === hexId})
          if(xbottom > thisHex.x - thisHex.radius) xbottom = thisHex.x - thisHex.radius;
          if(xtop < thisHex.x + thisHex.radius) xtop = thisHex.x + thisHex.radius; 
          if(ybottom > thisHex.y - thisHex.offset) ybottom = thisHex.y - thisHex.offset;
          if(ytop < thisHex.y + thisHex.offset) ytop = thisHex.y + thisHex.offset;
        }
        let xcenter = xtop - (xtop-xbottom)/2;
        let ycenter = ytop - (ytop-ybottom)/2;
        //console.log("Constrains of selected hexes: " + xbottom + ", " + xtop + ", " + ybottom + ", " + ytop)

        //how much are we gonna scale the distances between compounds and hexes in zoomed view
        let magnitudeFactor = Math.max(xtop - xbottom, ytop - ybottom);
        magnitudeFactor = width/magnitudeFactor;

        //first, let's draw hexes on the background
        for (let hexId of selectedHexes) {
          // console.log(hexId)
          let thisHex = hexes[projections.indexOf(projection)].find(obj => {return obj.id === hexId})

          //calculate new center position
          let newHexX = thisHex.x - ((thisHex.x - width/2) - (thisHex.x - xcenter) * magnitudeFactor)
          let newHexY = thisHex.y - ((thisHex.y - height/2) - (thisHex.y - ycenter) * magnitudeFactor)

          drawHex(thisCanvas, projection, hexId, "background", newHexX, newHexY, thisHex.radius * magnitudeFactor, thisHex.offset * magnitudeFactor, 1.0, 'white', 3);

        }

        //reset the selected data dataset
        selectedData = [];

        //then calculate the new positions of the compounds and draw them as well
        for (let hexId of selectedHexes) {

          //I know this is redundant but I don't know any better
          let thisHex = hexes[projections.indexOf(projection)].find(obj => {return obj.id === hexId})

          //just from the compounds from selected hexes
          for (let comp of thisHex.compounds) {

            selectedData.push(data[parseInt(comp)]);

            thisCanvas.selectAll(".dot")
                  .data(selectedData)
                .enter().append("circle")
                  .attr("id",function(d) {return "dot_" + comp;})
                  .attr("class", "dot dot" + div)
                  .attr("r", function(d) { return radius(d['Molecule_ChEMBL_ID'].substring(0, 3), comp)})
                  .attr("cx", function(d) { return x_selected(x(d[projection + 'x']), magnitudeFactor, xcenter); })
                  .attr("cy", function(d) { return y_selected(y(d[projection + 'y']), magnitudeFactor, ycenter); })
                  .style("fill", function(d) { return color(d[encoding], d[projection.split('_')[0]+'_'+encoding], d['Molecule_ChEMBL_ID'].substring(0, 3)); });

            lasso.items(thisCanvas.selectAll(".dot" + div));

          }
        }
      }

    //drawLegend();
    if(encodings.indexOf(encoding) < 7){
      // var colors = [ 'rgb(0,114,178)', 'rgb(213,94,0)' ];

      // var svg = thisCanvas
      //   .append('svg')
      //   .attr('x', 10)
      //   .attr('y', width-10)
      //   .attr('width', 100)
      //   .attr('height', 30);

      // var grad = svg.append('defs')
      //   .append('linearGradient')
      //   .attr('id', 'grad')
      //   .attr('x1', '0%')
      //   .attr('x2', '100%')
      //   .attr('y1', '0%')
      //   .attr('y2', '0%');

      // grad.selectAll('stop')
      //   .data(colors)
      //   .enter()
      //   .append('stop')
      //   .style('stop-color', function(d){ return d; })
      //   .attr('offset', function(d,i){
      //     return 100 * (i / (colors.length - 1)) + '%';
      //   })

      // svg.append('rect')
      //   .attr('width', 100)
      //   .attr('height', 30)
      //   .style('fill', 'url(#grad)');

      // svg.append("text")
      // .attr("x", 0)
      // .attr("y", 7)
      // .attr("dy", ".25em")
      // .style("font-size", "12px")
      // .style("fill", "white")
      // .text("high__________low");

      var svg = thisCanvas
        .append('svg')
        .attr('x', 10)
        .attr('y', width-30)
        .attr('width', 100)
        .attr('height', 100);

      svg.append("circle")
        .attr("class", "dot dot" + div)
        .attr("r", 3.5)
        .attr("stroke", 'black')
        .attr("cx", 5)
        .attr("cy", 15)
        .style("fill", colours[5]);
      svg.append("text")
        .attr("x", 12.5)
        .attr("y", 17.5)
        // .attr("dy", ".25em")
        .style("font-size", "10px")
        .style("fill", "black")
        .text("high");

      svg.append("circle")
        .attr("class", "dot dot" + div)
        .attr("r", 3.5)
        .attr("stroke", 'black')
        .attr("cx", 5)
        .attr("cy", 25)
        .style("fill", colours[6]);
      svg.append("text")
        .attr("x", 12.5)
        .attr("y", 27.5)
        // .attr("dy", ".25em")
        .style("font-size", "10px")
        .style("fill", "black")
        .text("low");

    } else {

      var svg = thisCanvas
        .append('svg')
        .attr('x', 10)
        .attr('y', width-30)
        .attr('width', 100)
        .attr('height', 100);

      svg.append("circle")
        .attr("class", "dot dot" + div)
        .attr("r", 3.5)
        .attr("stroke", 'black')
        .attr("cx", 5)
        .attr("cy", 5)
        .style("fill", colours[3]);
      
      svg.append("text")
        .attr("x", 12.5)
        .attr("y", 7.5)
        // .attr("dy", ".25em")
        .style("font-size", "10px")
        .style("fill", "black")
        .text("moderately active");

      svg.append("circle")
        .attr("class", "dot dot" + div)
        .attr("r", 3.5)
        .attr("stroke", 'black')
        .attr("cx", 5)
        .attr("cy", 15)
        .style("fill", colours[2]);
      svg.append("text")
        .attr("x", 12.5)
        .attr("y", 17.5)
        // .attr("dy", ".25em")
        .style("font-size", "10px")
        .style("fill", "black")
        .text("active");

      svg.append("circle")
        .attr("class", "dot dot" + div)
        .attr("r", 3.5)
        .attr("stroke", 'black')
        .attr("cx", 5)
        .attr("cy", 25)
        .style("fill", colours[6]);
      svg.append("text")
        .attr("x", 12.5)
        .attr("y", 27.5)
        // .attr("dy", ".25em")
        .style("font-size", "10px")
        .style("fill", "black")
        .text("inactive");

    }

      
    // if(encodings.indexOf(encoding) < 7 && encodings.indexOf(encoding) > 1){
    //     //ordinal values
    //     // let where = num / topEncodings[encodings.indexOf(encoding)];
    //     // //correlations can be negative
    //     // if(where < 0) where = (where + 1)/2;
    //     // return d3.color("rgb(" + Math.round (0 * where + 213 * (1-where)) + ", " 
    //     //                        + Math.round (114 * where + 94 * (1-where)) + ", " 
    //     //                        + Math.round (178 * where + 0 * (1-where)) + ")");



    // } else if(encodings.indexOf(encoding) == 8){
    //   //Follows Lipinsky ro5
    //   return (num == 'TRUE') ? colours[3] : colours[6];
      
    // } else if(encodings.indexOf(encoding) > 6){
    //   //categorical values
    //   //zero usually means
    //   let theseColors = [colours[6], colours[3], colours[2]]
    //   return theseColors[num];
    // } else {
    //   //fucking correlations
    //   // console.log(pos)
    //   let where = pos / topEncodings[encodings.indexOf(encoding)];
    //   //correlations can be negative
    //   // if(where < 0) where = (where + 1)/2;
    //   return d3.color("rgb(" + Math.round (0 * where + 213 * (1-where)) + ", " 
    //                          + Math.round (114 * where + 94 * (1-where)) + ", " 
    //                          + Math.round (178 * where + 0 * (1-where)) + ")");
    // }

}