import {SpellSlot, SpellSlots} from "../spells";
import {bottlesNormalize, InfoBlock, SingleCharge} from "../../utils";
import {Badge, Button, Form, InputGroup, Modal, Table} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import metamagic from "../../data/metamagic.json";
import {FaChevronDown, FaHatWizard} from "react-icons/fa";
import {MdOutlineDoNotDisturbAlt} from "react-icons/md";
import {CharacterContext} from "../main";
import classes from "../../data/classes.json";

const paladin_class = classes.filter(klass => klass.name === 'Paladin')[0],
    subclasses = paladin_class.subclasses;

export const Paladin = ({level, boostProps, subclass}) => {
    const [, setBoosts] = boostProps;
    let feats = subclasses[subclass] ? subclasses[subclass] : [];
    let divinities = paladin_class.divinities.filter(div => div.level <= level).concat(feats.filter(feat => feat.level <= level && feat.divinity));
    let abilities = paladin_class.abilities.filter(abl => abl.level <= level).concat(feats.filter(feat => feat.level <= level && !feat.divinity));

    const divinity = (
        <><h3>Channel Divinity</h3><ChannelDivinity level={level} divinities={divinities}/></>
    );

    return (
        <>
            <SpellSlots slots={paladin_class.slots[level - 1]}/>

            <LayOnHands/>

            {level >= 3 ? divinity : ""}

            <hr className="my-4"/>
            <h3>Other Abilities</h3>
            {abilities.map((abl, idx) => <PaladinAbility ability={abl}
                                                                                                         key={idx}/>)}
        </>
    );
};

const ChannelDivinity = ({level, divinities}) => {
    const charges = level >= 11 ? 3 : 2;

    let blocks = [];
    for (let i = 0; i < charges; i++) {
        blocks.push(<SpellSlot key={i}/>);
    }

    return (
        <>
            <InfoBlock header="Charges" body={blocks}/>
            <p>You know the following abilities that use Channel Divinity:</p>

            {divinities.map((divinity, idx) => <PaladinAbility ability={divinity} key={idx}/>)}
        </>
    )
}

const PaladinAbility = ({ability}) => {
    return (
        <div className="mt-4 p-2 shadow-lg bg-white rounded" key={ability.name.toLowerCase()}>
            <h4>{ability.name}</h4>
            {ability.description.map((para, idx) => <p dangerouslySetInnerHTML={{__html: para}} key={idx}/>)}
        </div>
    )
}

const LayOnHands = () => {
    const character = useContext(CharacterContext).character;
    const [pool, setPool] = useState(parseInt(localStorage.getItem("loh_pool") || 5 * character.level));

    function handleChange(e) {
        setPool(e.target.value);
    }

    return (
        <>
            <h3>Lay On Hands</h3>
            <Form.Group controlId="loh_pool">
                <Form.Control onChange={handleChange} value={pool} style={{width:"inherit"}}/>
                <Form.Label className="form-label mb-3">
                    Healing pool (max: {5 * character.level})
                </Form.Label>
            </Form.Group>
            <p>Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you finish a
                Long Rest. With that pool, you can restore a total number of Hit Points equal to five times your Paladin
                level.</p>
            <p>As a <Badge bg="spell-bonus">Bonus Action</Badge> Action, you can touch a creature (which could be
                yourself) and draw power from the pool of healing to restore a number of Hit Points to that creature, up
                to the maximum amount remaining in the pool.</p>
            <p>You can also expend 5 Hit Points from the pool of healing power to remove the Poisoned condition from the
                creature; those points don't also restore Hit Points to the creature.</p>
        </>
    )
}
