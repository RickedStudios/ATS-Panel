import React, { useEffect } from "react";
import { Modal, Descriptions, Form, Input, Button, Rate, Select } from "antd";
import fetch from "isomorphic-unfetch";
import { saveAs } from "file-saver";

export default function ViewApplicantModal(props) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [props.data]);

  async function handleSubmit(values) {
    const payload = { ...values, id: props.data._id };
    await fetch("/api/applicants", {
      method: "put",
      body: JSON.stringify(payload),
    });
    props.close();
  }

  async function deleteApplicant() {
    await fetch("/api/applicants", {
      method: "delete",
      body: JSON.stringify(props.data._id),
    });
    props.close();
  }

  async function downloadCV() {
    try {
      const res = await fetch(`/api/cv/${props.data.cv}`);
      const responseJson = await res.json();
      const arr = new Uint8Array(responseJson.file.data);

      const blob = new Blob([arr], { type: "application/pdf" });
      saveAs(blob, "cv.pdf");
    } catch (error) {
      console.error("Failed to download CV:", error);
    }
  }

  return (
    <Modal
      visible={props.visible}
      title={props.data.name}
      onOk={props.close}
      onCancel={props.close}
      footer={null}
      width={600}
      centered
      forceRender
    >
      <Form
        form={form}
        name="edit-applicant"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Descriptions bordered column={1}>
          {/* Descriptions content */}
        </Descriptions>
        <div style={{ textAlign: "end", marginTop: "1rem" }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: "8px" }}>
            Save
          </Button>
          <Button type="default" htmlType="button" onClick={deleteApplicant} danger>
            Delete
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
