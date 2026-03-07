import { useState, useCallback } from 'react';

const API = `${import.meta.env.VITE_API_URL}/api/admin/appointments`;

// ← change 'token' to whatever key you found in Step 1
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
});

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error,   setError]             = useState(null);

  const fetchAppointments = useCallback(async ({ status = '' } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (status && status !== 'All') params.set('status', status);

      const res = await fetch(`${API}?${params}`, {
        headers: getAuthHeaders(),          // ← added
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAppointments(data.appointments);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAppointment = useCallback(async (data) => {
    const isEdit = !!data.id;
    const res = await fetch(isEdit ? `${API}/${data.id}` : API, {
      method:  isEdit ? 'PUT' : 'POST',
      headers: getAuthHeaders(),            // ← added
      body:    JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to save');
    }
    return res.json();
  }, []);

  const cancelAppointment = useCallback(async (id) => {
    const res = await fetch(`${API}/${id}/cancel`, {
      method:  'PATCH',
      headers: getAuthHeaders(),            // ← added
    });
    if (!res.ok) throw new Error('Failed to cancel');
    return res.json();
  }, []);

  return { appointments, loading, error, fetchAppointments, saveAppointment, cancelAppointment };
}