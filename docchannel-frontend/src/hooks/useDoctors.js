import { useCallback, useState } from "react";

// ← same key as above
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
});

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchDoctors = useCallback(async ({ search = '', availableOnly = false } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (availableOnly) params.set('available', 'true');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/doctor?${params}`,
        { headers: getAuthHeaders() }       // ← added
      );
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      const normalized = data.map(d => ({ ...d, available: d.available === 1 }));
      setDoctors(normalized);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { doctors, loading, error, fetchDoctors };
}