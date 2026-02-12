import axios from "axios";

const API_BASE_URL = "https://uat.smartassistapp.in/api/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

const requestCache = new Map();

const getToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("authToken");
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  },
);

const handleLogout = () => {
  localStorage.clear();
  requestCache.clear();
  window.location.href = "/login";
};

const cachedGet = (url, options = {}) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const now = Date.now();
  const cacheDuration = 5000; // 5 seconds cache

  if (requestCache.has(cacheKey)) {
    const cached = requestCache.get(cacheKey);

    if (cached.promise) {
      return cached.promise;
    }

    if (cached.timestamp && now - cached.timestamp < cacheDuration) {
      return Promise.resolve(cached.data);
    }
  }

  const promise = axiosInstance
    .get(url, options)
    .then((response) => {
      requestCache.set(cacheKey, {
        data: response,
        timestamp: now,
        promise: null,
      });
      return response;
    })
    .catch((error) => {
      requestCache.delete(cacheKey);
      throw error;
    });

  requestCache.set(cacheKey, {
    promise,
    timestamp: null,
    data: null,
  });

  return promise;
};

const clearCache = (urlPattern) => {
  for (const [key] of requestCache.entries()) {
    if (key.includes(urlPattern)) {
      requestCache.delete(key);
    }
  }
};

export const masterService = {
  getAllVariant: () => cachedGet("dealer/vehicles/unique-all"),

  createVariant: (payload) =>
    axiosInstance
      .post("dealer/vehicles/variant/add", payload)
      .then((response) => {
        clearCache("dealer/vehicles/unique-all");
        return response;
      }),

  updateVariant: (payload) =>
    axiosInstance
      .put(`dealer/variant/update/${payload.vehicleId}`, payload)
      .then((response) => {
        clearCache("dealer/vehicles/unique-all");
        return response;
      }),

  deleteVariant: (payload) =>
    axiosInstance
      .delete(`dealer/variant/delete/${payload.vehicleId}`)
      .then((response) => {
        clearCache("dealer/vehicles/unique-all");
        return response;
      }),

  testConnection: () => axiosInstance.get("health-check"),

  clearCache: clearCache,
};

export const authService = {
  getToken,
  logout: handleLogout,
  isAuthenticated: () => {
    const token = getToken();
    return !!token;
  },
};
