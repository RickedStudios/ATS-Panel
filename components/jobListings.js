import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import useSWR, { mutate } from "swr";
import {
  Layout,
  List,
  Card,
  Typography,
  Divider,
  Button,
  Row,
  Col,
  Spin,
} from "antd";
import styles from "../styles/ATS.module.css";
import homeStyle from "../styles/Home.module.css";
import { PlusOutlined } from "@ant-design/icons";
import AddJobModal from "./addJobModal";
import EditJobModal from "./editJobModal";

const { Content } = Layout;
const { Title } = Typography;

export default function JobListings() {
  const [newJobModalVisible, setNewJobModalVisible] = useState(false);
  const [editJobModalVisible, setEditJobModalVisible] = useState(false);
  const [selectedListing, setSelectedListing] = useState({});
  const { data, error } = useSWR("/api/jobs", async function (args) {
    const res = await fetch(args);
    return res.json();
  });

  if (error) {
    console.error("Failed to load job listings:", error);
    return <div>Failed to load</div>;
  }

  if (!data) {
    return (
      <div className={homeStyle.container}>
        <Spin size="large" />
      </div>
    );
  }

  const handleNewJobModalClose = () => {
    mutate("/api/jobs");
    setNewJobModalVisible(false);
  };

  const handleEditJobModalClose = () => {
    mutate("/api/jobs");
    setEditJobModalVisible(false);
  };

  const handleEditListingClick = (item) => {
    setSelectedListing(item);
    setEditJobModalVisible(true);
  };

  return (
    <Layout
      className={styles.siteLayoutBackground}
      style={{ paddingTop: 10, minHeight: "100vh" }}
    >
      <AddJobModal visible={newJobModalVisible} close={handleNewJobModalClose} />
      <EditJobModal
        data={selectedListing}
        visible={editJobModalVisible}
        close={handleEditJobModalClose}
      />
      <Content
        style={{
          padding: "0 24px",
          minHeight: "76vh",
        }}
      >
        <Row align="middle">
          <Col flex="auto">
            <Title style={{ margin: 0 }} level={2}>
              Job Listings
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setNewJobModalVisible(true)}
            >
              Add Listing
            </Button>
          </Col>
        </Row>
        <Divider />
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Card hoverable onClick={() => handleEditListingClick(item)} title={item.title}>
                {item.location}
              </Card>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
}
