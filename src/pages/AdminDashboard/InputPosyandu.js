import { Button, Col, Form, Input, message, Row, Select, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function InputPosyandu() {
  const [form] = Form.useForm();
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [dataDesa, setDataDesa] = useState([]);

  function deletePosyandu(id) {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/api/posyandu/${id}`)
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const columns = [
    {
      title: "Nama Posyandu",
      dataIndex: "nama",
      key: "nama",
    },
    {
      title: "Alamat",
      dataIndex: "alamat",
      key: "alamat",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => deletePosyandu(record.id)} type="dashed" danger>
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/posyandu`)
      .then((response) => {
        setDataSource(response.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/desa`)
      .then((response) => {
        setDataDesa(response.data.data);
      })
      .catch((err) => {});
    // eslint-disable-next-line
  }, [refreshKey]);

  const onFinish = (values) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/posyandu`, {
        id_desa: values.desa,
        nama: values.posyandu,
        alamat: values.alamat,
      })
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
              label="Pilih Desa"
              name="desa"
              rules={[
                {
                  required: true,
                  message: "Desa masih kosong!",
                },
              ]}
            >
              <Select listHeight={100} optionFilterProp="children" showSearch>
                {dataDesa.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Nama Posyandu"
              name="posyandu"
              rules={[
                {
                  required: true,
                  message: "Nama Posyandu masih kosong!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Alamat"
              name="alamat"
              rules={[
                {
                  required: true,
                  message: "Alamat masih kosong!",
                },
              ]}
            >
              <Input.TextArea rows={3} />
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
              title={() => <h1>Daftar Posyandu</h1>}
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
