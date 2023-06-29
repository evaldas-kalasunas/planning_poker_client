
import { useEffect, useRef } from "react";

// to check previous values
const usePreviousState = value => {
    const ref = useRef();
    useEffect(()=> {
        ref.current = value
    })
}

export default usePreviousState