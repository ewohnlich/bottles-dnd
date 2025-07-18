import {SpellSlots} from "../spells";
import {bottlesNormalize, InfoBlock} from "../../utils";
import {Badge, Button, Form, Modal, Table} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import metamagic from "../../data/metamagic.json";
import {FaChevronDown, FaHatWizard} from "react-icons/fa";
import {MdOutlineDoNotDisturbAlt} from "react-icons/md";
import {CharacterContext} from "../main";
import classes from "../../data/classes.json";

const sorcerer_class = classes.filter(klass => klass.name === 'Sorcerer')[0],
    subclasses = sorcerer_class.subclasses;

const MetamagicOption = ({option_name, option, updateMetas}) => {
    const storageName = "dnd-metamagic-" + bottlesNormalize(option_name);
    const [isChecked, setChecked] = useState(
        localStorage.getItem(storageName) === "true" || false,
    );

    function handleClick(e) {
        setChecked(e.target.checked);
        updateMetas(option_name);
    }

    useEffect(() => {
        localStorage.setItem(storageName, isChecked ? "true" : "false");
    }, [storageName, isChecked]);

    return (
        <>
            <Form.Group controlId={option_name} className="mb-3">
                <Form.Check
                    type="switch"
                    id={option_name}
                    onChange={handleClick}
                    checked={isChecked}
                    value={option_name}
                    label={option_name}
                />
                <p>
                    Cost <Badge variant="info">{option.cost}</Badge>{" "}
                    {option.description}
                </p>
            </Form.Group>
        </>
    );
};

const MetamagicButton = ({meta, cost, description}) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button
                variant="info"
                key={meta}
                className="me-2"
                onClick={handleShow}
            >
                <FaHatWizard className="me-2"/>
                {meta}
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{meta}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Cost <Badge bg="primary">{cost}</Badge>
                    {description.map((para, key) => (
                        <p key={key}>{para}</p>
                    ))}
                </Modal.Body>
            </Modal>
        </>
    );
};

const SelectedMetamagic = ({metas}) => {
    const character = useContext(CharacterContext).character;
    const buttons = metas.map((meta, idx) => (
        <MetamagicButton
            meta={meta}
            cost={metamagic[meta].cost}
            description={metamagic[meta].description}
            key={meta}
        />
    ));

    let subclass = [];
    let feats = subclasses[character.subclass] ? subclasses[character.subclass] : [];
    feats = feats.filter(feat => feat.metamagic && feat.level <= character.level)

    feats.forEach(feat => {
        subclass.push((
            <MetamagicButton
                meta={feat.name}
                cost={feat.cost}
                description={feat.description}
                key={999}
            />
        ))
    })

    return <>{buttons}{subclass}</>;
};

const Metamagic = () => {
    const [metas, setMetas] = useState(
            JSON.parse(localStorage.getItem("dnd-metas")) || [],
        ),
        [show, setShow] = useState(false),
        handleClose = () => setShow(false),
        handleShow = () => setShow(true);

    function updateMetas(meta) {
        const newMetas = metas.slice();
        if (metas.includes(meta)) {
            const idx = newMetas.indexOf(meta);
            newMetas.splice(idx, 1);
        } else {
            newMetas.push(meta);
        }
        setMetas(newMetas);
    }

    const renderForm = Object.entries(metamagic).map(
        ([option_name, option], idx) => (
            <MetamagicOption
                option_name={option_name}
                option={option}
                updateMetas={updateMetas}
                key={option_name}
            />
        ),
    );

    useEffect(() => {
        localStorage.setItem("dnd-metas", JSON.stringify(metas));
    }, [metas]);

    function handleMetas(e) {
        handleClose();
    }

    return (
        <>
            <Button
                variant="secondary"
                className="text-white me-2"
                onClick={handleShow}
            >
                Select Metamagic
                <span className="ps-2"><FaChevronDown className="me-2"/></span>
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Metamagic Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    By default you can select two metamagic options.
                    {renderForm}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleMetas}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <SelectedMetamagic metas={metas}/>
        </>
    );
};

