import {Sorcerer} from "./sorcerer"

export default function ClassSpells({level, character_class}) {
    let classComponent = {
        "Sorcerer": <Sorcerer level={level}/>
    }

    return (
        classComponent[character_class] || "NYI"
    )
}