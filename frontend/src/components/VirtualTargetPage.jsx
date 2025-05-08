import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Typography, message, Row, Col, List } from "antd";
import { useActiveArrow as useGlobalActiveArrow } from "../contexts/ActiveArrowContext"; // Renamed for clarity
import { useQuivers } from "../hooks/useQuivers";
import { useArrows } from "../hooks/useArrows";
import { addScoreToArrow as apiAddScoreToArrow } from "../services/quiverApiService";
import TargetFace from "./TargetFace";
import styles from "./TargetPractice.module.css";

const { Title, Paragraph, Text } = Typography;

const initialSessionScores = {};

export default function VirtualTargetPage() {
  const { activeQuiver: globalActiveQuiver, activeArrow: globalActiveArrow } = useGlobalActiveArrow();
  const { quivers: allQuivers, loading: quiversLoading } = useQuivers();
  const [targetPageActiveQuiverId, setTargetPageActiveQuiverId] = useState(null);
  const [targetPageActiveArrowId, setTargetPageActiveArrowId] = useState(null);
  const { arrows: arrowsForSelectedQuiver, loading: arrowsLoading } = useArrows(targetPageActiveQuiverId);
  const [sessionScores, setSessionScores] = useState(initialSessionScores);
  const shotRecordRef = useRef(null);

  useEffect(() => {
    if (globalActiveQuiver && !targetPageActiveQuiverId) {
      setTargetPageActiveQuiverId(globalActiveQuiver.id);
    }
    if (globalActiveArrow && !targetPageActiveArrowId && globalActiveArrow.quiverId === (targetPageActiveQuiverId || globalActiveQuiver?.id)) {
      setTargetPageActiveArrowId(globalActiveArrow.id);
    }
  }, [globalActiveQuiver, globalActiveArrow, targetPageActiveQuiverId, targetPageActiveArrowId]);

  const handleTargetScore = (shotDataFromTarget) => {
    if (!targetPageActiveQuiverId || !targetPageActiveArrowId) {
      message.warn("Please select a quiver and an arrow to record scores.");
      return;
    }

    const newScore = {
      value: shotDataFromTarget.score,
      x: shotDataFromTarget.x,
      y: shotDataFromTarget.y,
      sequence: (sessionScores[targetPageActiveQuiverId]?.[targetPageActiveArrowId]?.length || 0) + 1,
    };

    setSessionScores((prev) => {
      const updatedQuiverScores = { ...(prev[targetPageActiveQuiverId] || {}) };
      const updatedArrowScores = [...(updatedQuiverScores[targetPageActiveArrowId] || []), newScore];
      updatedQuiverScores[targetPageActiveArrowId] = updatedArrowScores;
      return { ...prev, [targetPageActiveQuiverId]: updatedQuiverScores };
    });
  };

  const handleConfirmScoresForQuiver = async (quiverIdToConfirm) => {
    if (!quiverIdToConfirm || !sessionScores[quiverIdToConfirm]) {
      message.info("No session scores to confirm for this quiver.");
      return;
    }

    const quiverSessionScores = sessionScores[quiverIdToConfirm];
    let successCount = 0;
    let errorCount = 0;
    const quiverToConfirm = allQuivers.find(q => q.id === quiverIdToConfirm);

    for (const arrowId in quiverSessionScores) {
      const arrowScores = quiverSessionScores[arrowId];
      if (arrowScores && arrowScores.length > 0) {
        try {
          for (const score of arrowScores) {
            await apiAddScoreToArrow(arrowId, score);
          }
          successCount += arrowScores.length;
        } catch (err) {
          console.error(`Failed to save scores for arrow ${arrowId}:`, err);
          message.error(`Error saving scores for an arrow in ${quiverToConfirm?.name || 'quiver'}.`);
          errorCount += arrowScores.length;
        }
      }
    }

    if (errorCount > 0 && successCount > 0) {
      message.warning(`${successCount} scores saved, ${errorCount} failed for ${quiverToConfirm?.name || 'quiver'}.`);
    } else if (errorCount > 0) {
      message.error(`All ${errorCount} scores failed to save for ${quiverToConfirm?.name || 'quiver'}.`);
    } else if (successCount > 0) {
      message.success(`${successCount} scores confirmed and saved for ${quiverToConfirm?.name || 'quiver'}!`);
    } else {
      message.info("No new scores were confirmed.");
    }

    if (successCount > 0 || errorCount === 0) {
      setSessionScores((prev) => {
        const { [quiverIdToConfirm]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleClearSessionScoresForQuiver = (quiverIdToClear) => {
    if (!sessionScores[quiverIdToClear]) {
      message.info("No session scores to clear for this quiver.");
      return;
    }
    const quiverToClear = allQuivers.find(q => q.id === quiverIdToClear);
    setSessionScores((prev) => {
      const { [quiverIdToClear]: _, ...rest } = prev;
      return rest;
    });
    message.info(`Session scores for ${quiverToClear?.name || 'quiver'} cleared.`);
  };

  const handleClearAllSessionScores = () => {
    if (Object.keys(sessionScores).length === 0) {
      message.info("No session scores to clear.");
      return;
    }
    setSessionScores({});
    message.info("All session scores cleared.");
  };

  const handleUndoLastScoreForActiveArrow = () => {
    if (!targetPageActiveQuiverId || !targetPageActiveArrowId) {
      message.warn("Select a quiver and arrow to undo a score.");
      return;
    }

    setSessionScores((prev) => {
      const quiverScores = prev[targetPageActiveQuiverId];
      if (!quiverScores) return prev;
      const arrowScores = quiverScores[targetPageActiveArrowId];
      if (!arrowScores || arrowScores.length === 0) {
        message.info("No scores in session for this arrow to undo.");
        return prev;
      }

      const updatedArrowScores = arrowScores.slice(0, -1);
      const updatedQuiverScores = { ...quiverScores, [targetPageActiveArrowId]: updatedArrowScores };
      message.success("Last session score for the active arrow removed.");
      return { ...prev, [targetPageActiveQuiverId]: updatedQuiverScores };
    });
  };

  const renderActiveQuiverDetails = () => {
    if (!targetPageActiveQuiverId) return <Paragraph>Select a quiver to see details.</Paragraph>;
    const currentQuiver = allQuivers.find((q) => q.id === targetPageActiveQuiverId);
    if (!currentQuiver) return <Paragraph>Quiver not found. It might have been deleted.</Paragraph>;

    const quiverSessionData = sessionScores[targetPageActiveQuiverId] || {};

    return (
      <Card title={`Selected Quiver: ${currentQuiver.name}`} style={{ marginBottom: 20 }}>
        <Button 
          onClick={() => handleConfirmScoresForQuiver(targetPageActiveQuiverId)} 
          style={{ marginRight: 8 }}
          disabled={arrowsLoading || Object.keys(quiverSessionData).length === 0}
        >
          Confirm Scores for {currentQuiver.name}
        </Button>
        <Button 
          danger 
          onClick={() => handleClearSessionScoresForQuiver(targetPageActiveQuiverId)}
          disabled={arrowsLoading || Object.keys(quiverSessionData).length === 0}
        >
          Clear Session for {currentQuiver.name}
        </Button>
        <List
          header={<div>Arrows (Click to select for scoring)</div>}
          bordered
          loading={arrowsLoading}
          dataSource={arrowsForSelectedQuiver}
          renderItem={(arrow) => {
            const arrowSessScores = quiverSessionData[arrow.id] || [];
            const scoresString = arrowSessScores.map((s) => s.value).join(", ");
            return (
              <List.Item
                style={{ 
                  fontWeight: arrow.id === targetPageActiveArrowId ? "bold" : "normal", 
                  cursor: "pointer",
                  backgroundColor: arrow.id === targetPageActiveArrowId ? '#e6f7ff' : undefined
                }}
                onClick={() => setTargetPageActiveArrowId(arrow.id)}
              >
                {arrow.name}: <Text type="secondary">{scoresString || "No session scores"}</Text>
              </List.Item>
            );
          }}
          locale={{ emptyText: arrowsLoading ? 'Loading arrows...' : 'No arrows in this quiver. Add some in "My Quivers".' }}
        />
      </Card>
    );
  };

  const renderQuiverDeck = () => {
    if (quiversLoading) return <Paragraph>Loading quivers...</Paragraph>;
    if (!allQuivers || allQuivers.length === 0) return <Paragraph>No quivers found. Create one in "My Quivers".</Paragraph>;

    return (
      <List
        header={<div>Quivers (Click to select for target page)</div>}
        bordered
        dataSource={allQuivers}
        renderItem={(quiver) => (
          <List.Item
            onClick={() => {
              setTargetPageActiveQuiverId(quiver.id);
            }}
            style={{ 
              fontWeight: quiver.id === targetPageActiveQuiverId ? "bold" : "normal", 
              cursor: "pointer",
              backgroundColor: quiver.id === targetPageActiveQuiverId ? '#f0f0f0' : undefined,
            }}
          >
            {quiver.name}
          </List.Item>
        )}
      />
    );
  };

  useEffect(() => {
    if (targetPageActiveQuiverId && arrowsForSelectedQuiver.length > 0) {
      const currentArrowIsValid = arrowsForSelectedQuiver.some(arrow => arrow.id === targetPageActiveArrowId);
      if (!currentArrowIsValid) {
        setTargetPageActiveArrowId(arrowsForSelectedQuiver[0].id);
      }
    } else if (targetPageActiveQuiverId && arrowsForSelectedQuiver.length === 0) {
      setTargetPageActiveArrowId(null);
    }
  }, [targetPageActiveQuiverId, arrowsForSelectedQuiver, targetPageActiveArrowId]);

  const selectedQuiverForDisplay = allQuivers.find(q => q.id === targetPageActiveQuiverId);
  const selectedArrowForDisplay = targetPageActiveArrowId ? arrowsForSelectedQuiver.find(a => a.id === targetPageActiveArrowId) : null;

  return (
    <Row gutter={16} style={{ padding: "20px", height: "100%" }}>
      <Col span={12} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Card style={{ flexShrink: 0, marginBottom: 16 }}>
          <Title level={4}>Target</Title>
          {selectedQuiverForDisplay && selectedArrowForDisplay ? (
            <Paragraph>
              Scoring for: {selectedQuiverForDisplay.name} / {selectedArrowForDisplay.name}
            </Paragraph>
          ) : (
            <Paragraph>Select a quiver and an arrow from the right panel to start scoring.</Paragraph>
          )}
        </Card>
        <div className={styles.targetCard}>
          <TargetFace
            className={styles.targetWrapper}
            onScore={handleTargetScore}
            shots={[]}
            onContextMenu={(e) => {
              e.preventDefault();
              handleUndoLastScoreForActiveArrow();
            }}
          />
        </div>
      </Col>
      <Col span={12} style={{ height: "100%", display: "flex", flexDirection: "column" }} ref={shotRecordRef}>
        <Card style={{ flexGrow: 1, overflowY: "auto" }}>
          <Title level={4}>Shot Records (Session)</Title>
          <Button 
            onClick={handleClearAllSessionScores} 
            danger 
            block 
            style={{ marginBottom: 10 }}
            disabled={Object.keys(sessionScores).length === 0}
          >
            Clear All Session Scores
          </Button>
          {targetPageActiveQuiverId ? renderActiveQuiverDetails() : renderQuiverDeck()}
          {targetPageActiveQuiverId && (
            <Button onClick={() => {
                setTargetPageActiveQuiverId(null);
                setTargetPageActiveArrowId(null);
            }} style={{ marginTop: 10 }} block>
              Back to Quiver Deck
            </Button>
          )}
        </Card>
      </Col>
    </Row>
  );
}
