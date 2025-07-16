import { Sorcerer } from "./classes/sorcerer";

export default function ClassSpells({ level, character_class, boostProps, subclass}) {
    let classComponent = {
        Sorcerer: <Sorcerer level={level} boostProps={boostProps} subclass={subclass} />,
    };

    return classComponent[character_class] || "NYI";
}
