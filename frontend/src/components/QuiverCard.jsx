import React, { useState } from "react";
import {
  Card,
  Button,
  Input,
  Form,
  Tag,
  Typography,
  Popconfirm,
  message,
  Spin,
  Flex,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useArrows } from "../hooks/useArrows";
import { useActiveArrow } from "../contexts/ActiveArrowContext";

const { Title, Paragraph } = Typography;

const QuiverCard = ({ quiver, onEditQuiver, onDeleteQuiver }) => {
  const {
    arrows,
    loading: arrowsLoading,
    addArrow,
    editArrow,
    removeArrow,
  } = useArrows(quiver.id);
  const {
    activeQuiver,
    activeArrow,
    selectArrow,
    selectQuiver: setActiveQuiverContext,
  } = useActiveArrow();
  const [isAddingArrow, setIsAddingArrow] = useState(false);
  const [addArrowForm] = Form.useForm();

  const handleAddArrow = async (values) => {
    try {
      await addArrow({ name: values.name, quiverId: quiver.id });
      addArrowForm.resetFields();
      setIsAddingArrow(false);
    } catch (error) {
      // Error message already handled by useArrows hook
    }
  };

  const handleRenameArrow = async (arrowId, newName) => {
    if (!newName.trim()) {
      message.error("Arrow name cannot be empty.");
      return;
    }
    try {
      await editArrow(arrowId, { name: newName });
    } catch (error) {
      // Error message already handled by useArrows hook
    }
  };

  const handleRenameQuiver = (newName) => {
    if (!newName.trim()) {
      message.error("Quiver name cannot be empty.");
      // Potentially revert or handle error state in parent for Typography editable
      return;
    }
    onEditQuiver(quiver.id, { name: newName });
  };

  const handleArrowClick = (arrow) => {
    selectArrow(arrow, quiver);
  };

  const cardTitle = (
    <Flex justify="space-between" align="center">
      <Paragraph
        editable={{
          onChange: handleRenameQuiver,
          tooltip: "Click to edit quiver name",
          // onStart: () => {}, // Could be used if needed
        }}
        style={{ margin: 0, fontWeight: "bold", flexGrow: 1 }}
        ellipsis={{ tooltip: quiver.name }}
      >
        {quiver.name}
      </Paragraph>
      <Popconfirm
        title="Delete this quiver?"
        description="This action cannot be undone and will delete all arrows in it."
        onConfirm={() => onDeleteQuiver(quiver.id)}
        okText="Yes"
        cancelText="No"
      >
        <Button type="text" danger icon={<DeleteOutlined />} size="small" />
      </Popconfirm>
    </Flex>
  );

  return (
    <Card
      title={cardTitle}
      style={{
        width: 300, // Poker card like proportion
        height: 420, // Poker card like proportion
        margin: 8,
        display: "flex",
        flexDirection: "column",
        borderColor: activeQuiver?.id === quiver.id ? "#1890ff" : undefined, // Highlight if active
      }}
      bodyStyle={{
        flexGrow: 1,
        overflowY: "auto",
        paddingTop: 10,
        paddingBottom: 10,
      }}
      onClick={() => setActiveQuiverContext(quiver)} // Select quiver on card click
    >
      {arrowsLoading && <Spin />}
      {!arrowsLoading &&
        arrows.map((arrow) => (
          <Tag
            key={arrow.id}
            closable
            onClose={(e) => {
              e.preventDefault(); // Prevent card click
              // No Popconfirm for individual arrow for now, direct delete
              // To add Popconfirm, wrap this in a Popconfirm component
              removeArrow(arrow.id);
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when clicking tag
              handleArrowClick(arrow);
            }}
            color={
              activeArrow?.id === arrow.id && activeQuiver?.id === quiver.id
                ? "blue"
                : undefined
            }
            style={{
              marginBottom: 8,
              cursor: "pointer",
              display: "block",
              whiteSpace: "normal",
              height: "auto",
            }}
          >
            <Paragraph
              style={{
                margin: 0,
                display: "inline-block",
                maxWidth: "calc(100% - 20px)",
              }} // Adjust width for close icon
              editable={{
                onChange: (newName) => handleRenameArrow(arrow.id, newName),
                // triggerType: ['text'], // To edit on text click directly
                tooltip: "Click to edit arrow name",
              }}
              ellipsis={{ tooltip: arrow.name }}
            >
              {arrow.name}
            </Paragraph>
          </Tag>
        ))}
      {!arrowsLoading && arrows.length === 0 && !isAddingArrow && (
        <Typography.Text type="secondary">
          No arrows yet. Add one!
        </Typography.Text>
      )}

      {isAddingArrow ? (
        <Form
          form={addArrowForm}
          onFinish={handleAddArrow}
          layout="inline"
          style={{ marginTop: 8 }}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
            style={{ flexGrow: 1 }}
          >
            <Input placeholder="New arrow name" autoFocus />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<CheckOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button
              icon={<CloseOutlined />}
              onClick={() => setIsAddingArrow(false)}
            />
          </Form.Item>
        </Form>
      ) : (
        <Button
          type="dashed"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            setIsAddingArrow(true);
          }}
          icon={<PlusOutlined />}
          style={{ marginTop: 8, width: "100%" }}
        >
          Add Arrow
        </Button>
      )}
    </Card>
  );
};

export default QuiverCard;
