'use client';

import { useState, useEffect } from 'react';
import { BeerOrder, Beer, beerOrderService, beerService } from '@/lib/api';

export default function BeerOrdersPage() {
  const [beerOrders, setBeerOrders] = useState<BeerOrder[]>([]);
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    customerRef: '',
    orderLines: [{ beerId: 0, orderQuantity: 1 }],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, beersData] = await Promise.all([
        beerOrderService.getAll(),
        beerService.getAll(),
      ]);
      setBeerOrders(ordersData);
      setBeers(beersData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await beerOrderService.create(formData);
      resetForm();
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    }
  };

  const handleStatusUpdate = async (orderId: number, status: BeerOrder['status']) => {
    try {
      await beerOrderService.updateStatus(orderId, status);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await beerOrderService.delete(id);
        loadData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete order');
      }
    }
  };

  const addOrderLine = () => {
    setFormData({
      ...formData,
      orderLines: [...formData.orderLines, { beerId: 0, orderQuantity: 1 }],
    });
  };

  const removeOrderLine = (index: number) => {
    const newOrderLines = formData.orderLines.filter((_, i) => i !== index);
    setFormData({ ...formData, orderLines: newOrderLines });
  };

  const updateOrderLine = (index: number, field: 'beerId' | 'orderQuantity', value: number) => {
    const newOrderLines = [...formData.orderLines];
    newOrderLines[index] = { ...newOrderLines[index], [field]: value };
    setFormData({ ...formData, orderLines: newOrderLines });
  };

  const resetForm = () => {
    setFormData({
      customerRef: '',
      orderLines: [{ beerId: 0, orderQuantity: 1 }],
    });
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'SHIPPED': return 'bg-yellow-100 text-yellow-800';
      case 'DELIVERED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Loading beer orders...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Beer Order Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage beer orders and tracking
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Create New Order
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
            Create New Beer Order
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customer Reference
              </label>
              <input
                type="text"
                value={formData.customerRef}
                onChange={(e) => setFormData({ ...formData, customerRef: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., CUSTOMER-123"
                required
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Order Lines
                </label>
                <button
                  type="button"
                  onClick={addOrderLine}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  Add Line
                </button>
              </div>
              {formData.orderLines.map((line, index) => (
                <div key={index} className="flex gap-4 mb-2 items-center">
                  <div className="flex-1">
                    <select
                      value={line.beerId}
                      onChange={(e) => updateOrderLine(index, 'beerId', parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    >
                      <option value="">Select Beer</option>
                      {beers.map((beer) => (
                        <option key={beer.id} value={beer.id}>
                          {beer.beerName} - ${beer.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={line.orderQuantity}
                      onChange={(e) => updateOrderLine(index, 'orderQuantity', parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Qty"
                      required
                    />
                  </div>
                  {formData.orderLines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOrderLine(index)}
                      className="text-red-600 hover:text-red-900 px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Create Order
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
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer Ref
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {beerOrders.map((order) => (
                <>
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id!)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        #{order.id}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {order.customerRef}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${order.paymentAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status!)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(order.createdDate!).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id!, e.target.value as BeerOrder['status'])}
                        className="mr-2 p-1 border border-gray-300 rounded text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <button
                        onClick={() => handleDelete(order.id!)}
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && order.beerOrderLines && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Order Lines:</h4>
                          <div className="space-y-1">
                            {order.beerOrderLines.map((line) => (
                              <div key={line.id} className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>
                                  {line.beer ? line.beer.beerName : `Beer ID: ${line.beerId}`} x {line.orderQuantity}
                                </span>
                                <span>Status: {line.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        {beerOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No beer orders found. Create your first order to get started.
          </div>
        )}
      </div>
    </div>
  );
}