import React, {useCallback, useEffect, useState} from "react";

export const useDragEvents = ({
                                tolerance, onMouseDown, onClick, onMouseUp, onDragStart, onDrag, onDragEnd
                              }) => {
  const [state, setState] = useState({down: false, dragging: false});
  const [origin, setOrigin] = useState({
    mouseDown: false, dragging: false, x: null, y: null
  });
  const _onMouseDown = useCallback(e => {
    const newEvent = {x: e.clientX, y: e.clientY};
    onMouseDown && onMouseDown(newEvent);
    setState({...state, down: true});
    setOrigin(newEvent);
  }, [onMouseDown]);
  useEffect(() => {
    if (!state.down) return;

    function mouseMove(e) {
      const cursor = {x: e.clientX, y: e.clientY};
      const delta = {x: cursor.x - origin.x, y: cursor.y - origin.y};
      if (!state.dragging) {
        if (Math.abs(delta.x) > tolerance || Math.abs(delta.y) > tolerance) {
          onDragStart && onDragStart({origin, cursor, delta});
          setState({...state, dragging: true});
        }
      } else {
        onDrag && onDrag({origin, cursor, delta});
      }
    }

    function mouseUp(e) {
      const cursor = {x: e.clientX, y: e.clientY};
      const delta = {x: cursor.x - origin.x, y: cursor.y - origin.y};
      onMouseUp && onMouseUp({origin, cursor, delta});
      if (!state.dragging) {
        onClick && onClick({origin, cursor, delta});
      } else {
        onDragEnd && onDragEnd({origin, cursor, delta});
      }
      setState({down: false, dragging: false});
      setOrigin({x: null, y: null});
    }

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [state.down, state.dragging, tolerance, onMouseDown, onMouseUp, onClick, onDragStart, onDragEnd, onDrag]);
  return {onMouseDown: _onMouseDown};
};

export const DragEvents = ({children, ...props}) => {
  const {onMouseDown} = useDragEvents(props);
  return React.cloneElement(children, {onMouseDown});
};
