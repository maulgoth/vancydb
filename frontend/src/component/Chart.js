import React, { Component } from "react";
import { Select, Button, Checkbox, Form } from "semantic-ui-react";
import { curveCatmullRom } from "d3-shape";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
} from "react-vis";
import axios from "axios";

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

const processData = (data) => {
  return data.map((e) => ({
    x: e.year,
    y: e.dollarval,
  }));
};

export default class Chart extends Component {
  state = {
    isLoaded: false,
    nhoods: [],
    year_built_first: 1900,
    year_built_sec: 2020,
    ncode: 0,
    z_category: null,
    selection: "lv",
    math: "avg",
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  callApi = () => {
    this.setState({ isLoaded: false });
    axios
      .get("http://localhost:5000/api/charts", {
        params: {
          selection: this.state.selection,
          math: this.state.math,
          ncode: this.state.ncode == 0 ? null : this.state.ncode,
          z_category:
            this.state.z_category === "All Zone Categories"
              ? null
              : this.state.z_category,
          year_built_first: this.state.year_built_first,
          year_built_sec: this.state.year_built_sec,
        },
      })
      .then((res) => {
        const nhoods = res.data;
        this.setState({ nhoods });
        this.setState({ isLoaded: true });
      });
  };

  handleSubmit() {
    this.callApi();
  }

  componentDidMount() {
    this.callApi();
  }

  render() {
    return (
      <div>
        <XYPlot
          width={800}
          height={600}
          xDomain={[2006, 2020]}
          margin={{ left: 100, right: 100 }}
        >
          <HorizontalGridLines style={{ stroke: "#B7E9ED" }} />
          <VerticalGridLines style={{ stroke: "#B7E9ED" }} />
          <XAxis
            style={{
              line: { stroke: "#ADDDE1" },
              ticks: { stroke: "#ADDDE1" },
              text: { stroke: "none", fill: "#6b6b76", fontWeight: 600 },
            }}
            tickFormat={(v) => `${v}`}
          />
          <YAxis title="$ CAD" />
          <LineSeries
            className="first-series"
            data={
              this.state.isLoaded
                ? processData(this.state.nhoods)
                : [{ x: 0, y: 0 }]
            }
            style={{
              strokeLinejoin: "round",
              strokeWidth: 4,
            }}
          />
        </XYPlot>
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
              label="Neighborhood"
              options={neighborhoods}
              name="ncode"
              value={this.state.ncode}
              placeholder="Neighborhood"
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
          </Form.Group>
          <Form.Button onClick={this.handleSubmit.bind(this)}>
            Search
          </Form.Button>
        </Form>
      </div>
    );
  }
}
