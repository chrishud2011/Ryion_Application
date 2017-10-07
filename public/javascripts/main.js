/**********************************************************
* Programmer: Chris Hudson
* Program: Ryion Application.
* Version: 1
* Date: 11/7/17
* Requirements: d3 library version 3.
***********************************************************/

const pipeSizes = [8,10,12,16,20,25,32,40,50,63,80,100,127,160,201,254,320,404,509,642,810,1021,1288,1624,2048,2582,3256,4106,5178,6529,8233,10382,13091,16507,20815,26248,33098,41735,52627,66361,83680,105518,133056,167780,211566,250000,300000,350000,400000,450000,500000,600000,700000,750000,800000,900000,1000000,1250000,1500000,1750000,2000000];
const valveSizes = [15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100];
const width = 1000;
const height = 1000;

/**********************************************************
* A function that returns the minimum pipe size necessary to handle a given rate
* of flow, meeting a 2% tolerance. Given a sorted array, this is the most efficient
* algorithm at O(n), especially because we expect that n to be found quickly.
* Note: If array is ever non-sorted we should implement a quicksort algorithm with
* an O(n log n) complexity. This brings our total complextiy to O(n) + O(n log n)
* = O(n). This is preferable to built in methods such as filter which have the overhead
* of iterating over an entire array and then defining an array to only return a
* single value.
*
* requirements: A sorted array of pipe sizes, from smallest to largest.
* parameter: rate of flow, number
* Returns: size of smallest allowable pipe
***********************************************************/
pipeCalculator = rate => {
  for (let minimum of pipeSizes) {
    if (((1.732 * 12.9 * 200 * rate) / (208 * minimum)) <= 0.02) {
      return minimum;
    }
  }
}

/**********************************************************
* A function that returns the minimum valve size necessary to handle a given rate
* of flow. Function is evergreen, capable of handling dynamic changes in valve sizes
* so long as array remains sorted.
*
* requirements: A sorted array of valve sizes, from smallest to largest.
* parameter: rate of flow, number
* Returns: size of smallest allowable valve
***********************************************************/
valveCalculator = rate => {
  valveSize = rate * 1.25 * 1.25;
  for (let minimum of valveSizes) {
    if (minimum >= valveSize) {
      return minimum;
    }
  }
  throw new Error ('We do not carry valve sizes large enough to accomodate flow rate');
}

/**********************************************************
* Function that returns pipe and valve sizes based on given parameters.
*
* parameters: rate of flow for x and y pipes, numbers
* returns: sizes for pipes x, y, and z and valves x and y
***********************************************************/
determineSizes = (rateX, rateY) => {
  let pipeX = pipeCalculator(rateX);
  let pipeY = pipeCalculator(rateY);
  let pipeZ = pipeCalculator(parseFloat(rateX) + parseFloat(rateY));

  let valveX = valveCalculator(rateX);
  let valveY = valveCalculator(rateY);
  return {
    pipeSizeX: pipeX,
    pipeSizeY: pipeY,
    valveSizeX: valveX,
    valveSizeY: valveY,
    pipeSizeZ: pipeZ
  }
}

/**********************************************************
*
* This section makes use of the d3 library to dynamically create svg graphics
*
***********************************************************/

//Make an SVG Container
let canvas = d3.select('body')
               .append('svg')
               .attr('width', width)
               .attr('height', height);

//Make a rectangle for the background
let back = canvas.append('rect')
                 .attr('width', 210)
                 .attr('height', 310)
                 .attr('fill', '#CCFF99')
                 .attr('x', 250)
                 .attr('y', 100);

//The next few variables hold all our pipes
let pipe1 = canvas.append("line")
                 .attr("x1", 75)
                 .attr("y1", 210)
                 .attr("x2", 400)
                 .attr("y2", 210)
                 .attr('text', "stuff")
                 .attr("stroke-width", 5)
                 .attr("stroke", "black");

let pipe2 = canvas.append("line")
                  .attr("x1", 75)
                  .attr("y1", 307.5)
                  .attr("x2", 400)
                  .attr("y2", 307.5)
                  .attr("stroke-width", 5)
                  .attr("stroke", "black");

let pipe3a = canvas.append("line")
                  .attr("x1", 398)
                  .attr("y1", 175)
                  .attr("x2", 398)
                  .attr("y2", 310)
                  .attr("stroke-width", 5)
                  .attr("stroke", "black");

let pipe3b = canvas.append("line")
                  .attr("x1", 398)
                  .attr("y1", 177.5)
                  .attr("x2", 600)
                  .attr("y2", 177.5)
                  .attr("stroke-width", 5)
                  .attr("stroke", "black");

