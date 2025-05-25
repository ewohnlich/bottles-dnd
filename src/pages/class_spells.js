import {Sorcerer} from "./classes/sorcerer"

export default function ClassSpells({level, character_class}) {
    let classComponent = {
        "Sorcerer": <Sorcerer level={level}/>
    }

    return (
        classComponent[character_class] || "NYI"
    )
}