import axios from "axios";

const API_BASE_URL = "https://uat.smartassistapp.in/api/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const authHeaders = getAuthHeaders();
      config.headers = { ...config.headers, ...authHeaders };
    } catch (error) {}
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
  (error) => {
    return Promise.reject(error);
  },
);

// ============ LEAD ACTIVITY METHODS ============

// Get all activities for a lead
export const getLeadActivities = async (leadId) => {
  try {
    // console.log("📡 Fetching activities for lead:", leadId);
    const response = await axiosInstance.get(
      `dealer/leads/${leadId}/activities`,
    );
    // console.log("✅ Lead activities fetched successfully");
    return response;
  } catch (error) {
    // console.error("❌ Error fetching lead activities:", error);
    throw error;
  }
};

// Create new activity
export const createActivity = async (activityData) => {
  try {
    // console.log("📡 Creating new activity:", activityData);
    const response = await axiosInstance.post(
      "dealer/activities/create",
      activityData,
    );
    // console.log("✅ Activity created successfully");
    return response;
  } catch (error) {
    // console.error("❌ Error creating activity:", error);
    throw error;
  }
};

// Update activity
export const updateActivity = async (activityId, activityData) => {
  try {
    // console.log("📡 Updating activity:", activityId, activityData);
    const response = await axiosInstance.put(
      `dealer/activities/update/${activityId}`,
      activityData,
    );
    // console.log("✅ Activity updated successfully");
    return response;
  } catch (error) {
    // console.error("❌ Error updating activity:", error);
    throw error;
  }
};

// Delete activity
export const deleteActivity = async (activityId) => {
  try {
    // console.log("📡 Deleting activity:", activityId);
    const response = await axiosInstance.delete(
      `dealer/activities/delete/${activityId}`,
    );
    // console.log("✅ Activity deleted successfully");
    return response;
  } catch (error) {
    // console.error("❌ Error deleting activity:", error);
    throw error;
  }
};

// ============ EXISTING LEAD METHODS ============

