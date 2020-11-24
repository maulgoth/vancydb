import React, { Component } from "react";
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

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({isLoaded: false})
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
        </div>
        <div>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <select
              name="selection"
              value={this.state.selection}
              onChange={this.handleChange.bind(this)}
            >
              <option value="lv">Land Value</option>
              <option value="tl">Tax Levy</option>
              <option value="iv">Improvement Value</option>
            </select>
            <select
              name="math"
              value={this.state.math}
              onChange={this.handleChange.bind(this)}
            >
              <option value="avg">Average</option>
              <option value="median">Median</option>
              <option value="max">Max</option>
            </select>
            <input type="submit" value="Search" />
          </form>
        </div>
      </div>
    );
  }
}
