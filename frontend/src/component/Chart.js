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
  { key: "selection", value: "lv", text: "Land Value" },
  { key: "selection", value: "tl", text: "Tax Levy" },
  { key: "selection", value: "iv", text: "Improvement Value" },
];

const maths = [
  { key: "math", value: "avg", text: "Average" },
  { key: "math", value: "median", text: "Median" },
  { key: "math", value: "max", text: "Maximum" },
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
    year_built_bw_first: 1900,
    year_built_bw_sec: 2020,
    ncode: 0,
    zcategory: "",
    selection: "lv",
    math: "avg",
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoaded: false });
    axios
      .get("http://localhost:5000/api/charts", {
        params: {
          selection: this.state.selection,
          math: this.state.math,
          // year_built_bw_first: this.state.year_built_bw_first,
          // year_built_bw_sec: this.state.year_built_bw_sec,
        },
      })
      .then((res) => {
        const nhoods = res.data;
        this.setState({ nhoods });
        this.setState({ isLoaded: true });
      });
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/api/charts", {
        params: {
          selection: this.state.selection,
          math: this.state.math,
          // year_built_bw_first: this.state.year_built_bw_first,
          // year_built_bw_sec: this.state.year_built_bw_sec,
        },
      })
      .then((res) => {
        const nhoods = res.data;
        this.setState({ nhoods });
        this.setState({ isLoaded: true });
      });
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
              placeholder="Land Value"
              onChange={this.handleChange.bind(this)}
            />
            <Form.Select
              fluid
              label="Math"
              options={maths}
              name="math"
              value={this.state.math}
              placeholder="Average"
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
