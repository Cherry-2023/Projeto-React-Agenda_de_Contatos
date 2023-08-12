import { Routes, Route, BrowserRouter } from "react-router-dom";
import ShowContacts from './components/ShowContacts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowContacts></ShowContacts>}></Route>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;

