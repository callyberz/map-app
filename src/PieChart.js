import React, { useRef, useLayoutEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import "./PieChart.css";


function PieChart(props) {
    // const chart = useRef(null);

    useLayoutEffect(() => {
        let chart = am4core.create("piechartdiv", am4charts.PieChart);
        chart.paddingRight = 50;
        chart.paddingLeft = 50;
        chart.radius = am4core.percent(50);

        console.log(props.data)
        const { trees } = props.data[0];
        if (trees && trees.length > 0) {
            chart.data = trees;
            // Create series
            let series = chart.series.push(new am4charts.PieSeries());
            series.alignLabels = false;
            series.dataFields.value = "quantity";
            series.dataFields.category = "nameEn";
            // series.labels.template.fontSize = 14;
            series.labels.template.maxWidth = 130;
            series.labels.template.wrap = true;
            series.labels.template.html = "<div>{nameEn}: {quantity}</div>";
            chart.current = chart;
        }

        return () => {
            chart.dispose();
        };
    }, []);

    const { district } = props.data[0]
    return (
        <div className="piechartRoot">
            {`${district} district`}
            <div id="piechartdiv" style={{ width: "100%", height: "500px" }}>
            </div>
        </div>

    );
}
export default PieChart;