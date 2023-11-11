import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input } from "antd";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export default function EditJobModal(props) {
  const [form] = Form.useForm();
  const [rte, setRte] = useState({
    theme: "snow",
    enabled: true,
    readOnly: false,
    value: { ops: [] },
  });

  const onEditorChange = (value, delta, source, editor) => {
    setRte({
      value: editor.getHTML(),
    });
  };

  useEffect(() => {
    form.resetFields();
    setRte({
      value: props.data.description,
    });
  }, [props.data, form]);

  async function handleSubmit(values) {
    const payload = {
      id: props.data._id,
      description: rte.value,
      ...values,
    };

    try {
      await fetch("/api/jobs", {
        method: "put",
        body: JSON.stringify(payload),
      });

      props.close();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  }

  async function deleteListing() {
    try {
      await fetch("/api/jobs", {
        method: "delete",
        body: JSON.stringify(props.data._id),
      });

      props.close();
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  }

  return (
    <Modal
      visible={props.visible}
      title={`Edit Listing: ${props.data.title}`}
      onOk={props.close}
      onCancel={props.close}
      footer={null}
      width={600}
      centered
      forceRender
    >
      <Form
        form={form}
        {...layout}
        name="edit-job"
        onFinish={handleSubmit}
        hideRequiredMark
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
          initialValue={props.data.title}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Location is required" }]}
          initialValue={props.data.location}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Description is required" }]}
          initialValue={props.data.description}
        >
          <ReactQuill theme="snow" value={rte.value} onChange={onEditorChange} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 4,
          }}
        >
          <Button type="primary" htmlType="submit" style={{ marginRight: "8px" }}>
            Save
          </Button>
          <Button type="default" htmlType="button" onClick={deleteListing} danger>
            Delete
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
