import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import PropertyList from './pages/PropertyList';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes inside Layout will automatically render with the Navbar */}
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/properties/add" element={<AddProperty />} />
          <Route path="/properties/edit/:id" element={<EditProperty />} />
          {/* Fallback route directly redirects to the dashboard */}
          <Route path="*" element={<PropertyList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}