'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { ordersApi, Order } from '@/lib/api/services/orders';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Package,
  XCircle,
  Eye,
} from 'lucide-react';

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const queryClient = useQueryClient();
  const tenantId = '1'; // Mock - get from auth context

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', tenantId, selectedStatus],
    queryFn: () => {
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      return ordersApi.getAll(tenantId, params);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: Order['status'] }) =>
      ordersApi.updateStatus(tenantId, orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['orderStats', tenantId] });
      setSelectedOrder(null);
    },
  });

  const statusFilters = [
    { value: 'all', label: 'All Orders', count: ordersData?.total || 0 },
    { value: 'PENDING', label: 'Pending', count: 0 },
    { value: 'CONFIRMED', label: 'Confirmed', count: 0 },
    { value: 'PREPARING', label: 'Preparing', count: 0 },
    { value: 'READY', label: 'Ready', count: 0 },
    { value: 'COMPLETED', label: 'Completed', count: 0 },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
      PREPARING: { color: 'bg-purple-100 text-purple-800', icon: ChefHat },
      READY: { color: 'bg-green-100 text-green-800', icon: Package },
      COMPLETED: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle2 },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow: Record<Order['status'], Order['status'] | null> = {
      PENDING: 'CONFIRMED',
      CONFIRMED: 'PREPARING',
      PREPARING: 'READY',
      READY: 'COMPLETED',
      COMPLETED: null,
      CANCELLED: null,
    };
    return statusFlow[currentStatus];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all your orders
            </p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    selectedStatus === filter.value
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {filter.label}
                <span className={`
                  ml-2 py-0.5 px-2.5 rounded-full text-xs
                  ${
                    selectedStatus === filter.value
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-900'
                  }
                `}>
                  {filter.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">Loading orders...</p>
            </div>
          ) : ordersData?.data.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
              <p className="mt-1 text-sm text-gray-500">No orders match the selected filter</p>
            </div>
          ) : (
            ordersData?.data.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        {getStatusBadge(order.status)}
                        <span className="text-sm text-gray-500">
                          {order.orderType.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {order.customer.firstName} {order.customer.lastName}
                        {order.customer.phoneNumber && ` • ${order.customer.phoneNumber}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-4 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.quantity}x {item.name}
                          {item.customizations.length > 0 && (
                            <span className="text-gray-500 ml-1">
                              ({item.customizations.map((c) => c.name).join(', ')})
                            </span>
                          )}
                        </span>
                        <span className="text-gray-900 font-medium">
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> {order.specialInstructions}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    {getNextStatus(order.status) && (
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            orderId: order.id,
                            status: getNextStatus(order.status)!,
                          })
                        }
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50"
                      >
                        Mark as {getNextStatus(order.status)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Details - {selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                  </p>
                  {selectedOrder.customer.phoneNumber && (
                    <p className="text-sm text-gray-600">
                      {selectedOrder.customer.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Type</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedOrder.orderType.replace('_', ' ')}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Items</h3>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {item.quantity}x {item.name}
                        </span>
                        <span>${item.subtotal.toFixed(2)}</span>
                      </div>
                      {item.customizations.map((custom, idx) => (
                        <div key={idx} className="text-sm text-gray-600 ml-4">
                          + {custom.name} (${custom.priceModifier.toFixed(2)})
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  {selectedOrder.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
