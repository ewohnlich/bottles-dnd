import {Sorcerer} from "./classes/sorcerer"

export default function ClassSpells({level, character_class, boostProps}) {
    let classComponent = {
        "Sorcerer": <Sorcerer level={level} boostProps={boostProps}/>
    }

    return (
        classComponent[character_class] || "NYI"
    )
}