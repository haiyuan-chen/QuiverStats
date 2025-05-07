// frontend/src/components/DashboardPage.jsx
import React from "react";
import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  return (
    <Card style={{ minHeight: 600, margin: "16px 0" }}>
      <Title level={3}>Statistics Dashboard</Title>
      <Paragraph>
        Placeholder main page for charts, reports, and analytics.
      </Paragraph>
    </Card>
  );
}
