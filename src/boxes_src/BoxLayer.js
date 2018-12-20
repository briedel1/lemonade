import React, { useState } from "react";
import { Observer } from "mobx-react-lite";

import { Box } from "./Box";

const BoxList = React.memo(() => {
  return [];
});

export const BoxLayer = React.memo(({ height, width, boxes }) => {
  return (
    <div
      style={{
        boxSizing: "border-box",
        pointerEvents: "none",
        position: "absolute",
        top: 0,
        left: 0,
        height,
        width,
        zIndex: 2
      }}
    >
      <Observer>
        {() =>
          Array.from(boxes.boxes.entries()).map(([key, box], index) => {
            return <Box key={key} state={box} />;
          })
        }
      </Observer>
    </div>
  );
});
