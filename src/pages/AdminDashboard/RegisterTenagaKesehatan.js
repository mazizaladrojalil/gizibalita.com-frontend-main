import { Button, Col, Form, Input, message, Row, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function RegisterTenagaKesehatan() {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [dataDesa, setDataDesa] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/posyandu`)
      .then((response) => {
        setDataSource(response.data.data);
      })
      .catch((err) => {});

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/desa`)
      .then((response) => {
        setDataDesa(response.data.data);
      })
      .catch((err) => {});
    // eslint-disable-next-line
  }, []);

  const onFinish = (values) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/tenaga-kesehatan/register`,
        {
          nama: values.nama,
          email: values.email,
          password: values.password,
          id_desa: values.desa,
          id_posyandu: values.posyandu,
        }
      )
      .then((response) => {
        messageApi.open({
          type: "success",
          content: "Register Berhasil",
        });
        form.resetFields();
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: "Gagal Registrasi",
        });
      });
  };

  const onFinishFailed = (values) => {
    console.log(values);
  };

  return (
    <>
      {contextHolder}
      <Row justify="center">
        <Col span={12}>
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="horizontal"
          >
            <Form.Item
              label="Nama"
              name="nama"
              rules={[
                {
                  required: true,
                  message: "Nama masih kosong!",
                  type: "string",
                },
              ]}
            >
              <Input placeholder="Nama Lengkap" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email masih kosong!",
                },
                {
                  type: "email",
                  message: "Email belum sesuai!",
                },
              ]}
            >
              <Input placeholder="user@email.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Password masih kosong!",
                },
                {
                  pattern: "^.{8,}$",
                  message: "Password minimal 8 karakter",
                },
              ]}
            >
              <Input.Password placeholder="password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirm"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Silahkan Confirm Password Anda!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Password tidak sesuai!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item
              name="desa"
              label="Desa"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                listHeight={100}
                optionFilterProp="children"
                showSearch
                placeholder="Pilih Desa"
              >
                {dataDesa &&
                  dataDesa.map((value) => (
                    <Select.Option key={value.id} value={value.id}>
                      {value.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="posyandu"
              label="Posyandu"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                listHeight={100}
                optionFilterProp="children"
                showSearch
                placeholder="Pilih Posyandu"
              >
                {dataSource &&
                  dataSource.map((value) => (
                    <Select.Option key={value.id} value={value.id}>
                      {value.nama}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Kirim
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
