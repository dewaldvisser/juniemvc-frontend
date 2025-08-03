'use client';

import { useState, useEffect } from 'react';
import { Beer, BeerOrder, beerService, customerService, beerOrderService, shipmentService } from '@/lib/api';
import Link from 'next/link';

interface DashboardStats {
  totalBeers: number;
  totalCustomers: number;
  totalOrders: number;
  totalShipments: number;
  recentOrders: BeerOrder[];
  lowStockBeers: Beer[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [beers, customers, orders, shipments] = await Promise.all([
        beerService.getAll(),
        customerService.getAll(),
        beerOrderService.getAll(),
        shipmentService.getAll(),
      ]);

      const recentOrders = orders
        .sort((a, b) => new Date(b.createdDate!).getTime() - new Date(a.createdDate!).getTime())
        .slice(0, 5);

      const lowStockBeers = beers.filter(beer => beer.quantityOnHand < 10);

      setStats({
        totalBeers: beers.length,
        totalCustomers: customers.length,
        totalOrders: orders.length,
        totalShipments: shipments.length,
        recentOrders,
        lowStockBeers,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome to your JunieMVC dashboard
          </p>
        </div>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p>Error loading dashboard data: {error}</p>
          <p className="text-sm mt-2">Make sure your Spring Boot API is running on http://localhost:8080</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your JunieMVC Beer Management System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/beers" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Beers
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats?.totalBeers || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Active beer inventory
          </p>
        </Link>

        <Link href="/customers" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Customers
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats?.totalCustomers || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Registered customers
          </p>
        </Link>

        <Link href="/beer-orders" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Orders
          </h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats?.totalOrders || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            All time orders
          </p>
        </Link>

        <Link href="/shipments" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Shipments
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats?.totalShipments || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Packages shipped
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Orders
          </h3>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {order.customerRef}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${order.paymentAmount?.toFixed(2)}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      order.status === 'SHIPPED' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'DELIVERED' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No recent orders</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Low Stock Alert
          </h3>
          {stats?.lowStockBeers && stats.lowStockBeers.length > 0 ? (
            <div className="space-y-3">
              {stats.lowStockBeers.map((beer) => (
                <div key={beer.id} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {beer.beerName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {beer.beerStyle}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600 dark:text-red-400">
                      {beer.quantityOnHand} left
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      ${beer.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">All beers are well stocked</p>
          )}
        </div>
      </div>
    </div>
  );
}
