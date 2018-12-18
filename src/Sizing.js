import React, { useRef, useState, useLayoutEffect } from "react";

export const Resizer = React.memo(({ children }) => {
  const ref = useRef();
  const [dims, setDims] = useState({ height: 0, width: 0 });
  useLayoutEffect(() => {
    const resize = () => {
      const { clientWidth, clientHeight } = ref.current;
      if (clientWidth !== dims.width || clientHeight !== dims.height) {
        setDims({
          height: clientHeight,
          width: clientWidth
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  return children({ ref, ...dims });
});
