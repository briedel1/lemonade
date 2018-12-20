import React, { useRef, useState, useCallback } from "react";

import { Resizer, RelativeReference } from "./Sizing";
import { DragEvents } from "./MouseEvents";
import { AxisGridlines } from "./grid_src/AxisGridlines";
import { MouseTracer, use2dCoord } from "./grid_src/MouseTracer";

export const Grid = React.memo(
  ({ height, width, xSpacing, ySpacing, onClick }) => {
    const ref = useRef();
    const [tracerState, tracer] = use2dCoord({});
    const snap = useCallback(
      ({ x, y }) => ({
        x: Math.round(x / xSpacing) * xSpacing,
        y: Math.round(y / ySpacing) * ySpacing
      }),
      [xSpacing, ySpacing]
    );
    return (
      <React.Fragment>
        <DragEvents
          tolerance={2}
          relative={ref}
          onClick={e => onClick(snap({ x: e.x, y: e.y }))}
          onDragStart={e => tracer.setOrigin(snap(e.origin))}
          onDrag={e => tracer.setCursor(snap(e.cursor))}
          onDragEnd={e => tracer.clear()}
        >
          <RelativeReference ref={ref}>
            <svg
              height={height}
              width={width}
              onMouseMove={e => {
                if (tracerState.x1 !== null) return;
                const { relPos } = ref.current;
                tracer.setCursor(snap(relPos(e)));
              }}
            >
              <AxisGridlines
                axis={"x"}
                spacing={xSpacing}
                axisLength={width}
                tickLength={height}
                color={"#dadada"}
              />
              <AxisGridlines
                axis={"y"}
                spacing={ySpacing}
                axisLength={height}
                tickLength={width}
                color={"#dadada"}
              />
              <MouseTracer {...tracerState} />
            </svg>
          </RelativeReference>
        </DragEvents>
      </React.Fragment>
    );
  }
);
