import { Button, Col, DatePicker, Form, message, Row, Spin } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import bg_dashboard from "../../assets/img/bg-dashboard.svg";
import Table, { SelectColumnFilter } from '../../components/layout/Table'
import { Berat, Tinggi, Lingkar } from "../../utilities/Berat";

const BackgroundComponent = () => {
  const backgroundStyles = {
    // position: "absolute",
    // width: "100%",
    // height: "100%",
    // background: `url(${bg_dashboard}) center`,
    // backgroundSize: 'contain',
    position: "center",
  };
  return <div style={backgroundStyles} />;
};
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
  console.log(user);
  const columns = useMemo(() => {
    return [
      {
        Header: 'Kategori',
        accessor: 'kategori',
      },
      {
        Header: 'Total',
        accessor: 'total',
      },
    ];
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/statistik-gizi/${user.user.id_desa}}`
      )
      .then((response) => {
        setData(response.data.data);
<<<<<<< HEAD
        setIsLoading(true);
=======
        console.log(data);
        setIsLoading(false);
>>>>>>> 6cb4c935601bd972add77ec3e8936af367380082
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
<<<<<<< HEAD
  
=======

  const berat = [0, 0, 0];

>>>>>>> 6cb4c935601bd972add77ec3e8936af367380082
  return (
    <>
      {contextHolder}
      <Navbar isLogin desa/>
      {/* <BackgroundComponent /> */}
      <div className="bg-fixed bg-cover bg-bottom dash-bg"/>
      <Row
        style={{ marginTop: "46px" }}
        className="container"
        justify="space-between"
      >
        { isLoading ? (
          data.map((value) => {
            return (
              <Col 
              key={value} 
              span={24}
              style={{ marginTop: "10px", marginBottom: "50px" }}
              >
                <Col span={24} style={{ marginTop: 5 }}>
                  <h1 style={{ justifyContent: 'center', display: "flex", textTransform: "uppercase", color: "#7F7B7B", fontSize: "28px" }}
                    >{value.nama_posyandu}</h1>
                </Col>
                <Row key={value} justify="space-between">
                  <Col span={7}>
                    <Row justify="start">
                      <h5 style={{color:"rgba(177, 68, 68, 1)"}}>BERAT</h5>
                    </Row>
<<<<<<< HEAD
                    
                    <Table 
                      data={Berat(value.id_posyandu,data)} 
=======
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
>>>>>>> 6cb4c935601bd972add77ec3e8936af367380082
                      columns={columns}
                      initialState={{
                        pageSize: 5,
                      }}
                      noSearch
                    />
                  </Col>
                  <Col span={7}>
                    <Row justify="start">
                       <h5 style={{color:"rgba(177, 68, 68, 1)"}}>TINGGI</h5>
                    </Row>
                   <Table 
                      data={Tinggi(value.id_posyandu,data)} 
                      columns={columns}
                      initialState={{
                        pageSize: 5,
                      }}
                      noSearch
                    />
                  </Col>
                  <Col span={7}>
                    <Row justify="start">
                      <h5 style={{color:"rgba(177, 68, 68, 1)"}}>LINGKAR KEPALA</h5>
                    </Row>
                    <Table 
                      data={Lingkar(value.id_posyandu,data)} 
                      columns={columns}
                      initialState={{
                        pageSize: 5,
                      }}
                      noSearch
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
              style={{ justifyContent: 'start', display: "flex", color: "#7F7B7B", fontSize: "28px" }}
                    
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
              {/* <Button type="secondary" htmlType="submit"class="button">
                Export CSV
              </Button> */}
              <button class="button" type="submit">
                Export CSV
              </button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
