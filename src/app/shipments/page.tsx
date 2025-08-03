'use client';

import { useState, useEffect } from 'react';
import { BeerOrderShipment, BeerOrder, shipmentService, beerOrderService } from '@/lib/api';

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<BeerOrderShipment[]>([]);
  const [beerOrders, setBeerOrders] = useState<BeerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingShipment, setEditingShipment] = useState<BeerOrderShipment | null>(null);

  const [formData, setFormData] = useState({
    shipmentDate: '',
    carrier: '',
    trackingNumber: '',
    beerOrderId: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [shipmentsData, ordersData] = await Promise.all([
        shipmentService.getAll(),
        beerOrderService.getAll(),
      ]);
      setShipments(shipmentsData);
      setBeerOrders(ordersData);
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
      if (editingShipment) {
        await shipmentService.update(editingShipment.id!, {
          shipmentDate: formData.shipmentDate,
          carrier: formData.carrier,
          trackingNumber: formData.trackingNumber,
        });
      } else {
        await shipmentService.create(formData);
      }
      resetForm();
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save shipment');
    }
  };

  const handleEdit = (shipment: BeerOrderShipment) => {
    setEditingShipment(shipment);
    setFormData({
      shipmentDate: shipment.shipmentDate.slice(0, 16), // Format for datetime-local input
      carrier: shipment.carrier,
      trackingNumber: shipment.trackingNumber,
      beerOrderId: shipment.beerOrderId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      try {
        await shipmentService.delete(id);
        loadData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete shipment');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      shipmentDate: '',
      carrier: '',
      trackingNumber: '',
      beerOrderId: 0,
    });
    setEditingShipment(null);
    setShowForm(false);
  };

  const getOrderInfo = (beerOrderId: number) => {
    const order = beerOrders.find(o => o.id === beerOrderId);
    return order ? `#${order.id} - ${order.customerRef}` : `Order #${beerOrderId}`;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Loading shipments...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shipment Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track and manage beer order shipments
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add New Shipment
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
            {editingShipment ? 'Edit Shipment' : 'Add New Shipment'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shipment Date
              </label>
              <input
                type="datetime-local"
                value={formData.shipmentDate}
                onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Carrier
              </label>
              <input
                type="text"
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., FedEx, UPS, DHL"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                value={formData.trackingNumber}
                onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Beer Order
              </label>
              <select
                value={formData.beerOrderId}
                onChange={(e) => setFormData({ ...formData, beerOrderId: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                disabled={!!editingShipment}
              >
                <option value="">Select Beer Order</option>
                {beerOrders
                  .filter(order => order.status === 'CONFIRMED' || order.status === 'SHIPPED')
                  .map((order) => (
                    <option key={order.id} value={order.id}>
                      Order #{order.id} - {order.customerRef} (${order.paymentAmount?.toFixed(2)})
                    </option>
                  ))}
              </select>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                {editingShipment ? 'Update' : 'Create'} Shipment
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
                  Shipment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Beer Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Carrier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Shipment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #{shipment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {getOrderInfo(shipment.beerOrderId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {shipment.carrier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <code className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                      {shipment.trackingNumber}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(shipment.shipmentDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(shipment)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(shipment.id!)}
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
        {shipments.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No shipments found. Add your first shipment to get started.
          </div>
        )}
      </div>
    </div>
  );
}