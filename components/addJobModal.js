import React, { useState } from "react";
import { Modal, Button, Form, Input } from "antd";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false
});


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export default function AddJobModal(props) {
  const [form] = Form.useForm();

  const [rte, setRte] = useState({
    theme: 'snow',
    enabled: true,
    readOnly: false,
    value: { ops: [] }
  });

  const onEditorChange = (value, delta, source, editor) => {
    console.log(value, editor);
    setRte((prevRte) => ({
      ...prevRte,
      value: editor.getHTML(),
    }));
  };

  async function handleSubmit(values) {
    const requestData = {
      ...values,
      description: rte.value,
    };

    await fetch("/api/jobs", {
      method: "post",
      body: JSON.stringify(requestData),
    });

    form.resetFields();
    setRte({
      value: { ops: [] },
    });
    props.close();
  }

  return (
    <Modal
      visible={props.visible}
      title="New Job Listing"
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
        name="add-job"
        onFinish={handleSubmit}
        hideRequiredMark
      >
        {/* ... (previous form items) */}
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
          initialValue={""}
        >
          <ReactQuill theme="snow" value={rte.value} onChange={onEditorChange} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 4,
          }}
        >
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}