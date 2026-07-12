import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface PropertyResponse {
  id: number;
  title: string;
  type: string;
  status: string;
  price: number;
  location: string;
  bedrooms: number;
  area: number;
  imageUrl: string;
  agentName: string;
}

interface FilterState {
  location: string;
  type: string;
  maxPrice: string;
}

export default function PropertyList() {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [filters, setFilters] = useState<FilterState>({ location: '', type: '', maxPrice: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchProperties = async () => {
    try {
      const params: Record<string, string> = {};
      if (filters.location) params.location = filters.location;
      if (filters.type) params.type = filters.type;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      const response = await api.get<PropertyResponse[]>('/properties/search', { params });
      setProperties(response.data);
    } catch (err) {
      console.error('Error loading properties', err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [token]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      fetchProperties();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 p-6">

      {/* Sidebar Filter */}
      <div className="w-64 shrink-0 rounded bg-white p-4 shadow-md mr-6 h-fit border border-gray-200">
        <h3 className="font-bold mb-4 text-gray-700 text-lg">Filters</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500">Location</label>
            <input name="location" type="text"
              className="w-full border p-2 rounded text-sm mt-1 bg-white text-gray-900"
              onChange={handleFilterChange} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Property Type</label>
            <select name="type"
              className="w-full border p-2 rounded text-sm mt-1 bg-white text-gray-900"
              onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Max Price</label>
            <input name="maxPrice" type="number"
              className="w-full border p-2 rounded text-sm mt-1 bg-white text-gray-900"
              onChange={handleFilterChange} />
          </div>
          <button onClick={fetchProperties}
            className="w-full bg-purple-600 text-white p-2 rounded font-semibold text-sm hover:bg-purple-700">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6 text-purple-600">Available Properties</h2>
        {properties.length === 0 && (
          <p className="text-gray-400">No properties found.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div key={p.id} className="bg-white rounded shadow-md overflow-hidden border border-gray-200 flex flex-col">

              {/* Image */}
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
                  No Image
                </div>
              )}

              {/* Card Body */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg text-gray-800">{p.title}</h4>
                  <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-purple-100 text-purple-800 ml-2 shrink-0">
                    {p.type}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-1">📍 {p.location}</p>
                {p.bedrooms > 0 && (
                  <p className="text-gray-400 text-xs mb-2">🛏 {p.bedrooms} beds · {p.area} sq ft</p>
                )}
                <div className="text-xl font-bold text-emerald-600 mt-auto pt-3">
                  ₹{p.price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-2 border-t pt-2">
                  Agent: <span className="font-semibold text-gray-600">{p.agentName}</span>
                </div>

                {/* Edit/Delete */}
                {token && (
                  <div className="flex gap-2 mt-3 pt-2 border-t">
                    <button onClick={() => handleDelete(p.id)}
                      className="flex-1 bg-red-50 text-red-600 text-xs py-1 rounded hover:bg-red-100 transition">
                      Delete
                    </button>
                    <button onClick={() => navigate(`/properties/edit/${p.id}`)}
                      className="flex-1 bg-blue-50 text-blue-600 text-xs py-1 rounded hover:bg-blue-100 transition">
                      Edit
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
