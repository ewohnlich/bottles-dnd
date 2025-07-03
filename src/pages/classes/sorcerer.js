import { SpellSlots } from "../spells";
import { bottlesNormalize, InfoBlock } from "../../utils";
import { Badge, Button, Form, Modal, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import metamagic from "../../data/metamagic.json";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";

const MetamagicOption = ({ option_name, option, updateMetas }) => {
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

const MetamagicButton = ({ meta, cost, description }) => {
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
                {meta}
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{meta}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Cost <Badge bg="primary">{cost}</Badge>
                    {description.map((para) => (
                        <p>{para}</p>
                    ))}
                </Modal.Body>
            </Modal>
        </>
    );
};

const SelectedMetamagic = ({ metas }) => {
    const buttons = metas.map((meta, _) => (
        <MetamagicButton
            meta={meta}
            cost={metamagic[meta].cost}
            description={metamagic[meta].description}
            key={meta}
        />
    ));

    return <>{buttons}</>;
};

const Metamagic = () => {
    const [metas, setMetas] = useState(
            JSON.parse(localStorage.getItem("metas")) || [],
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
                Metamagic
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
            <SelectedMetamagic metas={metas} />
        </>
    );
};

const SorceryPoints = ({ level }) => {
    const points = Array.from({ length: level }, (_, i) => (
            <SorceryPoint idx={i} key={i} />
        )),
        [show, setShow] = useState(false),
        createSpellCost = [
            { name: "1st", cost: 2 },
            { name: "2nd", cost: 3 },
            { name: "3rd", cost: 5 },
            { name: "4th", cost: 6 },
            { name: "5th", cost: 7 },
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
            <InfoBlock header="Sorcery Points" body={points} />
            <Button
                variant="secondary"
                className="text-white me-2"
                onClick={handleShow}
            >
                Main Actions
            </Button>
            <Metamagic level={level} />
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

const SorceryPoint = ({ idx }) => {
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
                className="spell-slot p-1 m-1 d-inline-block"
                onClick={handleClick}
            />
        );
    }
};

const InnateSorceryPoint = () => {
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
                className="spell-slot p-1 m-1 d-inline-block"
                onClick={handleClick}
            />
        );
    }
};

const InnateSorcery = ({ setBoosts }) => {
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
        .map((i, j) => <InnateSorceryPoint key={j} />);

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
            <InfoBlock header="Innate Sorcery Charges" body={blocks} />

            {active ? activeBadges : null}
        </>
    );
};

export const Sorcerer = ({ level, boostProps }) => {
    const [, setBoosts] = boostProps;
    const slots = [
        [2],
        [3],
        [4, 2],
        [4, 3],
        [4, 3, 2],
        [4, 3, 3],
        [4, 3, 3, 1],
        [4, 3, 3, 2],
        [4, 3, 3, 3, 1],
        [4, 3, 3, 3, 2],
        [4, 3, 3, 3, 2, 1],
        [4, 3, 3, 3, 2, 1],
        [4, 3, 3, 3, 2, 1, 1],
        [4, 3, 3, 3, 2, 1, 1],
        [4, 3, 3, 3, 2, 1, 1, 1],
        [4, 3, 3, 3, 2, 1, 1, 1],
        [4, 3, 3, 3, 2, 1, 1, 1, 1],
        [4, 3, 3, 3, 3, 1, 1, 1, 1],
        [4, 3, 3, 3, 3, 2, 1, 1, 1],
        [4, 3, 3, 3, 3, 2, 2, 1, 1],
    ];

    return (
        <>
            <SpellSlots slots={slots[level - 1]} />

            <h3>Sorcerer Class</h3>
            <SorceryPoints level={level} />

            <h3>Innate Sorcery</h3>
            <p>Activate as a bonus action</p>
            <InnateSorcery setBoosts={setBoosts} />
        </>
    );
};
