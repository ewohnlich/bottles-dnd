import {SpellSlots} from "../spells";
import classes from "../../data/classes.json";
import {useContext, useState} from "react";
import {InfoBlock, FeatCharge, processFeatCharges} from "../../utils";
import {CharacterContext} from "../main";


const wizard_class = classes.filter(klass => klass.name === 'Wizard')[0],
    subclasses = wizard_class.subclasses;

export const Wizard = ({level, boostProps, subclass}) => {
    const [, setBoosts] = boostProps;
    let feats = subclasses[subclass] ? subclasses[subclass] : [];


    return (
        <>
            <SpellSlots slots={wizard_class.slots[level - 1]}/>

            {feats.filter(feat => feat.level <= level && !feat.metamagic).map((feat, idx) => <WizardFeat feat={feat}
                                                                                                         key={idx}/>)}
        </>
    );
};

const WizardFeat = ({feat}) => {
    const character = useContext(CharacterContext).character,
        featCharges = processFeatCharges(character, feat.charges),
        [used, setUsed] = useState(Array(featCharges).fill(false));

    function handleClick(idx) {
        const newUsed = used.slice()
        newUsed[idx] = !newUsed[idx];
        setUsed(newUsed);
    }

    const points = Array.from(Array(featCharges), (_, idx) => {
        return <FeatCharge key={idx} idx={idx} used={used[idx]} togglePoint={() => handleClick(idx)}/>
    })

    return (
        <div className="mt-4 p-2 shadow-lg bg-white rounded" key={feat.name.toLowerCase()}>
            <h3>{feat.name}</h3>
            {feat.description.map((para, idx) => <p dangerouslySetInnerHTML={{__html: para}} key={idx}/>)}
            {featCharges > 0 ? <InfoBlock header="Charges" body={points}/> : ""}
        </div>
    )
}