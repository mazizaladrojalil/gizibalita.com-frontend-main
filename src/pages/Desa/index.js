import { Button, Col, DatePicker, Form, message, Row, Spin, Table } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";

export default function Desa() {
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dataSourceBerat = [
    {
      key: "1",
      kategori: "OBESITAS",
      total: 2,
    },
    {
      key: "2",
      kategori: "GEMUK",
      total: 3,
    },
    {
      key: "3",
      kategori: "NORMAL",
      total: 2,
    },
    {
      key: "4",
      kategori: "KURUS",
      total: 5,
    },
    {
      key: "5",
      kategori: "SANGAT KURUS",
      total: 1,
    },
  ];

  const dataSourceTinggi = [
    {
      key: "1",
      kategori: "TINGGI",
      total: 2,
    },
    {
      key: "2",
      kategori: "NORMAL",
      total: 3,
    },
    {
      key: "3",
      kategori: "PENDEK",
      total: 2,
    },
    {
      key: "4",
      kategori: "SANGAT PENDEK",
      total: 5,
    },
  ];

  const dataSourceLingkarKepala = [
    {
      key: "1",
      kategori: "MAKROSEFALI",
      total: 2,
    },
    {
      key: "2",
      kategori: "NORMAL",
      total: 3,
    },
    {
      key: "3",
      kategori: "MIKROSEFALI",
      total: 2,
    },
  ];

  const columns = [
    {
      title: "Kategori",
      dataIndex: "kategori",
      key: "kategori",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
  ];

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/statistik-gizi/${user.user.id_desa}}`
      )
      .then((response) => {
        setData(response.data.data);
        console.log(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
    // eslint-disable-next-line
  }, []);

  function onFinish() {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();

        const params = {
          desa: user.user.id_desa,
          bulan: moment(values.waktu).format("MM"),
          tahun: moment(values.waktu).format("YYYY"),
        };

        axios
          .get(`${process.env.REACT_APP_BASE_URL}/api/export-data-anak-csv`, {
            params,
            responseType: "blob",
          })
          .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "data-anak.csv"); //or any other extension
            document.body.appendChild(link);
            link.click();
          })
          .catch((err) =>
            messageApi.open({
              type: "error",
              content: "Data gagal di Export",
            })
          );
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

  const berat = [0, 0, 0];

  return (
    <>
      {contextHolder}
      <Navbar isLogin />
      <Row
        style={{ marginTop: 50 }}
        className="container"
        justify="space-between"
      >
        {!isLoading ? (
          data.map((value) => {
            return (
              <Col key={value} span={24}>
                <Row>
                  <h1>{value.nama_posyandu}</h1>
                </Row>
                <Row key={value} justify="space-between">
                  <Col span={7}>
                    <Row justify="center">
                      <h2>BERAT</h2>
                    </Row>
                    <Table dataSource={dataSourceBerat} columns={columns} />

                  </Col>
                  <Col span={7}>
                    <Row justify="center">
                      <h2>TINGGI</h2>
                    </Row>
                    <Table dataSource={dataSourceTinggi} columns={columns} />
                  </Col>
                  <Col span={7}>
                    <Row justify="center">
                      <h2>LINGKAR KEPALA</h2>
                    </Row>
                    <Table
                      dataSource={dataSourceLingkarKepala}
                      columns={columns}
                    />
                  </Col>
                </Row>
              </Col>
            );
          })
        ) : (
          <Col>
            <Spin size="large" spinning={isLoading} />
          </Col>
        )}

        <Col span={24} style={{ marginTop: 50 }}>
          <Form
            onFinish={onFinish}
            form={form}
            name="form_export_data"
            layout="horizontal"
          >
            {/* {data.map((value) => {
              return (
                <Col key={value} span={24}>
                  <Row>
                    <h1>{value.nama_posyandu}</h1>
                  </Row>
                  <Row key={value} justify="space-between">
                    <Col span={7}>
                      <Row justify="center">
                        <h2>BERAT</h2>
                      </Row>
                      <Table dataSource={dataSourceBerat} columns={columns} />

                    </Col>
                    <Col span={7}>
                      <Row justify="center">
                        <h2>TINGGI</h2>
                      </Row>
                      <Table dataSource={dataSourceTinggi} columns={columns} />
                    </Col>
                    <Col span={7}>
                      <Row justify="center">
                        <h2>LINGKAR KEPALA</h2>
                      </Row>
                      <Table
                        dataSource={dataSourceLingkarKepala}
                        columns={columns}
                      />
                    </Col>
                  </Row>
                </Col>
              )
            })} */}
            <Form.Item
              label="Periode Waktu berdasarkan bulan & tahun pengukuran"
              name="waktu"
              rules={[
                {
                  required: true,
                  message: "Periode Data masih kosong!",
                },
              ]}
            >
              <DatePicker picker="month" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Export CSV
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