const SorceryPoints = ({level}) => {
    const [usedPoints, setPoints] = useState(Array(level).fill(false));

    function handlePoint(i) {
        const newPoints = usedPoints.slice();
        newPoints[i] = !newPoints[i];
        setPoints(newPoints);
    }

    const pointSlots = usedPoints.map((_, i) => {
            return <SorceryPoint idx={i} key={i} used={usedPoints[i]} togglePoint={() => handlePoint(i)}/>
        }),
        [show, setShow] = useState(false),
        createSpellCost = [
            {name: "1st", cost: 2},
            {name: "2nd", cost: 3},
            {name: "3rd", cost: 5},
            {name: "4th", cost: 6},
            {name: "5th", cost: 7},
        ],
        spellCosts = createSpellCost.map((spellLevel) => {
            return (
                <tr key={spellLevel.name}>
                    <th>{spellLevel.name}</th>
                    <td>{spellLevel.cost}</td>
                </tr>
            );
        });

    const handleClose = () => setShow(false);

    function handleShow(e) {
        e.preventDefault();
        setShow(true);
    }

    if (level === 1) {
        return <></>;
    }
    return (
        <>
            <InfoBlock header="Sorcery Points" body={pointSlots}/>
            <Button
                variant="secondary"
                className="text-white me-2"
                onClick={handleShow}
            >
                Uses
            </Button>
            <Metamagic level={level}/>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sorcery Point Applications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        These actions are available regardless of metamagic
                        choice.
                    </p>
                    <h4>Creating Spell Slots</h4>
                    <p>
                        You can transform unexpended sorcery points into one
                        spell slot as a{" "}
                        <span className="badge bg-spell-bonus">bonus</span>{" "}
                        action on your turn. The created spell slots vanish at
                        the end of a long rest. The Creating Spell Slots table
                        shows the cost of creating a spell slot of a given
                        level. You can create spell slots no higher in level
                        than 5th.
                    </p>
                    <Table className="table striped hover vert">
                        <thead>
                        <tr>
                            <th>Spell Level</th>
                            <td>Point Cost</td>
                        </tr>
                        </thead>
                        <tbody>{spellCosts}</tbody>
                    </Table>
                    <h4>Convert Spell Slot to Sorcery Points</h4>
                    <p>
                        As a bonus action on your turn, you can expend one spell
                        slot and gain a number of sorcery points equal to the
                        slot's level.
                    </p>
                </Modal.Body>
            </Modal>
        </>
    );
};

const SorceryPoint = ({idx, used, togglePoint}) => {

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

const InnateSorceryPoint = ({idx}) => {
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

const InnateSorcery = ({setBoosts}) => {
    const [active, setActive] = useState(false),
        INNATE_SORCERY_SLOTS = 2;

    function handleActive(e) {
        setActive(!active);
        setBoosts((prevBoosts) => ({
            ...prevBoosts,
            spelldc: prevBoosts.spelldc + (e.target.checked ? 1 : -1),
        }));
    }

    const activeBadges = (
        <div>
            <Badge bg="primary">Spell DC increased by 1 (auto applied)</Badge>{" "}
            <Badge bg="primary">Advantage on attacks</Badge>
        </div>
    );
    const blocks = Array(INNATE_SORCERY_SLOTS)
        .fill(null)
        .map((i, j) => <InnateSorceryPoint key={j} idx={j}/>);

    return (
        <>
            <Form.Check
                inline
                type="switch"
                id="innateSorceryActive"
                onChange={handleActive}
                checked={active}
                label="Active"
            />
            <InfoBlock header="Innate Sorcery Charges" body={blocks}/>

            {active ? activeBadges : null}
        </>
    );
};

export const Sorcerer = ({level, boostProps, subclass}) => {
    const [, setBoosts] = boostProps;
    let feats = subclasses[subclass] ? subclasses[subclass] : [];

    const metamagic = (
        <><h3>Metamagic</h3><SorceryPoints level={level}/></>
    );

    return (
        <>
            <SpellSlots slots={sorcerer_class.slots[level - 1]}/>

            {level >= 2 ? metamagic : ""}

            <h3>Innate Sorcery</h3>
            <p>Activate as a bonus action</p>
            <InnateSorcery setBoosts={setBoosts}/>

            {feats.filter(feat => feat.level <= level && !feat.metamagic).map((feat, idx) => <SorcererFeat feat={feat} key={idx}/>)}
        </>
    );
};

const SorcererFeat = ({feat}) => {
    const [used, setUsed] = useState(Array(feat.charges).fill(false));

    function handleClick(idx) {
        const newUsed = used.slice()
        newUsed[idx] = !newUsed[idx];
        setUsed(newUsed);
    }
    const points = Array.from(Array(feat.charges), (_, idx) => {
        return <SorceryPoint key={idx} idx={idx} used={used[idx]} togglePoint={() => handleClick(idx)} />
    })

    return (
        <div className="mt-4 p-2 shadow-lg bg-white rounded" key={feat.name.toLowerCase()}>
            <h3>{feat.name}</h3>
            {feat.description.map((para, idx) => <p dangerouslySetInnerHTML={{__html: para}} key={idx}/>)}
            {feat.charges > 0 ? <InfoBlock header="Charges" body={points}/> : ""}
        </div>
    )
}