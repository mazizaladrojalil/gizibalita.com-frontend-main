import { Button, Col, Form, Input, message, Row, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function InputDesa() {
  const [form] = Form.useForm();
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  function deleteDesa(id) {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/api/desa/${id}`)
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const columns = [
    {
      title: "Nama Desa",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => deleteDesa(record.id)} type="dashed" danger>
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/desa`)
      .then((response) => {
        setDataSource(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
    // eslint-disable-next-line
  }, [refreshKey]);

  const onFinish = (values) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/desa`, { nama: values.desa })
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1);
        form.resetFields();
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Data gagal tersimpan",
        });
      });
  };

  const onFinishFailed = (values) => {
    console.log(values);
  };

  return (
    <>
      {contextHolder}
      <Row justify="space-between">
        <Col span={7}>
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="horizontal"
          >
            <Form.Item
              label="Nama Desa"
              name="desa"
              rules={[
                {
                  required: true,
                  message: "Nama Desa masih kosong!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Kirim
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={15}>
          {!isLoading && (
            <Table
              title={() => <h1>Daftar Desa</h1>}
              dataSource={dataSource}
              columns={columns}
              loading={isLoading}
              pagination={{ pageSize: 5 }}
            />
          )}
        </Col>
      </Row>
    </>
  );
}
