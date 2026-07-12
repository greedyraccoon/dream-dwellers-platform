import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AddProperty() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    type: 'RESIDENTIAL',
    status: 'AVAILABLE',
    price: '',
    location: '',
    bedrooms: '',
    area: '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/properties', {
        ...form,
        price: parseFloat(form.price),
        bedrooms: parseInt(form.bedrooms),
        area: parseFloat(form.area),
      });
      navigate('/properties');
    } catch (err) {
      setError('Failed to add property. Check all fields.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Property</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500">Title</label>
            <input name="title" type="text" required onChange={handleChange}
              className="w-full border p-2 rounded text-sm mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500">Type</label>
              <select name="type" onChange={handleChange}
                className="w-full border p-2 rounded text-sm mt-1">
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Status</label>
              <select name="status" onChange={handleChange}
                className="w-full border p-2 rounded text-sm mt-1">
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
                <option value="RENTED">Rented</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Location</label>
            <input name="location" type="text" required onChange={handleChange}
              className="w-full border p-2 rounded text-sm mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500">Price (₹)</label>
              <input name="price" type="number" required onChange={handleChange}
                className="w-full border p-2 rounded text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Bedrooms</label>
              <input name="bedrooms" type="number" onChange={handleChange}
                className="w-full border p-2 rounded text-sm mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500">Area (sq ft)</label>
              <input name="area" type="number" onChange={handleChange}
                className="w-full border p-2 rounded text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Image URL</label>
              <input name="imageUrl" type="text" onChange={handleChange}
                className="w-full border p-2 rounded text-sm mt-1" />
            </div>
          </div>
          <button type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition mt-2">
            Add Property
          </button>
        </form>
      </div>
    </div>
  );
}
