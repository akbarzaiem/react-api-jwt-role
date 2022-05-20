import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateUser from './components/CreateUser';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import CreateProduk from './components/Produk/CreateProduk';
import ListProduk from './components/Produk/ListProduk';
import ViewProduk from './components/Produk/ViewProduk';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import CreateRoles from './components/Roles/CreateRoles';
import ListRoles from './components/Roles/ListRoles';
import ViewRoles from './components/Roles/ViewRoles';
import ViewUser from './components/ViewUser';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<> <Navbar /><Home /><Footer /> </>} />
          <Route path="/add-User/:id" element={<> <Navbar /><CreateUser /><Footer /> </>}></Route>
          <Route path="/view-User/:id" element={<> <Navbar /><ViewUser /><Footer /> </>}></Route>
          <Route path="/gantiPassword/:id" element={<> <Navbar /><ResetPassword /><Footer /> </>}></Route>
          <Route path='/produk' element={<> <Navbar /><ListProduk /><Footer /> </>} />
          <Route path="/add-Produk/:id" element={<> <Navbar /><CreateProduk /><Footer /> </>}></Route>
          <Route path="/view-Produk/:id" element={<> <Navbar /><ViewProduk /><Footer /> </>}></Route>
          <Route path='/roles' element={<> <Navbar /><ListRoles /><Footer /> </>} />
          <Route path="/add-Roles/:id" element={<> <Navbar /><CreateRoles /><Footer /> </>}></Route>
          <Route path="/view-Roles/:id" element={<> <Navbar /><ViewRoles /><Footer /> </>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
