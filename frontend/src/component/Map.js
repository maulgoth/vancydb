import React, { Component } from "react";
import {
  TileLayer,
  Marker,
  Popup,
  MapConsumer,
  MapContainer,
} from "react-leaflet";

export default class Map extends Component {
  render() {
    return (
      <MapContainer
        center={[49.246576, -123.090169]}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    );
  }
}