import React, { useLayoutEffect, useMemo, useRef, useState } from "react";

import { Resizer } from "./Sizing";
import { DragEvents } from "./MouseEvents";
import { AxisGridlines } from "./grid_src/AxisGridlines";
import { MouseTracer, use2dCoord } from "./grid_src/MouseTracer";

export const Grid = React.memo(({ spacingWidth, spacingHeight, onClick }) => {
  const [tracerState, tracer] = use2dCoord({ xSnap: 20, ySnap: 20 });
  return (
    <React.Fragment>
      <Resizer>
        {({ ref, height, width }) => {
          return (
            <DragEvents
              tolerance={2}
              onClick={onClick}
              onMouseDown={e => null}
              onDragStart={e => tracer.setOrigin(e.origin)}
              onDrag={e => tracer.setCursor(e.cursor)}
              onMouseUp={e => tracer.clear()}
            >
              <svg
                ref={ref}
                height={"100%"}
                width={"100%"}
                onMouseMove={e => null}
              >
                <AxisGridlines
                  axis={"x"}
                  spacing={20}
                  axisLength={width}
                  tickLength={height}
                  color={"#dadada"}
                />
                <AxisGridlines
                  axis={"y"}
                  spacing={20}
                  axisLength={height}
                  tickLength={width}
                  color={"#dadada"}
                />
                <MouseTracer {...tracerState} />
              </svg>
            </DragEvents>
          );
        }}
      </Resizer>
    </React.Fragment>
  );
});
