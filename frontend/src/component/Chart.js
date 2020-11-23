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
    y: e.lv,
  }));
};

export default class Chart extends Component {
  state = {
    isLoaded: false,
    nhoods: [],
    year_built_before: 2020,
    year_built_after: 1900,
    ncode: 0,
    zcategory: '',
    selection: ''
  };

  componentDidMount() {
    axios
      .get('http://localhost:5000/api/charts', {
        params: {
          selection: 'lv',
          math: 'avg'
        }
      }
      )
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
            data={this.state.isLoaded ? processData(this.state.nhoods) : null}
            style={{
              strokeLinejoin: "round",
              strokeWidth: 4,
            }}
          />
        </XYPlot>
      </div>
    );
  }
}
