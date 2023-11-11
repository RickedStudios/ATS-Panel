import React from "react";
import { Modal, Button, Form, Input, Spin, Select, Upload } from "antd";
import useSWR from "swr";
import homeStyle from "../styles/Home.module.css";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const validateMessages = {
  required: "This field is required!",
  types: {
    email: "Not a valid email!",
    number: "Not a valid number!",
    url: "Not a valid url!",
  },
};

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export default function InsertApplicantModal(props) {
  const [form] = Form.useForm();

  async function handleSubmit(values) {
    const payload = { ...values, cv: values.cv[0]?.originFileObj };
    await fetch("/api/applicants", {
      method: "post",
      body: JSON.stringify(payload),
    });

    form.resetFields();
    props.close();
  }

  const { data, error } = useSWR("/api/jobs", async function (args) {
    const res = await fetch(args);
    return res.json();
  });

  if (error) {
    console.error("Failed to load:", error);
    return <div>Failed to load</div>;
  }

  if (!data) {
    return (
      <div className={homeStyle.container}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Modal
      visible={props.visible}
      title="Manual Applicant Insertion"
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
        name="insert-applicant"
        onFinish={handleSubmit}
        validateMessages={validateMessages}
      >
        <Form.Item
          name="listing"
          label="For Job Listing"
          rules={[{ required: true, message: "Please select a job listing" }]}
        >
          <Select placeholder="Select an option" showSearch>
            {data.map((job, i) => (
              <Select.Option key={i} value={job._id}>
                {job.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {/* Other form items remain the same */}
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 6,
          }}
        >
          <Button type="primary" htmlType="submit">
            Insert
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
