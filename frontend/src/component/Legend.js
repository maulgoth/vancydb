// import React, { Component } from "react";

// export default class Legend extends Component {
//   render() {
//     return (
//       <div >
//         <td style={{ background: '#b10026', width: '18px', height: '18px', opacity: 0.7 }}></td>
//         $ {this.props.nhoods[this.props.year_selected] ? 
//         String(this.props.nhoods['limits'][this.props.year_selected][7]) 
//         : ""}
//         <td style={{ background: '#e31a1c', width: '18px', height: '18px', opacity: 0.7 }}></td>
//         $ {this.props.nhoods[this.props.year_selected] ? 
//         String(this.props.nhoods['limits'][this.props.year_selected][6]) 
//         : ""}
//       </div>
//     )
//   }
// }


import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";

class Legend extends MapControl {
  createLeafletElement(props) {}

  componentDidMount() {
    // get color depending on population density value
    const getColor = o => {
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

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [
      // String(this.props.nhoods['limits'][this.props.year_selected][0]),
      // String(this.props.nhoods['limits'][this.props.year_selected][1]),
      // String(this.props.nhoods['limits'][this.props.year_selected][2]),
      // String(this.props.nhoods['limits'][this.props.year_selected][3]),
      // String(this.props.nhoods['limits'][this.props.year_selected][4]),
      // String(this.props.nhoods['limits'][this.props.year_selected][5]),
      // String(this.props.nhoods['limits'][this.props.year_selected][6]),
      // String(this.props.nhoods['limits'][this.props.year_selected][7])
      123,
      456,
      789
    ];
      let labels = [];
      let from;
      let to;

      for (let i = 0; i < grades.length; i++) {
        from = "$" + grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' +
            getColor(grades[i] + 1) +
            '"></i> ' +
            from +
            (to ? "&ndash;" + to : "+")
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    const { map } = this.props.leaflet;
    legend.addTo(map);
  }
}

export default withLeaflet(Legend);