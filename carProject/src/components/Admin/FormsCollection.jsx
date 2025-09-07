import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, RefreshCw, Calendar, DollarSign, CreditCard, TrendingUp } from 'lucide-react';

function FormsCollection() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API call
  const mockTransactions = [
    {
      _id: '1',
      payment_provider: 'razorpay',
      razorpay_order_id: 'order_MqhV7wXYZ123',
      razorpay_payment_id: 'pay_MqhV7wXYZ456',
      razorpay_signature: 'sig_xyz123',
      amount: 2500,
      currency: 'INR',
      status: 'paid',
      formData: { name: 'John Doe', email: 'john@example.com', phone: '9876543210' },
      createdAt: new Date('2024-01-15T10:30:00')
    },
    {
      _id: '2',
      payment_provider: 'phonepe',
      phonepe_order_id: 'pp_order_789',
      phonepe_transaction_id: 'pp_txn_456',
      amount: 1500,
      currency: 'INR',
      status: 'failed',
      formData: { name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211' },
      createdAt: new Date('2024-01-14T14:20:00')
    },
    {
      _id: '3',
      payment_provider: 'razorpay',
      razorpay_order_id: 'order_ABC123XYZ',
      amount: 3200,
      currency: 'INR',
      status: 'created',
      formData: { name: 'Mike Johnson', email: 'mike@example.com', phone: '9876543212' },
      createdAt: new Date('2024-01-16T09:15:00')
    },
    {
      _id: '4',
      payment_provider: 'phonepe',
      phonepe_order_id: 'pp_order_999',
      phonepe_transaction_id: 'pp_txn_888',
      amount: 5000,
      currency: 'INR',
      status: 'paid',
      formData: { name: 'Sarah Wilson', email: 'sarah@example.com', phone: '9876543213' },
      createdAt: new Date('2024-01-13T16:45:00')
    },
    {
      _id: '5',
      payment_provider: 'razorpay',
      razorpay_order_id: 'order_DEF456GHI',
      razorpay_payment_id: 'pay_DEF456GHI789',
      amount: 1800,
      currency: 'INR',
      status: 'paid',
      formData: { name: 'Robert Brown', email: 'robert@example.com', phone: '9876543214' },
      createdAt: new Date('2024-01-12T11:30:00')
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.formData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.formData?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.razorpay_order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phonepe_order_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Provider filter
    if (providerFilter !== 'all') {
      filtered = filtered.filter(t => t.payment_provider === providerFilter);
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, statusFilter, providerFilter, transactions]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'created': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStats = () => {
    const totalTransactions = transactions.length;
    const paidTransactions = transactions.filter(t => t.status === 'paid');
    const totalRevenue = paidTransactions.reduce((sum, t) => sum + t.amount, 0);
    const successRate = totalTransactions ? ((paidTransactions.length / totalTransactions) * 100).toFixed(1) : 0;

    return { totalTransactions, totalRevenue, successRate, paidCount: paidTransactions.length };
  };

  const stats = getStats();

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and monitor all payment transactions</p>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.totalRevenue)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.paidCount}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="created">Created</option>
              </select>

              {/* Provider Filter */}
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Providers</option>
                <option value="razorpay">Razorpay</option>
                <option value="phonepe">PhonePe</option>
              </select>

              {/* Export Button */}
              <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Transactions ({filteredTransactions.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading transactions...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.formData?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.formData?.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.payment_provider === 'razorpay' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {transaction.payment_provider.charAt(0).toUpperCase() + transaction.payment_provider.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.razorpay_order_id || transaction.phonepe_order_id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatAmount(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTransactions.length === 0 && !loading && (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No transactions found matching your filters.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                    <p className="text-sm text-gray-900">{selectedTransaction._id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Provider</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.payment_provider}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <p className="text-sm text-gray-900">{formatAmount(selectedTransaction.amount)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.status}</p>
                  </div>
                  {selectedTransaction.razorpay_order_id && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Razorpay Order ID</label>
                      <p className="text-sm text-gray-900">{selectedTransaction.razorpay_order_id}</p>
                    </div>
                  )}
                  {selectedTransaction.razorpay_payment_id && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Razorpay Payment ID</label>
                      <p className="text-sm text-gray-900">{selectedTransaction.razorpay_payment_id}</p>
                    </div>
                  )}
                  {selectedTransaction.phonepe_order_id && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">PhonePe Order ID</label>
                      <p className="text-sm text-gray-900">{selectedTransaction.phonepe_order_id}</p>
                    </div>
                  )}
                  {selectedTransaction.phonepe_transaction_id && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">PhonePe Transaction ID</label>
                      <p className="text-sm text-gray-900">{selectedTransaction.phonepe_transaction_id}</p>
                    </div>
                  )}
                </div>
                
                {selectedTransaction.formData && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Form Data</label>
                    <div className="mt-2 bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                        {JSON.stringify(selectedTransaction.formData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedTransaction.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormsCollection;