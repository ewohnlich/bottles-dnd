import './App.css';
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import AddSpell from "./data/spells/form";
import {Main, ExportCharacter} from "./pages/main";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Outlet/>}>
                    <Route index element={<Main/>}/>
                    <Route path="spells" element={<AddSpell/>}/>
                    <Route path="export" element={<ExportCharacter/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
