import json
from http.client import HTTPException
from pathlib import Path
from typing import List, Dict, Optional, Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Spell(BaseModel):
    name: str
    level: int
    school: str
    range: str | int
    aoe: str
    duration: str | int
    concentration: bool
    ritual: bool
    components: List[str]
    cast_time: str
    short: str
    dmg_type: str
    spell_type: str
    plus_slot: Optional[str] = ""
    cantrip_upgrade: Optional[List[Dict[str, str | int | None]]] = []
    full: List[Any]
    classes: List[str]
    subclass: List[str]


@app.get("/")
async def root():
    return {"message": "Hello !World"}


@app.post("/set-spell")
async def set_spell(spell: Spell):
    print(spell)
    if spell.school:
        file_path = f"{Path(__file__).parent}/data/spells/{spell.school.lower()}.json"
        with open(file_path) as f:
            data = json.load(f)
            spell_names = [spell['name'] for spell in data]
            if spell.name in spell_names:
                data[spell_names.index(spell.name)] = spell.model_dump(mode="json")
            else:
                data.append(spell.model_dump(mode="json"))
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4)
        return {"message": "Spell updated"}
    else:
        raise HTTPException("School not found")