//Get data from DOM
let compute = document.getElementById('compute');
compute.addEventListener('click', execute);

/**********************************************************
* Function that is called when button is clicked.
* Computes values for page and draws additional SVG Graphics
*
* Parameters: none
* returns: none
***********************************************************/
function execute(){
  try {
    //inputs from DOM
    let xInput = document.getElementById('xRate').value;
    let yInput = document.getElementById('yRate').value;
    let results = determineSizes(xInput, yInput);

    //clear the canvas for subsequent text inputs
    canvas.selectAll("text").remove();
    errorDisplay.innerHTML ="";
    canvas.selectAll("svg").remove();

    //The next few variables hold all dynamic text
    let pipe1Text =  canvas.append("text")
                           .attr("y", 205)
                           .attr("x", 150)
                           .attr('text-anchor', 'middle')
                           .attr("class", "myLabel")
                           .text("Pipe Size: " + results.pipeSizeX);

    let pipe2Text =  canvas.append("text")
                           .attr("y", 302.5)
                           .attr("x", 150)
                           .attr('text-anchor', 'middle')
                           .attr("class", "myLabel")
                           .text("Pipe Size: " + results.pipeSizeY);

    let pipe3Text =  canvas.append("text")
                           .attr("y", 172.5)
                           .attr("x", 525)
                           .attr('text-anchor', 'middle')
                           .attr("class", "myLabel")
                           .text("Pipe Size: " + results.pipeSizeZ);

    let valve1Text =  canvas.append("text")
                            .attr("y", 205)
                            .attr("x", 310)
                            .attr('text-anchor', 'middle')
                            .attr("class", "myLabel")
                            .text("Valve Size: ");

    let valve2Text =  canvas.append("text")
                            .attr("y", 302.5)
                            .attr("x", 310)
                            .attr('text-anchor', 'middle')
                            .attr("class", "myLabel")
                            .text("Valve Size: ");

    //Create Variables to hold dynamic valve SVG's
    let gauge1 = loadLiquidFillGauge("fillgauge1", results.valveSizeX, 100, 200, 332, 104);
    let gauge2 = loadLiquidFillGauge("fillgauge2", results.valveSizeY, 200, 300, 282, 153);
  }
  catch(err) {
    errorDisplay.innerHTML = err.message;
  }
}



/**********************************************************
* note: The following code has been altered extensively to make it compatible with this
* program, Ryion Application.
*
* All Code following this is used via open source license under BSD 2-clause
* (http://choosealicense.com/licenses/bsd-2-clause/)
* Copyright (c) 2015, Curtis Bratton
* All rights reserved.
*
* Liquid Fill Gauge v1.1
***********************************************************/
function liquidFillGaugeDefaultSettings(){
    return {
        minValue: 15, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.
        circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        circleColor: "#178BCA", // The color of the outer circle.
        waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 1, // The number of full waves per width of the wave circle.
        waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveAnimateTime: 2000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveColor: "#178BCA", // The color of the fill wave.
        waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        textVertPosition: .65, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
        displayPercent: true, // If true, a % symbol is displayed after the value.
        textColor: "#045681", // The color of the value text when the wave does not overlap it.
        waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
    };
}

