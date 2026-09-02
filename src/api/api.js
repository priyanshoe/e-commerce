import axios from 'axios';
import initialDb from '../../db.json';

// Local storage key for persistent mock data
const STORAGE_KEY = 'simple_ecommerce_db';

// Helper to get database state
const getLocalDb = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    console.warn('Could not read from localStorage, using default initialDb');
  }
  // Initialize with db.json data if not present
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDb));
  } catch (e) {
    console.error('Could not save to localStorage:', e);
  }
  return JSON.parse(JSON.stringify(initialDb));
};

// Helper to save database state
const saveLocalDb = (db) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Could not save to localStorage:', e);
  }
};

// Create standard Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom adapter to simulate JSON Server REST API using localStorage
// This guarantees smooth execution in all environments while keeping 
// standard REST API patterns (GET, POST, PATCH, DELETE) for learning.
api.defaults.adapter = async (config) => {
  // Simulate standard network latency (50-150ms) for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 80));

  const { method, url, data, params } = config;
  const db = getLocalDb();

  // Normalize URL and extract resource path and ID
  // e.g. '/products/1' -> resource: 'products', id: '1'
  const cleanUrl = url.replace(/^\//, '').split('?')[0];
  const segments = cleanUrl.split('/');
  const resource = segments[0]; // users, businesses, products, cartItems, orders
  const id = segments[1] ? Number(segments[1]) || segments[1] : null;

  if (!db[resource] && resource !== 'reset-db') {
    return {
      data: { error: `Resource '${resource}' not found` },
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config,
    };
  }

  // Handle DB reset helper if ever needed
  if (resource === 'reset-db' && method.toLowerCase() === 'post') {
    saveLocalDb(initialDb);
    return {
      data: { message: 'Database reset successfully' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  const parsedData = typeof data === 'string' ? JSON.parse(data || '{}') : (data || {});

  // 1. GET Requests (All, by ID, or filtered by query params)
  if (method.toLowerCase() === 'get') {
    if (id !== null) {
      const item = db[resource].find((item) => String(item.id) === String(id));
      if (!item) {
        return {
          data: { error: 'Item not found' },
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config,
        };
      }
      return { data: item, status: 200, statusText: 'OK', headers: {}, config };
    }

    // Filter by query parameters if any (e.g. ?sellerId=2 or ?customerId=1)
    let results = [...db[resource]];
    if (params) {
      Object.keys(params).forEach((key) => {
        results = results.filter((item) => String(item[key]) === String(params[key]));
      });
    }

    return { data: results, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 2. POST Requests (Create new item)
  if (method.toLowerCase() === 'post') {
    const newId = db[resource].length > 0
      ? Math.max(...db[resource].map((i) => Number(i.id) || 0)) + 1
      : 1;

    const newItem = {
      id: parsedData.id || newId,
      ...parsedData,
      createdAt: parsedData.createdAt || new Date().toISOString().split('T')[0],
    };

    db[resource].push(newItem);
    saveLocalDb(db);

    return { data: newItem, status: 201, statusText: 'Created', headers: {}, config };
  }

  // 3. PATCH / PUT Requests (Update existing item)
  if (method.toLowerCase() === 'patch' || method.toLowerCase() === 'put') {
    if (id === null) {
      return {
        data: { error: 'ID required for update' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config,
      };
    }

    const index = db[resource].findIndex((item) => String(item.id) === String(id));
    if (index === -1) {
      return {
        data: { error: 'Item not found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
      };
    }

    db[resource][index] = {
      ...db[resource][index],
      ...parsedData,
      id: db[resource][index].id, // protect ID from alteration
    };

    saveLocalDb(db);

    return { data: db[resource][index], status: 200, statusText: 'OK', headers: {}, config };
  }

  // 4. DELETE Requests (Remove item)
  if (method.toLowerCase() === 'delete') {
    if (id === null) {
      return {
        data: { error: 'ID required for delete' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config,
      };
    }

    const initialLength = db[resource].length;
    db[resource] = db[resource].filter((item) => String(item.id) !== String(id));

    if (db[resource].length === initialLength) {
      return {
        data: { error: 'Item not found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
      };
    }

    // Special cascading: If a business is deleted, remove its products as per business rules
    if (resource === 'businesses') {
      db.products = db.products.filter((prod) => String(prod.businessId) !== String(id));
    }

    saveLocalDb(db);

    return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
  }

  return {
    data: { error: 'Method not supported' },
    status: 405,
    statusText: 'Method Not Allowed',
    headers: {},
    config,
  };
};

export default api;
