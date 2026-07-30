import { useState, useEffect, useCallback } from 'react';
import {
  getSalesReport,
  getInventoryReport,
  getCustomerReport,
  exportCSV,
  exportExcel,
  exportPDF,
} from '../services/reportService';

const today = () => new Date().toISOString().slice(0, 10);
const thirtyDaysAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const useReports = () => {
  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const [data, setData] = useState([]);
  const [summary, setSummary] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [exporting, setExporting] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    const filters = { startDate, endDate };

    try {
      let reportData;

      switch (reportType) {
        case 'inventory':
          reportData = await getInventoryReport(filters);
          {
            const totalValue = reportData.reduce((s, r) => s + (r.inventoryValue ?? 0), 0);
            const lowStock = reportData.filter(
              (r) => (r.currentStock ?? 0) <= (r.threshold ?? 10)
            ).length;
            setData(reportData);
            setSummary([
              {
                id: 'totalValue',
                label: 'Inventory Value',
                value: `$${totalValue.toLocaleString()}`,
                icon: 'Package',
                color: '#3b82f6',
                bgColor: '#eff6ff',
              },
              {
                id: 'lowStock',
                label: 'Low Stock Items',
                value: lowStock,
                icon: 'AlertTriangle',
                color: '#ef4444',
                bgColor: '#fef2f2',
              },
              {
                id: 'totalProducts',
                label: 'Total Products',
                value: reportData.length,
                icon: 'Package',
                color: '#f59e0b',
                bgColor: '#fffbeb',
              },
            ]);
          }
          setChartData([]);
          break;

        case 'customers':
          reportData = await getCustomerReport(filters);
          {
            const totalRevenue = reportData.reduce((s, r) => s + (r.totalSpending ?? 0), 0);
            const totalOrders = reportData.reduce((s, r) => s + (r.totalOrders ?? 0), 0);
            setData(reportData);
            setSummary([
              {
                id: 'customers',
                label: 'Customers',
                value: reportData.length,
                icon: 'Users',
                color: '#8b5cf6',
                bgColor: '#f5f3ff',
              },
              {
                id: 'revenue',
                label: 'Total Revenue',
                value: `$${totalRevenue.toLocaleString()}`,
                icon: 'TrendingUp',
                color: '#10b981',
                bgColor: '#ecfdf5',
              },
              {
                id: 'orders',
                label: 'Total Orders',
                value: totalOrders,
                icon: 'ShoppingCart',
                color: '#3b82f6',
                bgColor: '#eff6ff',
              },
            ]);
          }
          setChartData([]);
          break;

        default:
          reportData = await getSalesReport(filters);
          {
            const revenue = reportData.reduce((s, r) => s + (r.revenue ?? 0), 0);
            const orders = reportData.reduce((s, r) => s + (r.orders ?? 0), 0);
            setData(reportData);
            setSummary([
              {
                id: 'revenue',
                label: 'Revenue',
                value: `$${revenue.toLocaleString()}`,
                icon: 'TrendingUp',
                color: '#3b82f6',
                bgColor: '#eff6ff',
              },
              {
                id: 'orders',
                label: 'Orders',
                value: orders,
                icon: 'ShoppingCart',
                color: '#10b981',
                bgColor: '#ecfdf5',
              },
              {
                id: 'aov',
                label: 'Avg Order Value',
                value: `$${(revenue > 0 && orders > 0 ? revenue / orders : 0).toFixed(2)}`,
                icon: 'TrendingUp',
                color: '#f59e0b',
                bgColor: '#fffbeb',
              },
            ]);
          }
          setChartData(
            reportData.map((r) => {
              const d = r.date ? new Date(r.date) : null;
              return {
                month: d ? MONTHS[d.getMonth()] : r.date,
                revenue: r.revenue ?? 0,
                orders: r.orders ?? 0,
              };
            })
          );
          break;
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load report';
      setError(msg);
      showSnackbar(msg, 'error');
      setData([]);
      setSummary([]);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [reportType, startDate, endDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleExport = useCallback(
    async (format) => {
      setExporting(format);
      try {
        const filters = { startDate, endDate };
        const exporters = { csv: exportCSV, excel: exportExcel, pdf: exportPDF };
        await exporters[format](reportType, filters, data);
        showSnackbar(`${format.toUpperCase()} report downloaded`);
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Export failed';
        showSnackbar(msg, 'error');
      } finally {
        setExporting(null);
      }
    },
    [reportType, startDate, endDate, data]
  );

  return {
    reportType,
    setReportType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    data,
    summary,
    chartData,
    loading,
    error,
    snackbar,
    closeSnackbar,
    exporting,
    handleExport,
    refresh: fetchReport,
  };
};

export default useReports;
