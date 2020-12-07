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
  DiscreteColorLegend,
  Hint
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

const displays = [
  { key: 'both', text: 'All Zones and Neighborhoods', value: 'both' },
  { key: 'zone', text: 'Zone', value: 'zone' },
  { key: 'nhood', text: 'Neighborhood', value: 'nhood' }
];

const ITEMS = [
  'Dunbar-Southlands',
  'Kerrisdale',
  'Killarney',
  'Kitsilano',
  'South Cambie',
  'Victoria-Fraserview',
  'Kensington-Cedar Cottage',
  'Mount Pleasant',
  'Oakridge',
  'Renfrew-Collingwood',
  'Sunset',
  'West Point Grey',
  'Arbutus-Ridge',
  'Downtown',
  'Fairview',
  'Grandview-Woodland',
  'Hastings-Sunrise',
  'Marpole',
  'Riley Park',
  'Shaughnessy',
  'Strathcona',
  'West End '
]

const ZONEITEMS = [
  "Comprehensive Development",
  "Two Family Dwelling",
  "Industrial",
  "Historic Area",
  "Commercial",
  "Light Industrial",
  "Limited Agricultural",
  "Multiple Family Dwelling",
  "One Family Dwelling"
]

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

export default class Map extends Component {
  state = {
    isLoaded: false,
    formLoading: false,
    outlines: [],
    year_built_bw_first: 1900,
    year_built_bw_sec: 2019,
    ncode: 0,
    display: "both",
    selection: "lv",
    math: "avg",
    price_min: 1,
    price_max: 987654321,
    transit: false,
    hovered: null,
    civic_number: '1450',
    street_name: 'LABURNUM ST',
    postal_code: 'V6J 3W3'
  };

  handleChange = (e, { name, value }) => {
    if (this.state.price_max == null)
      this.setState({ price_max: 987654321 });
    else
      this.setState({ [name]: value, isLoaded: false });
  }

  handleDisplayChange(e, { name, value }) {
    if (value === "zone")
      this.setState({ z_category: "all", [name]: value, isLoaded: false });
    else if (value === "nhood")
      this.setState({ ncode: 0, [name]: value, isLoaded: false });
    else if (value === "both")
      this.setState({ ncode: 0, z_category: "all", [name]: value, isLoaded: false });
  }

  callApi = () => {
    this.setState({ isLoaded: false, formLoading: true });
    axios
      .get("http://localhost:5000/api/addresses", {
        params: {
          selection: this.state.selection,
          math: this.state.math,
          ncode: this.state.ncode,
          z_category: this.state.z_category,
          year_built_first: this.state.year_built_first,
          year_built_sec: this.state.year_built_sec,
          price_max: this.state.price_max,
          price_min: this.state.price_min,
          display: this.state.display,
          civic_number: this.state.civic_number,
          street_name: this.state.street_name,
          postal_code: this.state.postal_code
        },
      })
      .then((res) => {
        const nhoods = res.data;
        this.setState({ nhoods, isLoaded: true, formLoading: false });
        console.log(this.state.nhoods);
      })
      .catch(error => {
        this.setState({ formLoading: false });
      });

  };

  handleSubmit() {
    this.callApi();
  }

  componentDidMount() {
    //this.callApi();
  }

  processData = (data) => {
    if (this.state.display === "both" ||
      (this.state.display === "nhood" && this.state.ncode != 0)) {
      return (
        <LineSeries
          className="first-series"
          data={data.map((e) => ({
            x: e.year,
            y: e.dollarval,
          }))}
          style={{
            strokeLinejoin: "round",
            strokeWidth: 3,
          }}
        />
      );
    }

  };

  processDataHPI = (data) => {
    return (
      <LineSeries
        className="second-series"
        data={data.map((e) => ({
          x: e.year,
          y: e.hpi,
        }))}

      />
    );
  }



  render() {
    return (
      <div>
        <XYPlot
          width={800}
          height={300}
          xDomain={[2006, 2019]}
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
          {
            this.state.isLoaded ?
              this.processData(this.state.nhoods)
              :
              <LineSeries
                className="first-series"
                data={[{ x: 0, y: 0 }]}
                style={{
                  strokeLinejoin: "round",
                  strokeWidth: 4,
                }}
              />
          }
        </XYPlot>
        {/* HPI BELOW */}
        <XYPlot
          width={800}
          height={300}
          xDomain={[2006, 2019]}
          margin={{ left: 100, right: 100 }}
        >
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis
            style={{
              text: { stroke: "none", fontWeight: 600 },
            }}
            tickFormat={(v) => `${v}`}
          />
          <YAxis title="HPI in $ CAD" />
          {
            this.state.isLoaded ?
              this.processDataHPI(this.state.nhoods)
              :
              <LineSeries
                className="third-series"
                data={[{ x: 0, y: 0 }]}
                curve={'curveMonotoneX'}
              />
          }
        </XYPlot>
        {/* END HPI */}
        {/* <h4>Neighborhood: {this.state.hovered ? this.state.hovered : null}</h4> */}
        {this.state.isLoaded ?
          (<div>
            <h4>
              Neighborhood:
            {"   " + this.state.nhoods[0].NHOOD_NAME}
            </h4>
            <p>
              {this.state.nhoods[0].LINE_1}
              <br/>
              {this.state.nhoods[0].LINE_2}
              <br/>
              {this.state.nhoods[0].LINE_3}
              <br/>
              {this.state.nhoods[0].LINE_4}
            </p>
          </div>
          ) : null}
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
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="Civic Number"
              placeholder="Civic Number"
              name="civic_number"
              value={this.state.civic_number}
              onChange={this.handleChange.bind(this)}
            />
            <Form.Input
              label="Street Name"
              placeholder="Street Name"
              name="street_name"
              value={this.state.street_name}
              onChange={this.handleChange.bind(this)}
            />
            <Form.Input
              label="Postal Code"
              placeholder="Postal Code"
              name="postal_code"
              value={this.state.postal_code}
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
