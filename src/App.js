import './App.css';
import Dashboard_main from './components/dashboard/Dashboard_main';
import Maincompo from './components/form/main_compo';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import Home_main from './components/Home.jsx/Home_main';
import Practice from './components/Practice';
import Login from './components/form/Login';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home_main/>}></Route>
        <Route path='/chat' element={<Dashboard_main />}></Route>
        <Route path='/signup' element={<Maincompo />}> </Route>
        <Route path='/login' element={<Login />}> </Route>
        <Route path='/practice' element={<Practice />}> </Route>
      </Routes>
    </Router>
  );
}

export default App;
