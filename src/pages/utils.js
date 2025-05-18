import {useState, useEffect} from "react";

export function InputWithLabel({id, name, placeholder}) {
    const default_state = localStorage.getItem(id)
    const [state, setState] = useState(default_state ? JSON.parse(default_state) : "");

    function handleChange(e) {
        setState(e.target.value);
    }

    useEffect(() => {
        // storing input name
        localStorage.setItem(id, JSON.stringify(state));
    }, [state]);

    return (
        <>
            <input type="text" className={"form-control character-" + id} id={id}
                   onChange={handleChange}
                   value={state}
                   placeholder={placeholder}/>
            <label htmlFor={id} className="form-label">{name}</label>
        </>
    )

}