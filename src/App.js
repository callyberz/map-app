import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import ReactModal from "react-modal"
import tree from "./data/tree"

import PieChart from "./PieChart";

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

class App extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      selectedDistrict: null,
      districtName: null,
      selectedDistrictData: null,
      showModal: false
    };
    // this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  componentDidMount() {
    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodataSource.url = "./hongkong.json";
    chart.geodataSource.events.on("parseended", function (event) {
      let data = [];
      for (var i = 0; i < event.target.data.features.length; i++) {
        // const districtName = event.target.data.features[i].properties.name;
        let valuetoDisplay = "0"

        // tree['districts'].map(v => {
        //   if (v.district === districtName) {
        //     valuetoDisplay = "111";
        //   }
        //   // console.log(v)
        // })
        data.push({
          id: event.target.data.features[i].id,
          value: valuetoDisplay
          // value: Math.round(Math.random() * 10000)
        })
      }
      polygonSeries.data = data;
    })

    // Set projection
    chart.projection = new am4maps.projections.Mercator();

    // Add zoom control
    chart.zoomControl = new am4maps.ZoomControl();

    // Set initial zoom
    chart.homeZoomLevel = 1;

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.mapPolygons.template.strokeWidth = 0.5;


    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;

    polygonTemplate.tooltipHTML = `<div>{name} district</div>`;
    polygonTemplate.fill = am4core.color("#aac4e7");

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0);

    // Create active state
    var activeState = polygonTemplate.states.create("active");
    activeState.properties.fill = chart.colors.getIndex(1);

    const allDistricts = tree["districts"];
    // Create an event to toggle "active" state
    polygonTemplate.events.on("hit", (event) => {
      const districtName = event.target.dataItem.dataContext.name;
      const selectedDistrictData = allDistricts.filter(v => v.district == districtName)
      if (selectedDistrictData && selectedDistrictData.length > 0) {
        this.setState({
          selectedDistrictData: selectedDistrictData,
          showModal: true
        })
      } else {
        this.setState({
          showModal: false
        })
      }
      // event.target.isActive = !event.target.isActive;
    })


    var labelSeries = chart.series.push(new am4maps.MapImageSeries());
    var labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
    labelTemplate.horizontalCenter = "middle";
    labelTemplate.verticalCenter = "middle";
    labelTemplate.fontSize = 12;
    labelTemplate.interactionsEnabled = false;
    labelTemplate.nonScaling = true;

    var markerSeries = chart.series.push(new am4maps.MapImageSeries());
    var marker = markerSeries.mapImages.template.createChild(am4core.Image);
    marker.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg";
    marker.width = 20;
    marker.height = 20;
    marker.nonScaling = true;
    marker.tooltipText = "{title}";
    marker.horizontalCenter = "middle";
    marker.verticalCenter = "bottom";

    // Set calculateVisualCenter to true in order to get the centriod of the polygon
    polygonSeries.calculateVisualCenter = true;

    const districtHasData = ["Tuen Mun", "Yuen Long", "North", "Sai Kung", "Sha Tin", "Tseun Wan", "Kwai Tsing"]

    // Set up label series to populate
    polygonSeries.events.on("datavalidated", function () {
      polygonSeries.mapPolygons.each(function (polygon) {
        const dis = polygon.dataItem.dataContext.name

        // plot district name
        let label = labelSeries.mapImages.create();
        let state = `${dis}`
        label.latitude = polygon.visualLatitude;
        label.longitude = polygon.visualLongitude;
        label.fontWeight = 500;
        label.children.getIndex(0).text = state;

        // plot marker for district has data
        districtHasData.map(v => {
          if (v == dis) {
            let marker = markerSeries.mapImages.create();
            marker.latitude = polygon.visualLatitude;
            marker.longitude = polygon.visualLongitude;
            label.children.getIndex(0).text = state;
          }
        })

      });
    });
  }


  componentDidUpdate(prevProps, prevState) {
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    const { selectedDistrictData, showModal } = this.state;
    return (
      <div>
        <div id="chartdiv" style={{ width: "100%", height: "750px" }}></div>
        <ReactModal
          isOpen={showModal}
          onRequestClose={this.handleCloseModal}
          ariaHideApp={false}
          closeTimeoutMS={500}
        >
          <button onClick={this.handleCloseModal}>Close</button>
          <PieChart
            data={selectedDistrictData} />
        </ReactModal>
      </div>
    )
  }
}

export default App;