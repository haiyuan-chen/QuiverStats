// src/components/QuiverPage.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

export default function QuiverPage() {
  const [quivers, setQuivers] = useState([]);
  const [isModal, setModal]   = useState(false);
  const [form]                = Form.useForm();

  useEffect(() => {
    axios.get("/api/quivers").then(({ data }) => setQuivers(data));
  }, []);

  const createQuiver = (values) =>
    axios.post("/api/quivers", values)
      .then(({ data }) => {
        setQuivers((q) => [...q, data]);
        setModal(false);
        message.success("Quiver created");
        form.resetFields();
      })
      .catch(() => message.error("Error"));

  return (
    <>
      <Row gutter={16}>
        {quivers.map((q) => (
          <Col key={q.id} flex="0 0 300px">
            <Card title={q.name} hoverable onClick={() => {/* select */}}>
              {/* optionally list arrows here */}
            </Card>
          </Col>
        ))}

        {/* Create Quiver */}
        <Col flex="0 0 300px">
          <Card
            type="dashed"
            onClick={() => setModal(true)}
            style={{ textAlign: "center", cursor: "pointer" }}
          >
            <Button type="dashed">+ Create Quiver</Button>
          </Card>
        </Col>
      </Row>

      <Modal
        title="New Quiver"
        open={isModal}
        onCancel={() => setModal(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={createQuiver}>
          <Form.Item name="name" rules={[{ required: true }]}>
            <Input placeholder="Quiver name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
