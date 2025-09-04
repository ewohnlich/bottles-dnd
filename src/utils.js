import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import classes from "./data/classes.json";
import {MdOutlineDoNotDisturbAlt} from "react-icons/md";
import {useState} from "react";

export const HoverLink = ({id, children, title, className}) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
        <span className={"decoration-dotted text-secondary " + className} style={{cursor: "pointer"}}>
            {children}
        </span>
    </OverlayTrigger>
);

export function getModifier(stat) {
    return Math.floor((stat - 10) / 2);
}

export function getProficiency(level) {
    return Math.floor((level - 1) / 4) + 2;
}

export const InfoBlock = ({header, body}) => {
    return (
        <div className="info-block me-2 mb-2">
            <div className="info-block-header p-1">{header}</div>
            <div className="info-block-body">{body}</div>
        </div>
    );
};

export const DieBlock = ({hitDie, body}) => {
    return (
        <div className="die-block me-2">
            <div className="die-block-header p-1">Hit Dice [{hitDie}]</div>
            <div className="die-block-body">{body}</div>
        </div>
    );
};

export function bottlesNormalize(value) {
    return value.replace(/[\s]/g, "_").toLowerCase();
}

const _classMap = () => {
    const classMap = {};
    classes.forEach((klass) => {
        classMap[klass.name] = klass;
    });
    return classMap;
};
export const classMap = _classMap();

export function getHitDie(character_class) {
    return classMap[character_class]?.hitDie;
}


export const FeatCharge = ({idx, used, togglePoint}) => {

    if (used) {
        return (
            <MdOutlineDoNotDisturbAlt
                className="spell-slot spent p-1 m-1 d-inline-block"
                onClick={togglePoint}
            />
        );
    } else {
        return (
            <div key={idx}
                 className="spell-slot p-1 m-1 d-inline-block"
                 onClick={togglePoint}
            />
        );
    }
};


export function processFeatCharges(character, charges) {
    if (charges === "+prof") {
        return getProficiency(character.level);
    } else if (charges === "+cha") {
        return getModifier(character.stats.charisma);
    }
    return charges
}

export const SingleCharge = ({idx}) => {
    const [used, setUsed] = useState(false);

    function handleClick(el) {
        setUsed(!used);
    }

    if (used) {
        return (
            <MdOutlineDoNotDisturbAlt
                className="spell-slot spent p-1 m-1 d-inline-block"
                onClick={handleClick}
            />
        );
    } else {
        return (
            <div
                key={idx}
                className="spell-slot p-1 m-1 d-inline-block"
                onClick={handleClick}
            />
        );
    }
};