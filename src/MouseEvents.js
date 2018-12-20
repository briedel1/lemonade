import React, { useCallback, useLayoutEffect, useState } from "react";

export const useDragEvents = ({
  tolerance,
  relative,
  onMouseDown,
  onClick,
  onMouseUp,
  onMouseMove,
  onDragStart,
  onDrag,
  onDragEnd
}) => {
  const [state, setState] = useState({ down: false, dragging: false });
  const [origin, setOrigin] = useState({ x: null, y: null });

  useLayoutEffect(
    // listen for window mouse events
    () => {
      // if mouse is down, ignore window mouse events
      if (!state.down) return null;

      function mouseMove(e) {
        const cursor = relative.current.relPos(e);
        const delta = { x: cursor.x - origin.x, y: cursor.y - origin.y };

        // initialize drag if tolerance exceeded
        if (!state.dragging) {
          if (Math.abs(delta.x) > tolerance || Math.abs(delta.y) > tolerance) {
            setState({ ...state, dragging: true });
            onDragStart && onDragStart({ origin, cursor, delta });
          }
          return;
        }

        onDrag && onDrag({ origin, cursor, delta });
      }

      function mouseUp(e) {
        const cursor = relative.current.relPos(e);
        const delta = { x: cursor.x - origin.x, y: cursor.y - origin.y };

        // reset mouse state
        setState({ down: false, dragging: false });
        setOrigin({ x: null, y: null });

        onMouseUp && onMouseUp({ origin, cursor, delta });

        // if drag never initialized, raise click event
        if (!state.dragging) {
          onClick && onClick({ ...cursor });
          return;
        }

        // else, raise a drag event
        onDragEnd && onDragEnd({ origin, cursor, delta });
      }

      // bind window event handlers
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);

      return () => {
        // remove window event handlers
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
      };
    },
    [state]
  );

  return {
    onMouseDown: useCallback(
      e => {
        const newEvent = relative.current.relPos(e);
        onMouseDown && onMouseDown(newEvent);
        setState({ down: true, dragging: false });
        setOrigin(newEvent);
      },
      [state, onMouseDown]
    )
  };
};

export const DragEvents = ({ children, ...props }) => {
  const { onMouseDown } = useDragEvents(props);
  return React.cloneElement(children, { onMouseDown });
};
