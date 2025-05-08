import { useState, useEffect, useCallback } from 'react';
import {
  fetchArrows as apiFetchArrows,
  createArrow as apiCreateArrow,
  updateArrow as apiUpdateArrow,
  deleteArrow as apiDeleteArrow,
} from '../services/quiverApiService';
import { message } from 'antd';

export const useArrows = (quiverId) => {
  const [arrows, setArrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadArrows = useCallback(async () => {
    if (!quiverId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiFetchArrows(quiverId);
      setArrows(data);
    } catch (err) {
      setError(err);
      message.error(`Failed to load arrows for quiver ${quiverId}.`);
    } finally {
      setLoading(false);
    }
  }, [quiverId]);

  useEffect(() => {
    loadArrows();
  }, [loadArrows]);

  const addArrow = async (arrowData) => {
    setLoading(true);
    try {
      const { data: newArrow } = await apiCreateArrow(quiverId, arrowData);
      setArrows((prevArrows) => [...prevArrows, newArrow]);
      message.success('Arrow added successfully.');
      return newArrow;
    } catch (err) {
      message.error('Failed to add arrow.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editArrow = async (arrowId, arrowData) => {
    setLoading(true);
    try {
      const { data: updatedArrow } = await apiUpdateArrow(arrowId, arrowData);
      setArrows((prevArrows) =>
        prevArrows.map((a) => (a.id === arrowId ? updatedArrow : a))
      );
      message.success('Arrow updated successfully.');
      return updatedArrow;
    } catch (err) {
      message.error('Failed to update arrow.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeArrow = async (arrowId) => {
    setLoading(true);
    try {
      await apiDeleteArrow(arrowId);
      setArrows((prevArrows) => prevArrows.filter((a) => a.id !== arrowId));
      message.success('Arrow deleted successfully.');
    } catch (err) {
      message.error('Failed to delete arrow.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { arrows, loading, error, addArrow, editArrow, removeArrow, refreshArrows: loadArrows };
};