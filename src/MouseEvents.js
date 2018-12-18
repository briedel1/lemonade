import React, { useCallback, useLayoutEffect, useState } from "react";

export const useDragEvents = ({
  tolerance,
  onMouseDown,
  onClick,
  onMouseUp,
  onDragStart,
  onDrag,
  onDragEnd
}) => {
  const [state, setState] = useState({ down: false, dragging: false });
  const [origin, setOrigin] = useState({ x: null, y: null });
  const _onMouseDown = useCallback(
    e => {
      const newEvent = { x: e.clientX, y: e.clientY };
      onMouseDown && onMouseDown(newEvent);
      setState({ down: true, dragging: false });
      setOrigin(newEvent);
    },
    [state, onMouseDown]
  );
  useLayoutEffect(
    () => {
      if (!state.down) return null;

      function mouseMove(e) {
        const cursor = { x: e.clientX, y: e.clientY };
        const delta = { x: cursor.x - origin.x, y: cursor.y - origin.y };
        if (!state.dragging) {
          if (Math.abs(delta.x) > tolerance || Math.abs(delta.y) > tolerance) {
            setState({ ...state, dragging: true });
            onDragStart && onDragStart({ origin, cursor, delta });
          }
        } else {
          onDrag && onDrag({ origin, cursor, delta });
        }
      }

      function mouseUp(e) {
        const cursor = { x: e.clientX, y: e.clientY };
        const delta = { x: cursor.x - origin.x, y: cursor.y - origin.y };
        onMouseUp && onMouseUp({ origin, cursor, delta });
        if (!state.dragging) {
          onClick && onClick({ ...cursor });
        } else {
          onDragEnd && onDragEnd({ origin, cursor, delta });
        }
        setState({ down: false, dragging: false });
        setOrigin({ x: null, y: null });
      }
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
      return () => {
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
      };
    },
    [state]
  );
  return { onMouseDown: _onMouseDown };
};

export const DragEvents = ({ children, ...props }) => {
  const { onMouseDown } = useDragEvents(props);
  return React.cloneElement(children, { onMouseDown });
};
