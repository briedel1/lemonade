import React, { useRef, useState, useLayoutEffect } from "react";
import { Observer } from "mobx-react-lite";

const Text = ({ value }) => {
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100%",
        width: "100%",
        padding: "0px 4px"
      }}
    >
      <span
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontFamily: "inherit",
          fontSize: "inherit"
        }}
      >
        {value}
      </span>
    </span>
  );
};

const Input = ({ value, onCommit, onRevert }) => {
  const ref = useRef();
  const [buffer, setBuffer] = useState(value || "");

  useLayoutEffect(
    () => {
      if (ref.current) {
        ref.current.focus();
      }
    },
    [ref]
  );

  return (
    <input
      ref={ref}
      style={{
        boxSizing: "border-box",
        position: "absolute",
        textAlign: "center",
        height: "100%",
        width: "100%",
        fontFamily: "inherit",
        fontSize: "inherit"
      }}
      value={buffer}
      onChange={e => setBuffer(e.target.value)}
      onBlur={e => onRevert && onRevert({ buffer })}
      onKeyDown={e => {
        switch (e.key) {
          case "Enter":
            onCommit && onCommit({ value: buffer });
            break;
          case "Escape":
            onRevert && onRevert({ buffer });
            break;
          default:
            return;
        }
      }}
    />
  );
};

export const Box = React.memo(({ state }) => {
  const [hover, setHover] = useState(false);
  return (
    <Observer>
      {() => {
        return (
          <div
            style={{
              boxSizing: "border-box",
              pointerEvents: "auto",
              position: "absolute",
              top: state.top,
              left: state.left,
              height: 20,
              width: 100,
              border: "1px solid grey",
              background: hover ? "red" : "white",
              opacity: 0.7,
              overflow: "hidden"
            }}
            onMouseOver={() => !hover && setHover(true)}
            onMouseLeave={() => hover && setHover(false)}
            onClick={e => {
              e.stopPropagation();
              state.openEditor();
            }}
          >
            {state.state === 0 ? (
              <Text value={state.datum} />
            ) : (
              <Input
                value={state.datum}
                onCommit={({ value }) => {
                  state.closeEditor();
                  state.setValue(value);
                }}
                onRevert={() => state.closeEditor()}
              />
            )}
          </div>
        );
      }}
    </Observer>
  );
});
