import {Paladin} from "./classes/paladin";
import {Sorcerer} from "./classes/sorcerer";
import {Wizard} from "./classes/wizard";
import {Artificer} from "./classes/artificer";
import {Barbarian} from "./classes/barbarian";
import {Bard} from "./classes/bard";
import {Cleric} from "./classes/cleric";
import {Druid} from "./classes/druid";
import {Fighter} from "./classes/fighter";
import {Monk} from "./classes/monk";
import {Ranger} from "./classes/ranger";
import {Rogue} from "./classes/rogue";

export default function ClassSpells({level, character_class, boostProps, subclass}) {
    let classComponent = {
        Artificer: <Artificer level={level} boostProps={boostProps} subclass={subclass}/>,
        Barbarian: <Barbarian level={level} boostProps={boostProps} subclass={subclass}/>,
        Bard: <Bard level={level} boostProps={boostProps} subclass={subclass}/>,
        Cleric: <Cleric level={level} boostProps={boostProps} subclass={subclass}/>,
        Druid: <Druid level={level} boostProps={boostProps} subclass={subclass}/>,
        Fighter: <Fighter level={level} boostProps={boostProps} subclass={subclass}/>,
        Monk: <Monk level={level} boostProps={boostProps} subclass={subclass}/>,
        Ranger: <Ranger level={level} boostProps={boostProps} subclass={subclass}/>,
        Rogue: <Rogue level={level} boostProps={boostProps} subclass={subclass}/>,
        Paladin: <Paladin level={level} boostProps={boostProps} subclass={subclass}/>,
        Sorcerer: <Sorcerer level={level} boostProps={boostProps} subclass={subclass}/>,
        Wizard: <Wizard level={level} boostProps={boostProps} subclass={subclass}/>
    };

    return classComponent[character_class] || "NYI";
}
