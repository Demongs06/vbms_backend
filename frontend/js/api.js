const API_BASE_URL = 'http://localhost:5000/api';
// Helper function for API calls
async function apiCall(endpoint, options = {}) {
const token = localStorage.getItem('adminToken');
const config = {
headers: {
'Content-Type': 'application/json',
...(token && { 'Authorization': `Bearer ${token}` })
},
...options
};
try {
const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
const data = await response.json();
if (!response.ok) {
throw new Error(data.error || 'Request failed');
}
return data;
} catch (error) {
console.error('API Error:', error);
throw error;
}
}
// Request API functions
const RequestAPI = {
create: (requestData) => apiCall('/requests', {
method: 'POST',
body: JSON.stringify(requestData)
}),
getAll: (filters) => {
const queryString = new URLSearchParams(filters).toString();
return apiCall(`/requests?${queryString}`);
},
accept: (id) => apiCall(`/requests/${id}/accept`, {
method: 'PUT'
}),
assignStaff: (id, staff) => apiCall(`/requests/${id}/assign`, {
method: 'PUT',
body: JSON.stringify(staff)
}),
complete: (id) => apiCall(`/requests/${id}/complete`, {
method: 'PUT'
})
};
// Staff API functions
const StaffAPI = {
add: (staffData) => apiCall('/staff', {
method: 'POST',
body: JSON.stringify(staffData)
}),
getAll: () => apiCall('/staff'),
remove: (id) => apiCall(`/staff/${id}`, {
method: 'DELETE'
}),
toggleAvailability: (id) => apiCall(`/staff/${id}/availability`, {
method: 'PUT'
})
};
// Bill API functions
const BillAPI = {
generate: (billData) => apiCall('/bills', {
method: 'POST',
body: JSON.stringify(billData)
}),
getById: (id) => apiCall(`/bills/${id}`),
markPaid: (id) => apiCall(`/bills/${id}/pay`, {
method: 'PUT'
})
};
// Review API functions
const ReviewAPI = {
submit: (reviewData) => apiCall('/reviews', {
method: 'POST',
body: JSON.stringify(reviewData)
}),
getRecent: () => apiCall('/reviews/recent')
};
