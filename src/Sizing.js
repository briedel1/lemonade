import React, {
  useRef,
  useImperativeMethods,
  useState,
  useLayoutEffect
} from "react";

export const RelativeReference = React.forwardRef(
  ({ children, ...props }, ref) => {
    const childRef = useRef();
    useImperativeMethods(ref, () => ({
      relPos: e => {
        // takes window position and returns
        // position relative to element
        const node = childRef.current;
        const rect = node.getBoundingClientRect();
        const scale = rect.width / node.clientWidth;
        const offsetX = rect.x;
        const offsetY = rect.y;
        return {
          x: (e.clientX - offsetX) / scale,
          y: (e.clientY - offsetY) / scale
        };
      }
    }));
    const child = React.Children.only(children);
    return React.cloneElement(child, { ref: childRef, ...props });
  }
);

export const Resizer = React.memo(
  React.forwardRef(({ children, ...props }, ref) => {
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
    return children({ ref: ref, ...dims, ...props });
  })
);
