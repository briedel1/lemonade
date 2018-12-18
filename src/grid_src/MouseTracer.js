import React, { useState, useMemo, useCallback } from "react";
import { useImmer } from "use-immer";

export function use2dCoord({ x1, y1, x2, y2, xSnap, ySnap }) {
  const [coord, updateCoord] = useImmer({ x1, y1, x2, y2 });
  const actions = useMemo(
    () => {
      const snapX = x => Math.round(x / xSnap) * xSnap;
      const snapY = y => Math.round(y / ySnap) * ySnap;
      return {
        set: ({ x1, y1, x2, y2 }) =>
          updateCoord(draft => {
            draft.x1 = snapX(x1);
            draft.y1 = snapY(y1);
            draft.x2 = snapX(x2);
            draft.y2 = snapY(y2);
          }),
        setOrigin: ({ x, y }) =>
          updateCoord(draft => {
            draft.x1 = snapX(x);
            draft.y1 = snapY(y);
          }),
        setCursor: ({ x, y }) =>
          updateCoord(draft => {
            draft.x2 = snapX(x);
            draft.y2 = snapY(y);
          }),
        clear: () => {
          updateCoord(draft => {
            draft.x1 = null;
            draft.y1 = null;
            draft.x2 = null;
            draft.y2 = null;
          });
        }
      };
    },
    [xSnap, ySnap]
  );
  return [coord, actions];
}

export const MousePin = ({ down, x, y }) => {
  return <circle cx={x} cy={y} r={5} fill={down ? "#2b2b2b" : "#dadada"} />;
};

export const MouseTracer = ({ down, x1, y1, x2, y2 }) => (
  <g>
    {x1 !== null && <MousePin x={x1} y={y1} />}
    {!x1 || !x2 ? null : (
      <rect
        x={Math.min(x1, x2)}
        y={Math.min(y1, y2)}
        width={Math.abs(x1 - x2)}
        height={Math.abs(y1 - y2)}
        fill={"#dadada"}
        opacity={0.3}
      />
    )}
    {x2 !== null && <MousePin down={down} x={x2} y={y2} />}
  </g>
);
