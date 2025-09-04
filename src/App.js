import "./App.css";
import {HashRouter, Outlet, Route, Routes} from "react-router-dom";
import AddSpell from "./data/spells/form";
import {Main} from "./pages/main";

export default function App() {
    return (
        <>
            <title>D&D Character Sheet</title>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Outlet/>}>
                        <Route index element={<Main/>}/>
                        <Route path="spells" element={<AddSpell/>}/>
                    </Route>
                </Routes>
            </HashRouter>
        </>
    );
}
