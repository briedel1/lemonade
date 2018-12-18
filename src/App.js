import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { observable } from "mobx";
import "./App.css";

import { Grid } from "./Grid";
import { BoxLayer } from "./BoxLayer";

const boxes = observable(new Map());

class App extends Component {
  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Grid
          onClick={e => {
            console.log(e);
            boxes.set(`${e.x}-${e.y}`, { top: e.y, left: e.x });
          }}
        />
        <BoxLayer boxes={boxes} />
      </div>
    );
  }
}

export default hot(module)(App);
