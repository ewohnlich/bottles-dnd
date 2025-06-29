import {useState, useEffect} from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export const HoverLink = ({id, children, title, className}) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
        <a href="#" className={"decoration-dotted text-secondary " + className}>{children}</a>
    </OverlayTrigger>
);

export const InputWithLabel = ({id, name, placeholder}) => {
    const default_state = localStorage.getItem(id)
    const [state, setState] = useState(default_state ? JSON.parse(default_state) : "");

    function handleChange(e) {
        setState(e.target.value);
    }

    useEffect(() => {
        // storing input name
        localStorage.setItem(id, JSON.stringify(state));
    }, [id, state]);

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

export function getModifier(stat) {
    return Math.floor((stat - 10) / 2);
}

export function getProficiency(level) {
    return Math.floor((level-1) / 4) + 2;
}

export const InfoBlock=({header, body}) => {
    return (
        <div className="info-block me-2">
            <div className="info-block-header p-1">{header}</div>
            <div className="info-block-body">{body}</div>
        </div>
    )
}

export function bottlesNormalize(value) {
    return value.replace(/[\s]/g, "_").toLowerCase()
}