import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TripBudget = () => {
  const { tripId } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: 'transport',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const expenseCategories = [
    { id: 'transport', name: 'Transport', icon: 'fas fa-plane', color: '#3b82f6' },
    { id: 'accommodation', name: 'Stay', icon: 'fas fa-bed', color: '#10b981' },
    { id: 'activities', name: 'Activities', icon: 'fas fa-camera', color: '#f59e0b' },
    { id: 'meals', name: 'Meals', icon: 'fas fa-utensils', color: '#ef4444' },
    { id: 'shopping', name: 'Shopping', icon: 'fas fa-shopping-bag', color: '#8b5cf6' },
    { id: 'other', name: 'Other', icon: 'fas fa-ellipsis-h', color: '#6b7280' }
  ];

  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  const fetchTripData = async () => {
    try {
      const response = await axios.get(`/api/trips/${tripId}`);
      const tripData = response.data.trip;

      if (!tripData) {
        toast.error('Trip not found');
        return;
      }

      setTrip(tripData);

      // Fetch expenses for this trip
      const expensesResponse = await axios.get(`/api/trips/${tripId}/expenses`);
      setExpenses(expensesResponse.data.expenses || []);
    } catch (error) {
      console.error('Error fetching trip data:', error);
      toast.error('Failed to load trip data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!newExpense.amount || !newExpense.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const expenseData = {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        tripId: tripId
      };

      const response = await axios.post(`/api/trips/${tripId}/expenses`, expenseData);
      const newExpenseRecord = response.data.expense;

      const updatedExpenses = [...expenses, newExpenseRecord];
      setExpenses(updatedExpenses);

      // Reset form
      setNewExpense({
        category: 'transport',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddExpense(false);
      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await axios.delete(`/api/trips/${tripId}/expenses/${expenseId}`);

      const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
      setExpenses(updatedExpenses);

      toast.success('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Trip not found
        </div>
      </div>
    );
  }

  // Calculate budget statistics
  const totalBudget = trip.budget || 0;
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Calculate category breakdown
  const categoryBreakdown = expenseCategories.map(category => {
    const categoryExpenses = expenses.filter(exp => exp.category === category.id);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      ...category,
      total,
      count: categoryExpenses.length,
      expenses: categoryExpenses
    };
  }).filter(cat => cat.total > 0);

  // Calculate daily breakdown
  const tripDays = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))
    : 1;
  const avgCostPerDay = totalSpent / tripDays;
  const budgetPerDay = totalBudget / tripDays;

  // Chart data
  const budgetChartData = {
    labels: ['Spent', 'Remaining'],
    datasets: [{
      data: [totalSpent, Math.max(0, remaining)],
      backgroundColor: ['#ef4444', '#10b981'],
      borderWidth: 0
    }]
  };

  const categoryChartData = {
    labels: categoryBreakdown.map(cat => cat.name),
    datasets: [{
      data: categoryBreakdown.map(cat => cat.total),
      backgroundColor: categoryBreakdown.map(cat => cat.color),
      borderWidth: 0
    }]
  };

  const dailyChartData = {
    labels: ['Budget/Day', 'Actual/Day'],
    datasets: [{
      label: 'Amount',
      data: [budgetPerDay, avgCostPerDay],
      backgroundColor: ['#3b82f6', '#f59e0b'],
      borderWidth: 0
    }]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container-fluid"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="font-poppins mb-1">
                <i className="fas fa-chart-pie me-2 text-primary"></i>
                Trip Budget
              </h2>
              <p className="text-muted mb-0">{trip.title}</p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary btn-modern"
                onClick={() => setShowAddExpense(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Add Expense
              </button>
              <Link to={`/trips/${tripId}`} className="btn btn-outline-secondary btn-modern">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Trip
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Budget Overview Cards */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-md-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <i className="fas fa-wallet fa-2x text-primary mb-3"></i>
              <h5 className="card-title">Total Budget</h5>
              <h3 className="text-primary">{trip.currency} {totalBudget.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <i className="fas fa-credit-card fa-2x text-danger mb-3"></i>
              <h5 className="card-title">Total Spent</h5>
              <h3 className="text-danger">{trip.currency} {totalSpent.toLocaleString()}</h3>
              <small className="text-muted">{spentPercentage.toFixed(1)}% of budget</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <i className={`fas fa-piggy-bank fa-2x ${remaining >= 0 ? 'text-success' : 'text-warning'} mb-3`}></i>
              <h5 className="card-title">Remaining</h5>
              <h3 className={remaining >= 0 ? 'text-success' : 'text-warning'}>
                {trip.currency} {remaining.toLocaleString()}
              </h3>
              {remaining < 0 && <small className="text-warning">Over budget!</small>}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card card-modern h-100">
            <div className="card-body text-center">
              <i className="fas fa-calendar-day fa-2x text-info mb-3"></i>
              <h5 className="card-title">Avg/Day</h5>
              <h3 className="text-info">{trip.currency} {avgCostPerDay.toFixed(0)}</h3>
              <small className="text-muted">Budget: {trip.currency} {budgetPerDay.toFixed(0)}/day</small>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-md-4">
          <div className="card card-modern h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Budget Overview
              </h5>
            </div>
            <div className="card-body">
              <div style={{ height: '250px' }}>
                <Doughnut
                  data={budgetChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-modern h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Category Breakdown
              </h5>
            </div>
            <div className="card-body">
              <div style={{ height: '250px' }}>
                {categoryBreakdown.length > 0 ? (
                  <Doughnut
                    data={categoryChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="text-center text-muted">
                      <i className="fas fa-chart-pie fa-3x mb-3"></i>
                      <p>No expenses added yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-modern h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Daily Average
              </h5>
            </div>
            <div className="card-body">
              <div style={{ height: '250px' }}>
                <Bar
                  data={dailyChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Breakdown Cards */}
      {categoryBreakdown.length > 0 && (
        <motion.div variants={itemVariants} className="row mb-4">
          <div className="col-12">
            <div className="card card-modern">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-list me-2"></i>
                  Expense Categories
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {categoryBreakdown.map(category => (
                    <div key={category.id} className="col-md-6 col-lg-4 mb-3">
                      <div className="border rounded p-3 h-100">
                        <div className="d-flex align-items-center mb-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: '40px',
                              height: '40px',
                              backgroundColor: category.color + '20',
                              color: category.color
                            }}
                          >
                            <i className={category.icon}></i>
                          </div>
                          <div>
                            <h6 className="mb-0">{category.name}</h6>
                            <small className="text-muted">{category.count} expenses</small>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold" style={{ color: category.color }}>
                            {trip.currency} {category.total.toLocaleString()}
                          </span>
                          <small className="text-muted">
                            {((category.total / totalSpent) * 100).toFixed(1)}%
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Budget Alerts */}
      {spentPercentage > 80 && (
        <motion.div variants={itemVariants} className="row mb-4">
          <div className="col-12">
            <div className={`alert ${spentPercentage > 100 ? 'alert-danger' : 'alert-warning'}`}>
              <i className={`fas ${spentPercentage > 100 ? 'fa-exclamation-triangle' : 'fa-exclamation-circle'} me-2`}></i>
              <strong>Budget Alert:</strong>
              {spentPercentage > 100
                ? ` You are ${(spentPercentage - 100).toFixed(1)}% over budget!`
                : ` You have used ${spentPercentage.toFixed(1)}% of your budget.`
              }
            </div>
          </div>
        </motion.div>
      )}

      {/* Expense List */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="card card-modern">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-receipt me-2"></i>
                Recent Expenses ({expenses.length})
              </h5>
            </div>
            <div className="card-body">
              {expenses.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(expense => {
                        const category = expenseCategories.find(cat => cat.id === expense.category);
                        return (
                          <tr key={expense.id}>
                            <td>{new Date(expense.date).toLocaleDateString()}</td>
                            <td>
                              <span className="d-flex align-items-center">
                                <i
                                  className={`${category?.icon} me-2`}
                                  style={{ color: category?.color }}
                                ></i>
                                {category?.name}
                              </span>
                            </td>
                            <td>{expense.description}</td>
                            <td className="fw-bold">
                              {trip.currency} {expense.amount.toLocaleString()}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteExpense(expense.id)}
                                title="Delete expense"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-receipt fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No expenses added yet</h5>
                  <p className="text-muted">Start tracking your trip expenses by adding your first expense.</p>
                  <button
                    className="btn btn-primary btn-modern"
                    onClick={() => setShowAddExpense(true)}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add First Expense
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>
                  Add New Expense
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddExpense(false)}
                ></button>
              </div>
              <form onSubmit={handleAddExpense}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Category <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={newExpense.category}
                          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                          required
                        >
                          {expenseCategories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Amount ({trip.currency}) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Description <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      placeholder="e.g., Flight tickets, Hotel booking, Restaurant meal"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddExpense(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i>
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TripBudget;