// Get all leads with filters
export const getAllLeadByDealer = async (payload) => {
  try {
    // console.log("📡 Fetching leads with payload:", payload);

    const params = new URLSearchParams();
    params.append("page", payload.page || 1);
    params.append("limit", payload.limit || 10);

    if (payload.search) params.append("search", payload.search);
    if (payload.source) params.append("source", payload.source);
    if (payload.user_id) params.append("user_id", payload.user_id);
    if (payload.status) params.append("status", payload.status);
    if (payload.pmi) params.append("pmi", payload.pmi);

    if (payload.start_date) params.append("start_date", payload.start_date);
    if (payload.end_date) params.append("end_date", payload.end_date);

    const url = `dealer/leads/all?${params.toString()}`;

    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};
// Get single lead by ID
export const getLeadByDealerId = async (payload) => {
  try {
    const url = `dealer/leads/${payload.id}?page=${payload.page}&limit=${payload.limit}`;
    // console.log("📡 Fetching single lead:", url);

    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    // console.error("❌ Error fetching single lead:", error);
    throw error;
  }
};

// Reassign lead
export const leadReassign = async (payload) => {
  try {
    // console.log("📡 Reassigning leads:", payload);
    const response = await axiosInstance.put("dealer/leads/reassign", payload);
    // console.log("✅ Leads reassigned successfully");
    return response;
  } catch (error) {
    // console.error("❌ Error reassigning leads:", error);
    throw error;
  }
};

// Open single lead
export const singLeadOpen = async (payload) => {
  try {
    // console.log("📡 Opening lead:", payload);
    const response = await axiosInstance.put(
      `dealer/leads/${payload.leadId}/update`,
      {
        status: payload.status,
        sp_id: payload.sp_id,
      },
    );
    // console.log("✅ Lead opened successfully");
    return response;
  } catch (error) {
    // console.error("❌ Error opening lead:", error);
    throw error;
  }
};

// Get all dealer users FOR REASSIGN - CORRECTED
export const getAllDealerUser = async () => {
  try {
    // console.log("📡 Fetching dealer users for reassign...");
    const response = await axiosInstance.get("dealer/users/all");
    // console.log("✅ Users for reassign fetched successfully");
    return response;
  } catch (error) {
    // console.error("❌ Error fetching users for reassign:", error);
    throw error;
  }
};

export const getLeadDetails = async (leadId) => {
  try {
    // console.log("📡 Fetching lead details for:", leadId);

    // Validate leadId
    if (!leadId) {
      throw new Error("Lead ID is required");
    }

    const response = await axiosInstance.get(`dealer/leads/${leadId}`);

    // console.log("✅ Lead details API response:", {
    //   status: response.status,
    //   success: response.data?.success,
    //   data: response.data?.data ? "Present" : "Missing",
    // });

    return response;
  } catch (error) {
    // console.error("❌ Error fetching lead details:", {
    //   leadId,
    //   error: error.message,
    //   status: error.response?.status,
    //   data: error.response?.data,
    // });
    throw error;
  }
};
// In src/services/enquiryService.js - Update the reassignLeads function
export const reassignLeads = async (payload) => {
  try {
    // console.log("📡 Reassigning leads (reassignLeads):", payload);

    // Transform the payload to match API expectations
    const apiPayload = {
      user_id: payload.user_id,
      leadIds: payload.lead_ids || payload.leadIds, // Use leadIds with capital I
    };

    // console.log("🔄 Transformed payload for API:", apiPayload);

    const response = await axiosInstance.put(
      "dealer/leads/reassign",
      apiPayload,
    );
    // console.log("✅ Leads reassigned successfully");
    return response;
  } catch (error) {
    // console.error("❌ Error reassigning leads:", error);
    throw error;
  }
};

// Get dropdown data FOR FILTERS
export const getDropdownData = async () => {
  try {
    // console.log("📡 Fetching dropdown data from API...");
    const response = await axiosInstance.get("dealer/users/data/all");
    // console.log("✅ Dropdown data fetched successfully from API");
    return response;
  } catch (error) {
    // console.error("❌ Error fetching dropdown data:", error);
    throw error;
  }
};

// Get leads with date filter
export const getLeadsByDate = async (startDate, endDate) => {
  try {
    // console.log("📡 Fetching leads by date:", { startDate, endDate });
    const response = await axiosInstance.get(
      `dealer/leads/all?start_date=${startDate}&end_date=${endDate}`,
    );
    // console.log("✅ Date filtered leads fetched successfully");
    return response;
  } catch (error) {
    // console.error("❌ Error fetching date filtered leads:", error);
    throw error;
  }
};

// Test API connection
export const testConnection = async () => {
  try {
    const response = await axiosInstance.get("dealer/leads/all?page=1&limit=1");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============ AUTH SERVICE FUNCTIONS ============

export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const isAuth = !!token;
  // console.log("🔐 Auth check:", isAuth ? "Authenticated" : "Not authenticated");
  return isAuth;
};

export const logout = () => {
  // console.log("🚪 Logging out...");
  localStorage.removeItem("token");
  localStorage.removeItem("dealerId");
  window.location.href = "/login";
};

export const debugAuth = () => {
  const token = localStorage.getItem("token");
  // console.log("🔍 Auth Debug:", {
  //   tokenPresent: !!token,
  //   tokenLength: token?.length,
  //   tokenStart: token?.substring(0, 20) + "...",
  // });
  return !!token;
};

export const updateLeadStatus = async (leadId, payload) => {
  try {
    // console.log("📡 Updating lead status:", leadId, payload);
    const response = await axiosInstance.put(
      `dealer/leads/${leadId}/update`,
      payload,
    );
    // console.log("✅ Lead status updated successfully");
    return response;
  } catch (error) {
    // console.error("❌ Error updating lead status:", error);
    throw error;
  }
};

// ============ EXPORTS ============

// Export as objects for backward compatibility
export const enquiryService = {
  // Activity methods
  getLeadActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getLeadDetails,
  updateLeadStatus,

  // Existing lead methods
  getAllLeadByDealer,
  reassignLeads,
  getLeadByDealerId,
  leadReassign,
  singLeadOpen,
  getAllDealerUser,
  getDropdownData,
  getLeadsByDate,
  testConnection,
};

export const authService = {
  getToken,
  isAuthenticated,
  logout,
  debugAuth,
};

// Default export with all methods
export default {
  enquiryService,
  authService,
  // Individual exports for direct importing
  getLeadActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getAllLeadByDealer,
  getLeadByDealerId,
  leadReassign,
  singLeadOpen,
  getAllDealerUser,
  getDropdownData,
  getLeadsByDate,
  testConnection,
  getToken,
  isAuthenticated,
  logout,
  debugAuth,
};
