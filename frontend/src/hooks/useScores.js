import { useState, useEffect, useCallback } from "react";
// Import from the consolidated quiverApiService
import { 
  fetchScoresForArrow, 
  addScoreToArrow, 
  deleteScoreEntry 
} from "../services/quiverApiService";

export function useScores(arrowId) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchScores = useCallback(async () => {
    if (!arrowId) {
      setScores([]);
      return;
    }
    
    setLoading(true);
    try {
      // Use the new service function
      const { data } = await fetchScoresForArrow(arrowId);
      setScores(data);
      setError(null);
    } catch (err) {
      console.error(`Failed to fetch scores for arrow ${arrowId}:`, err);
      setError("Failed to load scores");
      setScores([]);
    } finally {
      setLoading(false);
    }
  }, [arrowId]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const addScore = async (score) => {
    if (!arrowId) return null;
    
    try {
      // Use the new service function; ensure scoreData matches backend expectations
      // Assuming 'score' is an object like { value: 10, timestamp: ... } or just a number
      const scoreData = typeof score === 'object' ? score : { value: score }; 
      const { data: newScore } = await addScoreToArrow(arrowId, scoreData);
      setScores(current => [...current, newScore]);
      return newScore;
    } catch (err) {
      console.error("Failed to add score:", err);
      throw err;
    }
  };

  const deleteScore = async (scoreId) => {
    try {
      // Use the new service function
      await deleteScoreEntry(scoreId);
      setScores(current => current.filter(score => score.id !== scoreId));
    } catch (err) {
      console.error("Failed to delete score:", err);
      throw err;
    }
  };

  const deleteLastScore = async () => {
    if (scores.length === 0) return;
    
    const lastScore = scores[scores.length - 1];
    await deleteScore(lastScore.id);
  };

  return {
    scores,
    loading,
    error,
    addScore,
    deleteScore,
    deleteLastScore,
    refreshScores: fetchScores
  };
}
