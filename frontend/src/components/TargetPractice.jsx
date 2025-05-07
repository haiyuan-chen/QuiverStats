// frontend/src/components/TargetPractice.jsx
import React from "react";
import { Row, Col, Card, Typography, Button } from "antd";
import TargetFace from "./TargetFace";
import { useShots } from "../hooks/useShots";

const { Title, Paragraph } = Typography;

export default function TargetPractice() {
  const { shots, addShot, clearShots } = useShots();

  return (
    <Row gutter={16} style={{ padding: 16 }}>
      {/* Left: Target Face */}
      <Col xs={24} md={16} style={{ display: "flex", justifyContent: "center" }}>
        <Card
          bodyStyle={{ padding: 0 }}
          style={{ width: "100%", maxWidth: 600, aspectRatio: "1 / 1" }}
        >
          {/* 
            The div below forces the SVG to be a perfect square 
            that scales to the Card’s width.
          */}
          <div style={{ width: "100%", height: "100%" }}>
            <TargetFace onScore={addShot} shots={shots} />
          </div>
        </Card>
      </Col>

      {/* Right: Shot Records */}
      <Col xs={24} md={8}>
        <Card
          title="Shots Recorded"
          extra={<Button onClick={clearShots}>Clear</Button>}
          style={{ height: "100%" }}
          bodyStyle={{ overflowY: "auto", maxHeight: "80vh" }}
        >
          {shots.length === 0 ? (
            <Paragraph>No shots yet—click the target!</Paragraph>
          ) : (
            <ul style={{ paddingLeft: 16 }}>
              {shots.map((s, i) => (
                <li key={i}>
                  Arrow {i + 1}: Score <strong>{s.score}</strong> at (
                  {s.x.toFixed(1)}, {s.y.toFixed(1)})
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Col>
    </Row>
  );
}
