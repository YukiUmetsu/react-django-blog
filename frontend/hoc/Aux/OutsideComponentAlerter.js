import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types"

/**
 * Hook that execute callback funciton when user clicks outside of the passed ref
 */
function useOutsideAlerter(ref, callback) {
    useEffect(() => {
        /**
         * Execute callback if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
const OutsideComponentAlerter = (props) => {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, props.callback);

    return <div ref={wrapperRef}>{props.children}</div>;
};

OutsideComponentAlerter.propTypes = {
  callback: PropTypes.func
};

export default OutsideComponentAlerter;