import {Paladin} from "./classes/paladin";
import {Sorcerer} from "./classes/sorcerer";
import {Wizard} from "./classes/wizard";

export default function ClassSpells({level, character_class, boostProps, subclass}) {
    let classComponent = {
        Paladin: <Paladin level={level} boostProps={boostProps} subclass={subclass}/>,
        Sorcerer: <Sorcerer level={level} boostProps={boostProps} subclass={subclass}/>,
        Wizard: <Wizard level={level} boostProps={boostProps} subclass={subclass}/>
    };

    return classComponent[character_class] || "NYI";
}
