import { useState, useEffect, useCallback } from 'react';
import {
  fetchQuivers as apiFetchQuivers,
  createQuiver as apiCreateQuiver,
  updateQuiver as apiUpdateQuiver,
  deleteQuiver as apiDeleteQuiver,
} from '../services/quiverApiService';
import { message } from 'antd';

export const useQuivers = () => {
  console.log("useQuivers hook initialized"); // <--- ADD THIS
  const [quivers, setQuivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadQuivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiFetchQuivers();
      setQuivers(data);
    } catch (err) {
      setError(err);
      message.error('Failed to load quivers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuivers();
  }, [loadQuivers]);

  const addQuiver = async (quiverData) => {
    setLoading(true);
    try {

      const { data: newQuiver } = await apiCreateQuiver(quiverData); 
      setQuivers((prevQuivers) => [...prevQuivers, newQuiver]); 

      message.success('Quiver created successfully.');
      return newQuiver;
    } catch (err) {
      message.error('Failed to create quiver.');
      throw err;
    } finally {
      setLoading(false); 
    }
  };

  const editQuiver = async (quiverId, quiverData) => {
    setLoading(true);
    try {
      const { data: updatedQuiver } = await apiUpdateQuiver(quiverId, quiverData);
      setQuivers((prevQuivers) =>
        prevQuivers.map((q) => (q.id === quiverId ? updatedQuiver : q))
      );
      message.success('Quiver updated successfully.');
      return updatedQuiver;
    } catch (err) {
      message.error('Failed to update quiver.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeQuiver = async (quiverId) => {
    setLoading(true);
    try {
      await apiDeleteQuiver(quiverId);
      setQuivers((prevQuivers) => prevQuivers.filter((q) => q.id !== quiverId));
      message.success('Quiver deleted successfully.');
    } catch (err) {
      message.error('Failed to delete quiver.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { quivers, loading, error, addQuiver, editQuiver, removeQuiver, refreshQuivers: loadQuivers };
};
