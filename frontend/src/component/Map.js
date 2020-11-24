import React, { Component } from "react";
import {
  TileLayer,
  Marker,
  Popup,
  MapConsumer,
  MapContainer,
  GeoJSON,
} from "react-leaflet";
import axios from "axios";

export default class Map extends Component {
  state = {
    isLoaded: false,
    outlines: [],
    outmaps: []
  };

  componentDidMount() {
    axios.get("http://localhost:5000/api/fillmap").then((res) => {
      const outlines = res.data;
      this.setState({ outlines });
      console.log(outlines);
      this.setState({ isLoaded: true });

    });
  }

  render() {
    return (
      <div>
        <MapContainer
          center={[49.246576, -123.090169]}
          zoom={12}
          style={{ width: "100%", height: "500px" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          // Check if data fetched
          {this.state.isLoaded ? 
          <GeoJSON
            data={
              this.state.outlines.map(x => x.geo_poly_outline)
            }
            style={() => ({
              weight: 2,
              color: "#666",
              dashArray: "",
              fillOpacity: 0.7,
            })}
          /> : <h1> Loading </h1>}
          
        </MapContainer>
      </div>
    );
  }
}
