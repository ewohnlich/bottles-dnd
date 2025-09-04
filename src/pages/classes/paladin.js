import {SpellSlots} from "../spells";
import {bottlesNormalize, InfoBlock, SingleCharge} from "../../utils";
import {Badge, Button, Form, Modal, Table} from "react-bootstrap";
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

    const divinity = (
        <><h3>Channel Divinity</h3><ChannelDivinity level={level}/></>
    );

    return (
        <>
            <SpellSlots slots={paladin_class.slots[level - 1]}/>

            <LayOnHands />

            {level >= 3 ? divinity : ""}


            {feats.filter(feat => feat.level <= level).map((feat, idx) => <PaladinFeat feat={feat} key={idx}/>)}
        </>
    );
};

const ChannelDivinity = ({level}) => {
    const charges = level >=11 ? 3 : 2

    return (
        <>
            charges: {charges}
        </>
    )

}

const PaladinFeat = ({feat}) => {

}

const LayOnHands = () => {
    return (
        <>
        <h3>Lay On Hands</h3>
            <InfoBlock header="Charges" body={<SingleCharge />}/>
            <p>Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you finish a Long Rest. With that pool, you can restore a total number of Hit Points equal to five times your Paladin level.</p>
        <p>As a <Badge bg="spell-bonus">Bonus Action</Badge> Action, you can touch a creature (which could be yourself) and draw power from the pool of healing to restore a number of Hit Points to that creature, up to the maximum amount remaining in the pool.</p>
<p>You can also expend 5 Hit Points from the pool of healing power to remove the Poisoned condition from the creature; those points don't also restore Hit Points to the creature.</p>
        </>
    )
}