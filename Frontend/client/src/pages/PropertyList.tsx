import React, { useState, useEffect, ChangeEvent } from 'react';
import api from '../api/axios';

// TypeScript interface matching your PropertyResponse DTO
interface PropertyResponse {
  id: number;
  title: string;
  type: string;
  status: string;
  price: number;
  location: string;
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

  const fetchProperties = async () => {
    try {
      const response = await api.get<PropertyResponse[]>('/properties/search', { params: filters });
      setProperties(response.data);
    } catch (err) {
      console.error("Error loading properties", err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 p-6 text-left">
      {/* Sidebar Filter */}
      <div className="w-64 rounded bg-white p-4 shadow-md mr-6 h-fit border border-gray-200">
        <h3 className="font-bold mb-4 text-gray-700 text-lg">Filters</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500">Location</label>
            <input name="location" type="text" className="w-full border p-2 rounded text-sm mt-1 bg-white text-gray-900" onChange={handleFilterChange} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Property Type</label>
            <select name="type" className="w-full border p-2 rounded text-sm mt-1 bg-white text-gray-900" onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Max Price</label>
            <input name="maxPrice" type="number" className="w-full border p-2 rounded text-sm mt-1 bg-white text-gray-900" onChange={handleFilterChange} />
          </div>
          <button onClick={fetchProperties} className="w-full bg-purple-600 text-white p-2 rounded font-semibold text-sm hover:bg-purple-700">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div key={p.id} className="bg-white rounded shadow-md overflow-hidden p-4 border border-gray-200">
              <span className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded bg-purple-100 text-purple-800 float-right">
                {p.type}
              </span>
              <h4 className="font-bold text-lg text-gray-800 mb-1">{p.title}</h4>
              <p className="text-gray-500 text-sm mb-2">📍 {p.location}</p>
              <div className="text-xl font-bold text-emerald-600 mt-4">
                ${p.price.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-2 border-t pt-2">
                Agent: <span className="font-semibold text-gray-600">{p.agentName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}