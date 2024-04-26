import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TableSearch } from "./pages/TableSearch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TableSearch/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
