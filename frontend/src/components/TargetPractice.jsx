import React from "react";
import { Card, Button, Typography } from "antd";
import { useShots }                from "../hooks/useShots";
import TargetFace                  from "./TargetFace";
import styles                      from "./TargetPractice.module.css";

const { Paragraph } = Typography;

export default function TargetPractice() {
  const { shots, addShot, clearShots } = useShots();

  return (
    <div className={styles.container}>
      {/* Left: capped, perfectly square target */}
      <div className={styles.leftPanel}>
        <Card 
          className={styles.targetCard} 
          bordered={false}
          bodyStyle={{ 
            padding: 0,
            height: '100%',
            width: '100%',
            display: 'flex',
            overflow: 'hidden'
          }}
        >
          <div className={styles.targetWrapper}>
            <TargetFace onScore={addShot} shots={shots} />
          </div>
        </Card>
      </div>

      {/* Right: fixed‑width shot list */}
      <div className={styles.rightPanel}>
        <Card
          className={styles.shotCard}
          title="Shots Recorded"
          extra={<Button onClick={clearShots}>Clear</Button>}
          bodyStyle={{ padding: 0 }}
        >
          <div className={styles.shotBody}>
            {shots.length === 0 ? (
              <Paragraph>No shots yet—click the target!</Paragraph>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {shots.map((s, i) => (
                  <li key={i}>
                    Arrow {i + 1}: <strong>Score {s.score}</strong> at (
                    {s.x.toFixed(1)}, {s.y.toFixed(1)})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