function loadLiquidFillGauge(elementId, value, width, height, xCoord, yCoord, config) {
    if(config == null) config = liquidFillGaugeDefaultSettings();

    var gauge = canvas.append('svg')
         .attr('width', width)
         .attr('height', height)
         .attr('x', xCoord)
         .attr('y', yCoord);

    var radius = 30;
    var locationX = parseInt(gauge.style('width'))/2 - radius;
    var locationY = parseInt(gauge.style('height'))/2 - radius;
    var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

    var waveHeightScale;
    if(config.waveHeightScaling){
        waveHeightScale = d3.scale.linear()
            .range([0,config.waveHeight,0])
            .domain([0,50,100]);
    } else {
        waveHeightScale = d3.scale.linear()
            .range([config.waveHeight,config.waveHeight])
            .domain([0,100]);
    }

    var textPixels = (config.textSize*radius/2);
    var textFinalValue = parseFloat(value).toFixed(2);
    var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
    //var percentText = config.displayPercent?"%":"";
    var circleThickness = config.circleThickness * radius;
    var circleFillGap = config.circleFillGap * radius;
    var fillCircleMargin = circleThickness + circleFillGap;
    var fillCircleRadius = radius - fillCircleMargin;
    var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

    var waveLength = fillCircleRadius*2/config.waveCount;
    var waveClipCount = 1+config.waveCount;
    var waveClipWidth = waveLength*waveClipCount;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    var textRounder = function(value){ return Math.round(value); };
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(1); };
    }
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(2); };
    }

    // Data for building the clip wave area.
    var data = [];
    for(var i = 0; i <= 40*waveClipCount; i++){
        data.push({x: i/(40*waveClipCount), y: (i/(40))});
    }

    // Scales for drawing the outer circle.
    var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);
    var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);

    // Scales for controlling the size of the clipping path.
    var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
    var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);

    // Scales for controlling the position of the clipping path.
    var waveRiseScale = d3.scale.linear()
        // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
        // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.
        .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
        .domain([0,1]);

    var waveAnimateScale = d3.scale.linear()
        .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
        .domain([0,1]);

    // Scale for controlling the position of the text within the gauge.
    var textRiseScaleY = d3.scale.linear()
        .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
        .domain([0,1]);

    // Center the gauge within the parent SVG.
    var gaugeGroup = gauge.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');

    // Draw the outer circle.
    var gaugeCircleArc = d3.svg.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius-circleThickness));
    gaugeGroup.append("path")
        .attr("d", gaugeCircleArc)
        .style("fill", config.circleColor)
        .attr('transform','translate('+radius+','+radius+')');

    // Text where the wave does not overlap.
    var text1 = gaugeGroup.append("text")
        .text(textRounder(textStartValue)) //+ percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // The clipping wave area.
    var clipArea = d3.svg.area()
        .x(function(d) { return waveScaleX(d.x); } )
        .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
        .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
    var waveGroup = gaugeGroup.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + elementId);
    var wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea)
        .attr("T", 0);

    // The inner circle with the clipping wave attached.
    var fillCircleGroup = gaugeGroup.append("g")
        .attr("clip-path", "url(#clipWave" + elementId + ")");
    fillCircleGroup.append("circle")
        .attr("cx", radius)
        .attr("cy", radius)
        .attr("r", fillCircleRadius)
        .style("fill", config.waveColor);

    // Text where the wave does overlap.
    var text2 = fillCircleGroup.append("text")
        .text(textRounder(textStartValue))// + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.waveTextColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // Make the value count up.
    if(config.valueCountUp){
        var textTween = function(){
            var i = d3.interpolate(this.textContent, textFinalValue);
            return function(t) { this.textContent = textRounder(i(t));}// + percentText; }
        };
        text1.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
        text2.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    var waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;
    if(config.waveRise){
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
            .transition()
            .duration(config.waveRiseTime)
            .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
            .each("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
    }

    if(config.waveAnimate) animateWave();

    function animateWave() {
        wave.attr('transform','translate('+waveAnimateScale(wave.attr('T'))+',0)');
        wave.transition()
            .duration(config.waveAnimateTime * (1-wave.attr('T')))
            .ease('linear')
            .attr('transform','translate('+waveAnimateScale(1)+',0)')
            .attr('T', 1)
            .each('end', function(){
                wave.attr('T', 0);
                animateWave(config.waveAnimateTime);
            });
    }

    function GaugeUpdater(){
        this.update = function(value){
            var newFinalValue = parseFloat(value).toFixed(2);
            var textRounderUpdater = function(value){ return Math.round(value); };
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(1); };
            }
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(2); };
            }

            var textTween = function(){
                var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
                return function(t) { this.textContent = textRounderUpdater(i(t)) + percentText; }
            };

            text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);

            var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;
            var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);
            var waveRiseScale = d3.scale.linear()
                // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
                // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
                // circle at 100%.
                .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
                .domain([0,1]);
            var newHeight = waveRiseScale(fillPercent);
            var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
            var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);
            var newClipArea;
            if(config.waveHeightScaling){
                newClipArea = d3.svg.area()
                    .x(function(d) { return waveScaleX(d.x); } )
                    .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
                    .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
            } else {
                newClipArea = clipArea;
            }

            var newWavePosition = config.waveAnimate?waveAnimateScale(1):0;
            wave.transition()
                .duration(0)
                .transition()
                .duration(config.waveAnimate?(config.waveAnimateTime * (1-wave.attr('T'))):(config.waveRiseTime))
                .ease('linear')
                .attr('d', newClipArea)
                .attr('transform','translate('+newWavePosition+',0)')
                .attr('T','1')
                .each("end", function(){
                    if(config.waveAnimate){
                        wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                        animateWave(config.waveAnimateTime);
                    }
                });
            waveGroup.transition()
                .duration(config.waveRiseTime)
                .attr('transform','translate('+waveGroupXPosition+','+newHeight+')')
        }
    }

    return new GaugeUpdater();
}
