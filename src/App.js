import React, { useRef, useState, useEffect } from "react";
import { hot } from "react-hot-loader";
import { Spring, animated } from "react-spring";

import { Grid } from "./Grid";
import { BoxLayer } from "./boxes_src/BoxLayer";
import { globalBoxGraph as boxes } from "./BoxGraph";

const ZoomControl = ({ zoom, setZoom, setOffset }) => {
  useEffect(() => {
    function keyDown(e) {
      if (e.key === "Escape") {
        setOffset({ x: 0, y: 0 });
        setZoom(1);
      }
    }
    window.addEventListener("keydown", keyDown);
    return () => window.removeEventListener("keydown", keyDown);
  }, []);
  return (
    <div style={{ position: "absolute", zIndex: 1000, padding: 20 }}>
      <span className={"material-icons"} onClick={() => setZoom(zoom * 1.2)}>
        {"add_circle"}
      </span>
      <span className={"material-icons"} onClick={() => setZoom(zoom / 1.2)}>
        {"remove_circle"}
      </span>
    </div>
  );
};

const Page = React.memo(({ height, width, setOffset, setZoom }) => {
  return (
    <div style={{ height, width, position: "relative" }}>
      <Grid
        height={height}
        width={width}
        xSpacing={20}
        ySpacing={20}
        onClick={e => {
          setOffset({ x: width / 2 - e.x, y: height / 2 - e.y });
          setZoom(1.25);
          boxes.create({ top: e.y, left: e.x });
        }}
      />
      <BoxLayer height={height} width={width} boxes={boxes} />
    </div>
  );
});

const App = React.memo(() => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const height = 96 * 8.5;
  const width = height * (11 / 8.5);
  return (
    <div
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <ZoomControl zoom={zoom} setZoom={setZoom} setOffset={setOffset} />
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Spring
          native
          to={{
            transform: `translate(${offset.x * zoom}px, ${offset.y *
              zoom}px) scale(${zoom})`
          }}
        >
          {({ transform }) => (
            <animated.div
              style={{
                boxSizing: "border-box",
                border: "1px solid grey",
                transform
              }}
            >
              <Page
                height={height}
                width={width}
                setZoom={setZoom}
                setOffset={setOffset}
              />
            </animated.div>
          )}
        </Spring>
      </div>
    </div>
  );
});

export default hot(module)(App);
