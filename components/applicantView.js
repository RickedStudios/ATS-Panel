import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import useSWR, { mutate } from "swr";
import { List, Spin, Card, Tag, Row, Col, Rate } from "antd";
import ViewApplicantModal from "./viewApplicantModal";

export default function ApplicantView({ data: jobData, pipeline }) {
  const { data, error } = useSWR(`/api/jobs/${jobData}`, async function (args) {
    const res = await fetch(args);
    return res.json();
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [applicantData, setApplicantData] = useState({});

  const setColor = (stage) => {
    switch (stage) {
      case "Applied":
        return "magenta";
      case "Interview":
        return "gold";
      case "Offer":
        return "green";
      default:
        return "blue";
    }
  };

  if (error) {
    console.error(error);
    return <div>Error</div>;
  }

  if (!data) {
    return (
      <div style={{ display: "flex", justifyContent: "center", height: "100%", alignItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <ViewApplicantModal
        visible={modalVisible}
        data={applicantData}
        close={() => {
          mutate(`/api/jobs/${jobData}`);
          setModalVisible(false);
        }}
        pipeline={pipeline}
      />
      <List
        split={false}
        itemLayout="horizontal"
        pagination={{ position: 'bottom', align: 'end' }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              style={{ width: "100%" }}
              bodyStyle={{ padding: "1rem" }}
              onClick={() => {
                setApplicantData(item);
                setModalVisible(true);
              }}
            >
              <Row>
                <Col span={4} style={{ display: "flex", alignItems: "center" }}>
                  {item.name}
                </Col>
                <Col span={4} style={{ display: "flex", alignItems: "center" }}>
                  <Tag color={setColor(item.stage)}>{item.stage}</Tag>
                </Col>
                <Col span={4} style={{ display: "flex", alignItems: "center" }}>
                  <Rate value={item.rating} disabled />
                </Col>
                <Col span={12} style={{ display: "flex", alignItems: "center" }}>
                  {item.introduction}
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
