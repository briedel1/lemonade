import React, {useState} from "react";
import {Observer} from "mobx-react-lite";

const Box = React.memo(({top, left}) => {
  const [hover, setHover] = useState(false);
  return (<div
    style={{
      boxSizing: "border-box",
      pointerEvents: "auto",
      position: "absolute",
      top,
      left,
      height: 20,
      width: 100,
      border: "1px solid grey",
      background: hover ? "red" : "white",
      opacity: 0.7
    }}
    onMouseOver={() => !hover && setHover(true)}
    onMouseLeave={() => hover && setHover(false)}
  />);
});

const BoxList = React.memo(() => {
  return [];
});

export const BoxLayer = React.memo(({boxes}) => {
  return (<div
    style={{
      boxSizing: "border-box",
      pointerEvents: "none",
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      zIndex: 2
      // border: "1px solid red"
    }}
    onClick={e => {
      const x = Math.round(e.clientX / 10) * 10;
      const y = Math.round(e.clientY / 10) * 10;
      boxes.set(`${x}-${y}`, {top: y, left: x});
    }}
  >
    <Observer>
      {() => Array.from(boxes.entries()).map(([key, box], index) => {
        return <Box key={key} top={box.top} left={box.left}/>;
      })}
    </Observer>
  </div>);
});
