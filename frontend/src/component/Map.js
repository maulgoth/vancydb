import React, { Component } from "react";
import {  Form, Segment } from "semantic-ui-react";
import {
  TileLayer,
  Marker,
  Popup,
  MapConsumer,
  MapContainer,
  GeoJSON,
} from "react-leaflet";
import axios from "axios";

const selections = [
  { key: "selection", value: "lv", text: "Land Value" },
  { key: "selection", value: "tl", text: "Tax Levy" },
  { key: "selection", value: "iv", text: "Improvement Value" },
];

const maths = [
  { key: "math", value: "avg", text: "Average" },
  { key: "math", value: "median", text: "Median" },
  { key: "math", value: "max", text: "Maximum" },
];

export default class Map extends Component {
  state = {
    isLoaded: false,
    outlines: [],
    year_built_bw_first: 1900,
    year_built_bw_sec: 2020,
    ncode: 0,
    zcategory: "",
    selection: "lv",
    math: "avg",
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit(event) {
    this.setState({ isLoaded: false });
    axios.get("http://localhost:5000/api/fillmap").then((res) => {
      const outlines = res.data;
      this.setState({ outlines });
      console.log(outlines);
      this.setState({ isLoaded: true });
    });
  }

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
          {this.state.isLoaded ? (
            <GeoJSON
              data={this.state.outlines.map((x) => x.geo_poly_outline)}
              style={() => ({
                weight: 2,
                color: "#666",
                dashArray: "",
                fillOpacity: 0.7,
              })}
            />
          ) : (
            <h1> Loading </h1>
          )}
        </MapContainer>
        
        <Segment>
        <Form>
          <Form.Group widths="equal">
            <Form.Select
              fluid
              options={selections}
              name="selection"
              value={this.state.selection}
              placeholder="Data Selection"
              onChange={this.handleChange.bind(this)}
            />
            <Form.Select
              fluid
              options={maths}
              name="math"
              value={this.state.math}
              placeholder="Statistic"
              onChange={this.handleChange.bind(this)}
            />
          </Form.Group>
          <Form.Button onClick={this.handleSubmit.bind(this)}>
            Search
          </Form.Button>
        </Form>
        </Segment>
        
      </div>
    );
  }
}
