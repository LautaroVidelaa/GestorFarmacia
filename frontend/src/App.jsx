import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import Categories from './pages/Categories';
import Employees from './pages/Employees';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="medicamentos" element={<Medicines />} />
          <Route path="categorias" element={<Categories />} />
          <Route path="empleados" element={<Employees />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}