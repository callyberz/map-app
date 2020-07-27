import React from "react";
import {
  Map,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  ZoomControl,
  Polygon,
  Tooltip
} from "react-leaflet";
// import { Icon } from "leaflet";
import { polygon, centerOfMass } from "@turf/turf";
import "./App.css";
import districts from "./districts";

console.log(districts);

export default function App() {
  const [position, setPosition] = React.useState([22.39181, 114.06597]);
  const [zoomValue, setzoomValue] = React.useState(11);
  const hkdistrictsArr = districts["features"];

  const geoPolygonStyle = (feature) => {
    // console.log(feature);
    return {
      // the fillColor is adapted from a property which can be changed by the user (segment)
      // fillColor: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
      // weight: 0,
      // //stroke-width: to have a constant width on the screen need to adapt with scale
      strokeWidth: 2,
      // opacity: 0.5,
      color: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
      // dashArray: "3",
      fillOpacity: 0.5,
    };
  };

  const getCentroid = function (arr) {
    return arr.reduce(
      function (x, y) {
        return [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length];
      },
      [0, 0]
    );
  };

  const handleClick = (event) => {
    const { lat, lng } = event.latlng;
    // console.log(`Clicked at ${lat}, ${lng}`);
    setzoomValue(12);
    setPosition({ lat, lng });
  };

  return (
    <Map center={position} maxZoom={15} zoom={zoomValue}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={districts} style={geoPolygonStyle}></GeoJSON>

      {hkdistrictsArr &&
        hkdistrictsArr.map((dis, v) => {
          const disCoordinates = dis.geometry.coordinates[0];
          const disName = dis.properties["地區"];
          const aaaa = polygon([disCoordinates]);
          const centerCoodinates = centerOfMass(aaaa);
          const centriodByTurf = centerCoodinates.geometry.coordinates;
          [centriodByTurf[0], centriodByTurf[1]] = [
            centriodByTurf[1],
            centriodByTurf[0],
          ];

          return (
            <div key={v}>
              <Marker position={centriodByTurf} onClick={handleClick}
              zIndexOffset={5}
              >
                <Tooltip>
                  <span>
                    District: {disName} <br />
                    Plot some graph here
                  </span>
                </Tooltip>
                <Popup>
                  Graph {disName}
                </Popup>
              </Marker>
              {/* <Polygon color="purple" positions={disCoordinates} /> */}
            </div>
          );
        })}

      {/* <Marker position={position}>
        <Popup>
          <span>
            A pretty CSS3 popup. <br /> Easily customizable.
          </span>
        </Popup>
      </Marker> */}
    </Map>
  );
}
