import React,  { Fragment, useEffect, useState } from 'react';

const CustomComponent = (props) => {
	/*
		The emit prop is a callback function used to run workflows - it should be used as follows:
			emit({
				payload: {
					varName: "test" // map of input variables on your workflow
				},
				type: "WORKFLOW_NAME", // the name of the workflow you want to run
				timeout: 10, // optional field - if entered the workflow will run AFTER this amount of time elapsed (milliseconds)
				periodic: 20 // optional field - if entered the workflow will run periodically (milliseconds) 
			})

		The data prop is set by updating the "Component Properties" in the Dittofi page builder. This is used to pass data into
		the custom component. 
	*/
	var { data, emit } = props;

	// Switch to "live" to use data from props. Dittofi will automatically use live mode when running from preview button.
	// When viewing through the page builder Dittofi will use "test". This allows rendering test data on the page builder.
	var mode = "test";

	useEffect(() => {
		
		// The body of the logic should go in here. This will rerender every time the data changes.
		// Dittofi will automatically wrap your code in the useEffect hook so that it updates when the data changes.
		// This is what you should put into the javascript section of the Dittofi custom component builder.
		var plotData = function () {
			var CanvasJS = window.CanvasJS;
			if ((data || mode !== "live") && CanvasJS) {
				var chartContainer = document.querySelector(".barChartContainerTwo");
				var chart = new CanvasJS.Chart(chartContainer, {
					data: [
						{
							type: "bar",
							dataPoints:
								mode !== "live"
									? [
											{ label: "banana", y: 18 },
											{ label: "orange", y: 29 },
											{ label: "apple", y: 40 },
											{ label: "mango", y: 34 },
											{ label: "grape", y: 24 },
										]
									: data.map((d) => ({ label: d["month"], y: d["count"] })),
						},
					],
				});

				chart.render();
			}
		};

		// Example of dynamically loading scripts from a CDN. In future version of Dittofi this will
		// be done automatically. However, for today you need to paste in this code to load the library
		// you want to use.
		var isScriptLoaded = function (src) {
			return Boolean(document.querySelector('script[src="' + src + '"]'));
		};

		var loadScript = function (src, onLoad) {
			var script = document.createElement("script");
			var body = document.getElementsByTagName("body")[0];
			script.src = src;
			script.async = true;
			body.appendChild(script);
			script.addEventListener("load", () => onLoad());
		};

		var canvasJS = "https://canvasjs.com/assets/script/canvasjs.min.js?d=5";
		// var chartJS = "https://cdn.jsdelivr.net/npm/chart.js"
		if (isScriptLoaded(canvasJS)) {
			plotData();
		} else {
			loadScript(canvasJS, plotData);
		}
	}, [data]);

	// This is what you enter into the HTML section of the Dittofi custom code component.
	return <div className="barChartContainerTwo" />
};


const mapStateToProps = function(state) {
	return state.reducer;
}

export default CustomComponent;
