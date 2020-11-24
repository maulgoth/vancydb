import React, { Component } from "react";
import { Form, Segment } from "semantic-ui-react";
import {
  TileLayer,
  Marker,
  Popup,
  MapConsumer,
  MapContainer,
  GeoJSON,
} from "react-leaflet";
import axios from "axios";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

const style = { margin: 20 };
const marks = {
  2006: 2006,
  2007: 2007,
  2008: 2008,
  2009: 2009,
  2010: 2010,
  2011: 2011,
  2012: 2012,
  2013: 2013,
  2014: 2014,
  2015: 2015,
  2016: 2016,
  2017: 2017,
  2018: 2018,
  2019: 2019,
  2020: 2020,
};

const selections = [
  { key: "lv", value: "lv", text: "Land Value" },
  { key: "tl", value: "tl", text: "Tax Levy" },
  { key: "iv", value: "iv", text: "Improvement Value" },
];

const maths = [
  { key: "avg", value: "avg", text: "Average" },
  { key: "median", value: "median", text: "Median" },
  { key: "max", value: "max", text: "Maximum" },
];

const neighborhoods = [
  { key: 0, value: 0, text: "All Neighborhoods" },
  { key: 1, value: 1, text: "1 - Dunbar-Southlands" },
  { key: 2, value: 2, text: "2 - Kerrisdale" },
  { key: 3, value: 3, text: "3 - Killarney" },
  { key: 4, value: 4, text: "4 - Kitsilano" },
  { key: 5, value: 5, text: "5 - South Cambie" },
  { key: 6, value: 6, text: "6 - Victoria-Fraserview" },
  { key: 7, value: 7, text: "7 - Kensington-Cedar Cottage" },
  { key: 8, value: 8, text: "8 - Mount Pleasant" },
  { key: 9, value: 9, text: "9 - Oakridge" },
  { key: 10, value: 10, text: "10 -	Renfrew-Collingwood" },
  { key: 11, value: 11, text: "11 -	Sunset" },
  { key: 12, value: 12, text: "12 -	West Point Grey" },
  { key: 13, value: 13, text: "13 -	Arbutus-Ridge" },
  { key: 14, value: 14, text: "14 -	Downtown" },
  { key: 15, value: 15, text: "15 -	Fairview" },
  { key: 16, value: 16, text: "16 -	Grandview-Woodland" },
  { key: 17, value: 17, text: "17 -	Hastings-Sunrise" },
  { key: 18, value: 18, text: "18 -	Marpole" },
  { key: 19, value: 19, text: "19 -	Riley Park" },
  { key: 20, value: 20, text: "20 -	Shaughnessy" },
  { key: 21, value: 21, text: "21 -	Strathcona" },
  { key: 22, value: 22, text: "22 -	West End " },
];

const zones = [
  { key: 0, value: "All Zone Categories", text: "All Zone Categories" },
  {
    key: 1,
    value: "Comprehensive Development",
    text: "Comprehensive Development",
  },
  { key: 2, value: "Two Family Dwelling", text: "Two Family Dwelling" },
  { key: 3, value: "Industrial", text: "Industrial" },
  { key: 4, value: "Historic Area", text: "Historic Area" },
  { key: 5, value: "Commercial", text: "Commercial" },
  { key: 6, value: "Light Industrial", text: "Light Industrial" },
  { key: 7, value: "Limited Agricultural", text: "Limited Agricultural" },
  {
    key: 8,
    value: "Multiple Family Dwelling",
    text: "Multiple Family Dwelling",
  },
  { key: 9, value: "One Family Dwelling", text: "One Family Dwelling" },
];

export default class Map extends Component {
  state = {
    isLoaded: false,
    dataLoaded: false,
    outlines: [],
    nhoods: [],
    year_built_bw_first: 1900,
    year_built_bw_sec: 2020,
    ncode: 0,
    zcategory: "",
    selection: "lv",
    math: "avg",
    year_selected: 2013,
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });
  handleChangeSlider = (value) => this.setState({ year_selected: value });

  callApiFillMap = () => {
    this.setState({ isLoaded: false });
    axios.get("http://localhost:5000/api/fillmap").then((res) => {
      const outlines = res.data;
      this.setState({ outlines });
      this.setState({ isLoaded: true });
    });
    this.setState({ dataLoaded: false });
    axios.get("http://localhost:5000/api/neighborhoods/", {
      params: {
        selection: this.state.selection,
        math: this.state.math,
        z_category:
          this.state.z_category === "All Zone Categories"
            ? null
            : this.state.z_category,
        year_built_first: this.state.year_built_first,
        year_built_sec: this.state.year_built_sec,
      }
    }).then((res) => {
      const nhoods = res.data;
      console.log(nhoods);
      this.setState({ nhoods });
      this.setState({ dataLoaded: true });
    });
  };

  callApiData = () => {
    this.setState({ dataLoaded: false });
    axios.get("http://localhost:5000/api/neighborhoods/", {
      params: {
        selection: this.state.selection,
        math: this.state.math,
        z_category:
          this.state.z_category === "All Zone Categories"
            ? null
            : this.state.z_category,
        year_built_first: this.state.year_built_first,
        year_built_sec: this.state.year_built_sec,
      }
    }).then((res) => {
      const nhoods = res.data;
      console.log(nhoods);
      this.setState({ nhoods });
      this.setState({ dataLoaded: true });
    });
  }

  handleSubmit() {
    this.callApiData();
  }

  componentDidMount() {
    this.callApiFillMap();
  }

  render() {
    return (
      <div>
        <MapContainer
          center={[49.246576, -123.090169]}
          zoom={11}
          style={{ width: "100%", height: "400px" }}
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
        {this.state.dataLoaded ? (<h1>{this.state.nhoods[0][this.state.year_selected]}</h1>) 
        : (<h1>Loading</h1>)}
        <Segment>
          <h3>Year: {this.state.year_selected}</h3>
          <div style={style}>
            <Slider
              min={2006}
              max={2020}
              marks={marks}
              step={null}
              defaultValue={this.state.year_selected}
              onChange={this.handleChangeSlider.bind(this)}
            />
          </div>
        </Segment>
        <Form>
          <Form.Group widths="equal">
            <Form.Select
              fluid
              label="Data Selection"
              options={selections}
              name="selection"
              value={this.state.selection}
              placeholder="Data Selection"
              onChange={this.handleChange.bind(this)}
            />
            <Form.Select
              fluid
              label="Statistic"
              options={maths}
              name="math"
              value={this.state.math}
              placeholder="Statistic"
              onChange={this.handleChange.bind(this)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Select
              fluid
              label="Zone Category"
              options={zones}
              name="z_category"
              value={this.state.z_category}
              placeholder="Zone Category"
              onChange={this.handleChange.bind(this)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="Year Built After"
              placeholder="Year Built After"
              name="year_built_first"
              onChange={this.handleChange.bind(this)}
            />
            <Form.Input
              label="Year Built Before"
              placeholder="Year Built Before"
              name="year_built_sec"
              onChange={this.handleChange.bind(this)}
            />
          </Form.Group>
          <Form.Button onClick={this.handleSubmit.bind(this)}>
              Search
            </Form.Button>
        </Form>
      </div>
    );
  }
}
