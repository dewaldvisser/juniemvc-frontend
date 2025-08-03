'use client';

import { useState, useEffect } from 'react';
import { Beer, beerService } from '@/lib/api';

export default function BeersPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBeer, setEditingBeer] = useState<Beer | null>(null);

  const [formData, setFormData] = useState({
    beerName: '',
    beerStyle: '',
    upc: '',
    quantityOnHand: 0,
    price: 0,
  });

  useEffect(() => {
    loadBeers();
  }, []);

  const loadBeers = async () => {
    try {
      setLoading(true);
      const data = await beerService.getAll();
      setBeers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load beers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBeer) {
        await beerService.update(editingBeer.id!, { ...formData, version: editingBeer.version });
      } else {
        await beerService.create(formData);
      }
      resetForm();
      loadBeers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save beer');
    }
  };

  const handleEdit = (beer: Beer) => {
    setEditingBeer(beer);
    setFormData({
      beerName: beer.beerName,
      beerStyle: beer.beerStyle,
      upc: beer.upc,
      quantityOnHand: beer.quantityOnHand,
      price: beer.price,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this beer?')) {
      try {
        await beerService.delete(id);
        loadBeers();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete beer');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      beerName: '',
      beerStyle: '',
      upc: '',
      quantityOnHand: 0,
      price: 0,
    });
    setEditingBeer(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Loading beers...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Beer Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your beer inventory
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add New Beer
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {editingBeer ? 'Edit Beer' : 'Add New Beer'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Beer Name
              </label>
              <input
                type="text"
                value={formData.beerName}
                onChange={(e) => setFormData({ ...formData, beerName: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Beer Style
              </label>
              <input
                type="text"
                value={formData.beerStyle}
                onChange={(e) => setFormData({ ...formData, beerStyle: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                UPC
              </label>
              <input
                type="text"
                value={formData.upc}
                onChange={(e) => setFormData({ ...formData, upc: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity on Hand
              </label>
              <input
                type="number"
                value={formData.quantityOnHand}
                onChange={(e) => setFormData({ ...formData, quantityOnHand: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                {editingBeer ? 'Update' : 'Create'} Beer
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Beer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Style
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  UPC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {beers.map((beer) => (
                <tr key={beer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {beer.beerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {beer.beerStyle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {beer.upc}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {beer.quantityOnHand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    ${beer.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(beer)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(beer.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {beers.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No beers found. Add your first beer to get started.
          </div>
        )}
      </div>
    </div>
  );
}