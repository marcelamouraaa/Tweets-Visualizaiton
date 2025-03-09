import React, { Component } from "react";
import "./App.css";
import FileUpload from "./FileUpload";
import * as d3 from 'd3';

class App extends Component {
constructor(props) {
  super(props);
  this.state = {
    data:[],
    selected_data:[],
    sentimentColors : { positive: "green", negative: "red", neutral: "gray" }
};
}
componentDidMount(){
  this.renderChart()
}
componentDidUpdate(){
  this.renderChart()
}
set_data = (csv_data) => {
  this.setState({ data: csv_data });
}

renderChart=()=>{
  var margin ={left:50,right:150,top:10,bottom:10},width = 500,height=300;
  var innerWidth = width - margin.left - margin.right
  var innerHeight = height - margin.top - margin.bottom
  var data = this.state.data

  const xScale = d3.scaleLinear()
  .domain([d3.min(data, (d) => d["Dimension 1"]),d3.max(data, (d) => d["Dimension 1"])])
  .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
  .domain([d3.min(data, (d) => d["Dimension 2"]),d3.max(data, (d) => d["Dimension 2"])])
  .range([innerHeight, 0]);

  const svg = d3.select(".child1_svg").attr("width", width).attr("height", height);
  const innerChart = svg.select(".inner_chart").attr("transform", `translate(${margin.left}, ${margin.top})`);

  innerChart.selectAll("circle")
  .data(data)
  .join("circle")
  .attr("cx", (d) => xScale(d["Dimension 1"]))
  .attr("cy", (d) => yScale(d["Dimension 2"]))
  .attr("r", 4)
  .attr("fill", (d) => this.state.sentimentColors[d.PredictedSentiment])

  var brush = d3.brush().on('start brush', (e) => {
    var [[x0, y0], [x1, y1]] = e.selection;
    var filtered_data = data.filter(item=>{
      return (
          xScale(item["Dimension 1"]) >= x0 &&
          xScale(item["Dimension 1"]) <= x1 &&
          yScale(item["Dimension 2"]) >= y0 &&
          yScale(item["Dimension 2"]) <= y1
      );
    })
    this.setState({selected_data:filtered_data})
  });

  innerChart.call(brush);
  
}

render() {
    return (
      <div>
        <FileUpload set_data={this.set_data}></FileUpload>
        <div className="parent">
          <div className="child1 item"> 
          <h2>Projected Tweets</h2> 
            <svg width="500" height="300" className = "child1_svg"><g className="inner_chart"></g></svg> 
          </div>
          <div className="child2 item">
            <h2>Selected Tweets</h2> 
            <ul style={{ listStyleType: "none", padding: "10px" }}>
              {this.state.selected_data.map((d, i) => (
                <li key={i} style={{ color: this.state.sentimentColors[d.PredictedSentiment], marginBottom: "30px" }}>
                  {d.Tweets}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;