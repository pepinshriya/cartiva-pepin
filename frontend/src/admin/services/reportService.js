import axios from 'axios';
import { getAccessToken } from '../../auth/cognitoService';
import API_CONFIG from '../../config/api';

const analyticsApi = axios.create({
  baseURL: API_CONFIG.analytics.baseURL,
  headers: { 'Content-Type': 'application/json' },
});

analyticsApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Token unavailable — proceed without header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

analyticsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const generateCSV = (rows, columns) => {
  const header = columns.map((c) => `"${c.label}"`).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const val = c.accessor(row);
          const str = val === null || val === undefined ? '' : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(',')
    )
    .join('\n');
  return `${header}\n${body}`;
};

export const getSalesReport = async (filters = {}) => {
  const params = {};
  if (filters.startDate) {
    params.startDate = filters.startDate;
  }
  if (filters.endDate) {
    params.endDate = filters.endDate;
  }
  const response = await analyticsApi.get('/api/analytics/reports/sales', { params });
  return response.data?.data ?? response.data ?? [];
};

export const getInventoryReport = async (filters = {}) => {
  const params = {};
  if (filters.startDate) {
    params.startDate = filters.startDate;
  }
  if (filters.endDate) {
    params.endDate = filters.endDate;
  }
  const response = await analyticsApi.get('/api/analytics/reports/inventory', { params });
  return response.data?.data ?? response.data ?? [];
};

export const getCustomerReport = async (filters = {}) => {
  const params = {};
  if (filters.startDate) {
    params.startDate = filters.startDate;
  }
  if (filters.endDate) {
    params.endDate = filters.endDate;
  }
  const response = await analyticsApi.get('/api/analytics/reports/customers', { params });
  return response.data?.data ?? response.data ?? [];
};

export const exportCSV = async (reportType, filters, rows) => {
  const columns = getExportColumns(reportType);
  const filename = `${reportType}-report-${new Date().toISOString().slice(0, 10)}.csv`;
  const csv = generateCSV(rows, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

export const exportExcel = async (reportType, filters, rows) => {
  const columns = getExportColumns(reportType);
  const filename = `${reportType}-report-${new Date().toISOString().slice(0, 10)}.xls`;
  const csv = generateCSV(rows, columns);
  const html = `<html><table>${csv
    .split('\n')
    .map(
      (r) =>
        `<tr>${r
          .split(',')
          .map((c) => `<td>${c.replace(/"/g, '')}</td>`)
          .join('')}</tr>`
    )
    .join('')}</table></html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  downloadBlob(blob, filename);
};

export const exportPDF = async (reportType, filters, rows) => {
  const columns = getExportColumns(reportType);
  const filename = `${reportType}-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  const lines = [
    `${reportType.toUpperCase()} REPORT`,
    `Generated: ${new Date().toLocaleString()}`,
    '',
  ];
  const header = columns.map((c) => c.label).join(' | ');
  lines.push(header);
  lines.push('-'.repeat(header.length));
  rows.forEach((row) => {
    lines.push(columns.map((c) => c.accessor(row) ?? '').join(' | '));
  });
  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'application/pdf' });
  downloadBlob(blob, filename);
};

const getExportColumns = (reportType) => {
  switch (reportType) {
    case 'sales':
      return [
        { label: 'Date', accessor: (r) => r.date ?? '' },
        { label: 'Orders', accessor: (r) => r.orders ?? 0 },
        { label: 'Revenue', accessor: (r) => r.revenue ?? 0 },
        { label: 'Avg Order Value', accessor: (r) => r.avgOrderValue ?? 0 },
      ];
    case 'inventory':
      return [
        { label: 'Product', accessor: (r) => r.productName ?? '' },
        { label: 'Current Stock', accessor: (r) => r.currentStock ?? 0 },
        { label: 'Threshold', accessor: (r) => r.threshold ?? 0 },
        { label: 'Inventory Value', accessor: (r) => r.inventoryValue ?? 0 },
      ];
    case 'customers':
      return [
        { label: 'Name', accessor: (r) => r.name ?? '' },
        { label: 'Email', accessor: (r) => r.email ?? '' },
        { label: 'Orders', accessor: (r) => r.totalOrders ?? 0 },
        { label: 'Total Spending', accessor: (r) => r.totalSpending ?? 0 },
        { label: 'Last Purchase', accessor: (r) => r.lastPurchase ?? '' },
      ];
    default:
      return [];
  }
};
