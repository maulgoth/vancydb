# Vancouver Properties

This project is a React / Express / OracleDB application built for a Database and Information Systems course at UF.

The application allows users to visualize data on over 250,000 properties in Vancouver, BC both in chart and an OpenStreetMap with interactive neighborhood overlays. The data was obtained from the city's Open Data Portal, and the primary focus of the project was using an Oracle SQL Database with a custom-built API and front-end for the course.

Unfortunately, a live demo is not available due to the API's need to connect directly to the University of Florida's Oracle server per project requirements.

### Tools

The app is built with:
 - React
 - Express
 - Oracle 19c
 - [node-oracledb](https://github.com/oracle/node-oracledb)
 - [leaflet](https://github.com/Leaflet/Leaflet) for map overlays
 - [react-vis](https://github.com/uber/react-vis) for  charts
 - [Semantic-UI-React](https://github.com/Semantic-Org/Semantic-UI-React)

### Features
The purpose of the project was to exercise a knowledge of SQL queries executed by the API that are not especially efficient by design, so they're clunky and should never be used by anyone.

The goal was to be able to create a reactive map with neighborhood overlays created from GeoJSON data in the Oracle database that are color-weighted by price relative to the other neighborhoods.

![map-slider](https://github.com/maulgoth/vancydb/raw/main/frontend/public/mapslider.png)

The app allows users to view the 22 neighborhoods in Vancouver, operating a slider that increments between 2006 and 2020 to show a heat map of average or median Land Values, Property Taxes, and other statistics from the database, tracking the change in respective neighborhood values over time by Zone Category (Single Family Homes, Industrial Sites, etc.), Transit Station availability, or other filters. Each neighborhood can also be clicked on to display selected information on a Tooltip.

![chart](https://github.com/maulgoth/vancydb/raw/main/frontend/public/multi-chart.png)

Users can also view the same statistics on line graphs that also allow mouseover information on each Neighborhood or Zone Category depending on selection.
