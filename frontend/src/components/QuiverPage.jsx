// src/components/QuiverPage.jsx
import React, { useState, useEffect, useRef } from "react"; // Added useEffect, useRef
import {
  Button,
  Modal,
  Form,
  Input,
  Spin,
  Empty,
  Flex,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQuivers } from "../hooks/useQuivers";
import QuiverCard from "./QuiverCard";

const { Title } = Typography;

export default function QuiverPage() {
  const { quivers, loading, addQuiver, editQuiver, removeQuiver } =
    useQuivers();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const scrollContainerRef = useRef(null); // Ref for the scrollable container

  const handleCreateQuiver = async (values) => {
    try {
      await addQuiver(values);
      setIsModalVisible(false);
      form.resetFields();
    } catch {
      // Error message already handled by useQuivers hook
    }
  };
  const handleEditQuiver = async (quiverId, values) => {
    try {
      await editQuiver(quiverId, values);
    } catch {
      // Error message already handled by useQuivers hook
    }
  };
  const handleDeleteQuiver = async (quiverId) => {
    try {
      await removeQuiver(quiverId);
    } catch {
      // Error message already handled by useQuivers hook
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheelScroll = (event) => {
      if (event.deltaY === 0) return; // Ignore horizontal scroll events from trackpads
      // event.preventDefault(); // Uncomment if you want to prevent vertical scroll on the page too
      container.scrollLeft += event.deltaY + event.deltaX; // event.deltaX for trackpads that do horizontal
    };

    container.addEventListener("wheel", handleWheelScroll, { passive: true }); // passive:true if not preventing default

    return () => {
      container.removeEventListener("wheel", handleWheelScroll);
    };
  }, []);

  if (loading && quivers.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        My Quivers
      </Title>

      <Flex
        ref={scrollContainerRef} // Assign ref here
        wrap="nowrap" // Ensures horizontal scrolling, not wrapping
        style={{
          overflowX: "auto", // Allows horizontal scrolling
          overflowY: "hidden", // Prevents vertical scrollbar for the Flex container itself
          padding: "10px 0", // Padding for scrollbar visibility and aesthetics
          alignItems: "flex-start", // Align cards to the top
          justifyContent: quivers.length === 0 ? "center" : "flex-start", // Center "add" button if no quivers
          minHeight: 450, // Ensure container has enough height for cards + scrollbar
        }}
        gap="middle" // Adds space between cards
      >
        {quivers.map((q) => (
          <QuiverCard
            key={q.id}
            quiver={q}
            onEditQuiver={handleEditQuiver}
            onDeleteQuiver={handleDeleteQuiver}
          />
        ))}

        {/* Create Quiver Button Card */}
        <div
          style={{
            width: 300,
            height: 420,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #d9d9d9",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#fafafa",
            flexShrink: 0, // Prevent this card from shrinking
            margin: 8,
          }}
          onClick={() => setIsModalVisible(true)}
        >
          <Button
            type="text"
            icon={<PlusOutlined />}
            style={{ fontSize: "1.2rem", color: "#595959" }}
          >
            New Quiver
          </Button>
        </div>
      </Flex>

      {quivers.length === 0 && !loading && (
        <Flex vertical align="center" justify="center" style={{ flexGrow: 1 }}>
          <Empty description="No quivers found. Add one to get started!" />
        </Flex>
      )}

      <Modal
        title="Create New Quiver"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateQuiver}>
          <Form.Item
            name="name"
            label="Quiver Name"
            rules={[
              { required: true, message: "Please input the quiver name!" },
            ]}
          >
            <Input placeholder="e.g., Outdoor Practice" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
