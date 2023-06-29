import { Button, Col, Form, Input, message, Row, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import banner from "../SignIn/banner.svg";
import logo from "../SignIn/GiziBalita_logo.png";
import "../SignIn/signIn.css";
import background from '../SignIn/login_bg.svg';

const BackgroundComponent = () => {
  const backgroundStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -10000,
    background: `url(${background}) no-repeat center fixed`,
    backgroundSize: '100vw auto',
  };
  return <div style={backgroundStyles} />;
};

export default function SignUp() {
  let navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [role, setRole] = useState(3);
  const [dataDesa, setDataDesa] = useState(null);
  const [dataPosyandu, setDataPosyandu] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/desa`)
      .then((response) => {
        setDataDesa(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/posyandu`)
      .then((response) => {
        setDataPosyandu(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onFinish = (values) => {
    if (values && role === 4) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/auth/posyandu/register`, {
          nama: values.nama,
          email: values.email,
          password: values.password,
          id_desa: values.desa,
          id_posyandu: values.posyandu,
        })
        .then((response) => {
          messageApi.open({
            type: "success",
            content: "Register Berhasil",
          });
          setTimeout(() => {
            navigate("/sign-in");
          }, 1000);
        })
        .catch((error) => {
          console.log(error);
          messageApi.open({
            type: "error",
            content: "Gagal Registrasi",
          });
        });
    }

    if (values && role === 3) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/auth/orang-tua/register`, {
          nama: values.nama,
          email: values.email,
          password: values.password,
          id_desa: values.desa,
          id_posyandu: values.posyandu,
        })
        .then((response) => {
          messageApi.open({
            type: "success",
            content: "Register Berhasil",
          });
          setTimeout(() => {
            navigate("/sign-in");
          }, 1000);
        })
        .catch((error) => {
          console.log(error);
          messageApi.open({
            type: "error",
            content: "Gagal Registrasi",
          });
        });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <BackgroundComponent />
      <Row
        style={{
          background: "transparent",
          minHeight: "100vh",
          padding: "20px 0px",
        }}
        justify="center"
        align="middle"
      >
        <Row
          style={{
            width: "30%",
            height: "65%",
            borderRadius: '20px',
            background: 'linear-gradient(137deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)',
            boxShadow: '0px 4px 24px -1px rgba(0, 0, 0, 0.20)',
            backdropFilter: 'blur(20px)',
            padding: "20px 10px",
          }}
          justify="center"
          align="middle"
        >
          <Row justify="center" align="middle">
            <Col>
              <img src={logo}
                alt="Image"
                style={{
                  width: "200px",
                  height: "auto",
                  marginBottom: "10px",
                }} />
            </Col>
            <Col span={20}>
              <Form
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
              >


                {true && (
                  <>
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
                      label="Alamat"
                      name="alamat"
                      rules={[
                        {
                          required: true,
                          message: "Alamat masih kosong!",
                          type: "string",
                        },
                      ]}
                    >
                      <Input.TextArea rows={4} />
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
                            return Promise.reject(
                              new Error("Password tidak sesuai!")
                            );
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
                      <Select placeholder="Pilih Desa" allowClear>
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
                      <Select placeholder="Pilih Posyandu" allowClear>
                        {dataPosyandu &&
                          dataPosyandu.map((value) => (
                            <Select.Option key={value.id} value={value.id}>
                              {value.nama}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </>
                )}

                {role === 4 && (
                  <>
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
                            return Promise.reject(
                              new Error("Password tidak sesuai!")
                            );
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
                      <Select placeholder="Pilih Desa" allowClear>
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
                      <Select placeholder="Pilih Posyandu" allowClear>
                        {dataPosyandu &&
                          dataPosyandu.map((value) => (
                            <Select.Option key={value.id} value={value.id}>
                              {value.nama}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </>
                )}

                <Form.Item>
                  <button
                    htmlType="submit"
                    className="button__"
                    style={{ fontSize: '22px', height: 50, borderRadius: '20px', marginBottom: '20px' }}
                  >
                    Daftar
                  </button>
                </Form.Item>
              </Form>
            </Col>
            <Col>
              <p>
                Sudah punya akun? <Link to="/sign-in">Masuk</Link>
              </p>
            </Col>
          </Row>

        </Row>
        {/* <Row
          style={{
            marginLeft: "20px",
            width: "30%",
            height: "870px",
            background: `url(${banner}) no-repeat center`,
            borderRadius: 10,
          }}
          justify="center"
          align="middle"
        >
        </Row> */}
      </Row>
    </>
  );
}
