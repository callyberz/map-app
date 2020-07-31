import React, { useState, useRef, useLayoutEffect } from 'react';
import ReactModal from "react-modal"
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import "./PieChart.css";

function PieChart(props) {
    // const chart = useRef(null);
    const [showSecondModal, setshowSecondModal] = useState(false);
    const [treeName, settreeName] = useState(null);
    const treeChemCompo = [
        { name: "Acacia confusa", cellulose: 39.78, hemicellulose: 21.11, lignin: 22.2 },
        { name: "Macaranga tanarius", cellulose: 38.19, hemicellulose: 28.8, lignin: 34.11 },
        { name: "Bauhinia", cellulose: 33.09, hemicellulose: 29.88, lignin: 22.73 },
        { name: "Aleurites moluccana", cellulose: 43.33, hemicellulose: 22.45, lignin: 28.91 },
        { name: "Ficus hispida", cellulose: 40.75, hemicellulose: 35.44, lignin: 28.91 },
        { name: "Dimocarpus longan", cellulose: 39.14, hemicellulose: 28.17, lignin: 25.14 },
        { name: "Sterculia lanceolata", cellulose: 38.68, hemicellulose: 29.51, lignin: 24.32 },
        { name: "Celtis sinensis", cellulose: 41.39, hemicellulose: 29.82, lignin: 21.68 },
        { name: "Lophostemon confertus", cellulose: 40.79, hemicellulose: 34.66, lignin: 26.85 },
        { name: "Machilus", cellulose: 44.62, hemicellulose: 27.86, lignin: 18.47 },
        { name: "Schefflera octophylla", cellulose: 36.67, hemicellulose: 27.88, lignin: 31.23 },
        { name: "Mallotus paniculatus", cellulose: 43.52, hemicellulose: 36.02, lignin: 18.7 },
        { name: "Machilus chekiangensis", cellulose: 46.55, hemicellulose: 25.32, lignin: 17.22 },
        { name: "Acacia auriculiformis", cellulose: 36.67, hemicellulose: 27.88, lignin: 31.23 },
        { name: "Eucalyptus", cellulose: 40.24, hemicellulose: 14.84, lignin: 22.26 },
        { name: "Acacia mangium", cellulose: 41.71, hemicellulose: 32.29, lignin: 33.33 },
        { name: "Melaleuca quinquenervia", cellulose: 38.96, hemicellulose: 24.37, lignin: 30.66 },
    ]

    const TreeDetail = ({ selectedItem }) => {
        const temp = treeChemCompo.find(v => v.name == selectedItem)
        return (
            <div>
                {temp.name}
                <section>Chemical Composition (%)</section>
                <ul>
                    <li>Cellulose: {temp.cellulose}</li>
                    <li>Hemicellulose: {temp.hemicellulose}</li>
                    <li>Lignin: {temp.lignin}</li>
                </ul>
            </div>
        )
    }

    const handleCloseModal = () => {
        setshowSecondModal(!showSecondModal)
    }

    useLayoutEffect(() => {
        let chart = am4core.create("piechartdiv", am4charts.PieChart);
        chart.paddingRight = 50;
        chart.paddingLeft = 50;
        chart.radius = am4core.percent(50);

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

            series.slices.template.events.on("hit", (event) => {
                // event.target is the clicked Slice
                settreeName(event.target.dataItem.dataContext.nameEn)
                setshowSecondModal(true)
            });
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
            <ReactModal
                isOpen={showSecondModal}
                onRequestClose={handleCloseModal}
                ariaHideApp={false}
                className="secondModal"
                overlayClassName="myoverlay"
            >
                <div className="treeDetail">
                    <TreeDetail selectedItem={treeName} />
                    <div className="closeButtonWrapper">
                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            </ReactModal>
        </div>

    );
}
export default PieChart;