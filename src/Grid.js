import React, {useLayoutEffect, useMemo, useRef, useState} from "react";

import {DragEvents} from "./MouseEvents";
import {AxisGridlines} from "./grid_src/AxisGridlines";

const MouseTracer = ({down, x, y}) => {
  return <circle cx={x} cy={y} r={5} fill={down ? "#2b2b2b" : "#dadada"}/>;
};

const snapper = ({x, y}) => {
  return obj => ({
    ...obj, x: Math.round(obj.x / x) * x, y: Math.round(obj.y / y) * y
  });
};

export const Grid = React.memo(({spacingWidth, spacingHeight, onClick}) => {
  const ref = useRef();
  const snap = useMemo(() => snapper({x: 20, y: 20}));
  const [dims, setDims] = useState({height: 0, width: 0});
  const [origin, setOrigin] = useState({x: null, y: null});
  const [tracer, setTracer] = useState({down: false, x: null, y: null});
  useLayoutEffect(() => {
    const resize = () => {
      const {clientWidth, clientHeight} = ref.current;
      if (clientWidth !== dims.width || clientHeight !== dims.height) {
        setDims({
          height: clientHeight, width: clientWidth
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  return (<React.Fragment>
    <DragEvents
      tolerance={2}
      onClick={({cursor}) => onClick(snap(cursor))}
      onMouseDown={e => setTracer({...tracer, down: true})}
      onDragStart={e => setOrigin(snap({...e.origin}))}
      // onDrag={e => console.log(e)}
      onMouseUp={e => {
        setOrigin({x: null, y: null});
        setTracer({...tracer, down: false});
      }}
    >
      <svg
        ref={ref}
        height={"100%"}
        width={"100%"}
        onMouseMove={e => setTracer(snap({
          ...tracer, x: e.clientX, y: e.clientY
        }))}
      >
        <AxisGridlines
          axis={"x"}
          spacing={20}
          axisLength={dims.width}
          tickLength={dims.height}
          color={"#dadada"}
        />
        <AxisGridlines
          axis={"y"}
          spacing={20}
          axisLength={dims.height}
          tickLength={dims.width}
          color={"#dadada"}
        />
        <MouseTracer down={false} x={origin.x} y={origin.y}/>
        {!origin.x ? null : (<rect
          x={Math.min(origin.x, tracer.x)}
          y={Math.min(origin.y, tracer.y)}
          width={Math.abs(tracer.x - origin.x)}
          height={Math.abs(tracer.y - origin.y)}
          fill={"#dadada"}
          opacity={0.3}
        />)}
        <MouseTracer down={tracer.down} x={tracer.x} y={tracer.y}/>
      </svg>
    </DragEvents>
  </React.Fragment>);
});
