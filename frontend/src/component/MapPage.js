import React, { Component } from "react";
import { Form, Segment } from "semantic-ui-react";
import { TileLayer, Map, GeoJSON } from "react-leaflet";
import Legend from "./Legend";
import axios from "axios";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

const sliderStyle = { margin: 20 };
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
  { key: 1, value: 1, text: "Dunbar-Southlands" },
  { key: 2, value: 2, text: "Kerrisdale" },
  { key: 3, value: 3, text: "Killarney" },
  { key: 4, value: 4, text: "Kitsilano" },
  { key: 5, value: 5, text: "South Cambie" },
  { key: 6, value: 6, text: "Victoria-Fraserview" },
  { key: 7, value: 7, text: "Kensington-Cedar Cottage" },
  { key: 8, value: 8, text: "Mount Pleasant" },
  { key: 9, value: 9, text: "Oakridge" },
  { key: 10, value: 10, text: "Renfrew-Collingwood" },
  { key: 11, value: 11, text: "Sunset" },
  { key: 12, value: 12, text: "West Point Grey" },
  { key: 13, value: 13, text: "Arbutus-Ridge" },
  { key: 14, value: 14, text: "Downtown" },
  { key: 15, value: 15, text: "Fairview" },
  { key: 16, value: 16, text: "Grandview-Woodland" },
  { key: 17, value: 17, text: "Hastings-Sunrise" },
  { key: 18, value: 18, text: "Marpole" },
  { key: 19, value: 19, text: "Riley Park" },
  { key: 20, value: 20, text: "Shaughnessy" },
  { key: 21, value: 21, text: "Strathcona" },
  { key: 22, value: 22, text: "West End " },
];

const zones = [
  { key: 0, value: "all", text: "All Zone Categories" },
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

const getColor = (o) => {
  return o === 0
    ? "#666666"
    : o === 1
      ? "#ffffcc"
      : o === 2
        ? "#ffeda0"
        : o === 3
          ? "#fed976"
          : o === 4
            ? "#feb24c"
            : o === 5
              ? "#fd8d3c"
              : o === 6
                ? "#fc4e2a"
                : o === 7
                  ? "#e31a1c"
                  : "#b10026";
};

export default class MapPage extends Component {
  state = {
    formLoading: false,
    dataLoaded: false,
    outlines: [],
    nhoods: [],
    year_built_bw_first: null,
    year_built_bw_sec: null,
    ncode: 0,
    z_category: "",
    selection: "lv",
    math: "avg",
    year_selected: 2006,
    geoKey: "x", // This key change is necessary to refresh the GeoJSON, don't ask
    price_min: 0,
    price_max: 987654321,
    transit: false
  };

  style(feature) {
    let ncode = feature.properties.ncode;
    let val;
    if (this.state.nhoods[this.state.year_selected][ncode - 1] && this.state.nhoods[this.state.year_selected][ncode - 1].VAL == null)
      val = 0;
    else if (this.state.nhoods[this.state.year_selected][ncode - 1])
      val = this.state.nhoods[this.state.year_selected][ncode - 1].OCTILE;
    else val = 0;
    return {
      fillColor: getColor(val),
      weight: 2,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleToggle = () => this.setState((prevState) => ({ transit: !prevState.transit }))

  handleChangeSlider = (value) => {
    this.setState({ year_selected: value });
    if (this.state.geoKey === "x") this.setState({ geoKey: "y" });
    else this.setState({ geoKey: "x" });
    console.log(this.state.geoKey);
  };

  callApiFillMap = () => {
    axios.get("http://localhost:5000/api/fillmap").then((res) => {
      const outlines = res.data;
      this.setState({ outlines });
    });
  };

  callApiData = () => {
    this.setState({ dataLoaded: false, formLoading: true });
    this.callApiFillMap();
    axios
      .get("http://localhost:5000/api/neighborhoods/", {
        params: {
          selection: this.state.selection,
          math: this.state.math,
          z_category:
            this.state.z_category === "all"
              ? null
              : this.state.z_category,
          year_built_first: this.state.year_built_first,
          year_built_sec: this.state.year_built_sec,
          price_max: this.state.price_max,
          price_min: this.state.price_min,
          transit: this.state.transit

        },
      })
      .then((res) => {
        const nhoods = res.data;
        console.log(nhoods);
        this.setState({ nhoods, dataLoaded: true, formLoading: false });
      });
  };

  handleSubmit() {
    this.callApiData();
  }

  componentDidMount() {
    // this.callApiFillMap();
  }

  onEachFeature(feature, layer) {
    let ncode = feature.properties.ncode;
    let val;
    if (this.state.nhoods[this.state.year_selected][ncode - 1]) {
      if (this.state.nhoods[this.state.year_selected][ncode - 1].VAL)
        val = "$" + this.state.nhoods[this.state.year_selected][ncode - 1].VAL.toLocaleString();
      else
        val = "$" + String(0);
    }
    else
      val = "$" + String(0);
    layer.bindPopup(neighborhoods[ncode].text + ": " + val);
  }

  render() {
    return (
      <div>
        <Map
          center={[49.246576, -123.090169]}
          zoom={12}
          style={{ width: "100%", height: "460px" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* // Check if data fetched */}
          {this.state.dataLoaded ? (
            <div>
              <GeoJSON
                data={this.state.outlines}
                style={this.style.bind(this)}
                onEachFeature={this.onEachFeature.bind(this)}
                key={this.state.geoKey}
              />
            </div>


          ) : (
              <h3> Loading </h3>
            )}
        </Map>
        <Segment>
          <Legend nhoods={this.state.nhoods} year_selected={this.state.year_selected} />
        </Segment>
        <Segment>
          <h4>Year: {this.state.year_selected}</h4>
          <div style={sliderStyle}>
            <Slider
              min={2006}
              max={2019}
              marks={marks}
              step={null}
              defaultValue={this.state.year_selected}
              onChange={this.handleChangeSlider.bind(this)}
            />
          </div>
        </Segment>
        <Form loading={this.state.formLoading}>
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
            <Form.Input
              label="Minimum Price"
              placeholder="Minimum Price"
              name="price_min"
              onChange={this.handleChange.bind(this)}
            />
            <Form.Input
              label="Maximum Price"
              placeholder="Maximum Price"
              name="price_max"
              onChange={this.handleChange.bind(this)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Checkbox 
            label='Contains Transit Stations'
            name="transit"
            onChange={this.handleToggle.bind(this)} 
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
