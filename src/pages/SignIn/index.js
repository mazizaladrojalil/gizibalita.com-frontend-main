import { Col, Form, Input, message, Row, Select } from "antd";
import axios from "axios";
import React, { useState } from "react";
import './signIn.css';
import { Link, useNavigate } from "react-router-dom";
import { MailOutlined, KeyOutlined } from '@ant-design/icons';
import logo from './GiziBalita_logo.png';
import background from './login_bg.svg';
import banner from './banner.svg';
import { Colors } from "chart.js";

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



export default function SignIn(props) {
  const { TenagaKesehatan, Desa, kaderPosyandu, admin } = props;
  let navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [role, setRole] = useState(0);

  const onFinish = (values) => {
    if (TenagaKesehatan) {
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/auth/tenaga-kesehatan/login`,
          {
            email: values.email,
            password: values.password,
          }
        )
        .then((response) => {
          messageApi.open({
            type: "success",
            content: "Berhasil Login",
          });
          localStorage.setItem(
            "login_data",
            JSON.stringify(response.data.data)
          );
          setTimeout(() => {
            navigate("/tenaga-kesehatan/dashboard");
          }, 1000);
        })
        .catch((error) => {
          messageApi.open({
            type: "error",
            content: "Email dan Password belum sesuai",
          });
        });
    }

    if (Desa) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/auth/desa/login`, {
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          messageApi.open({
            type: "success",
            content: "Berhasil Login",
          });
          localStorage.setItem(
            "login_data",
            JSON.stringify(response.data.data)
          );
          setTimeout(() => {
            navigate("/desa/dashboard");
          }, 1000);
        })
        .catch((error) => {
          messageApi.open({
            type: "error",
            content: "Email dan Password belum sesuai",
          });
        });
    }

    if (values && kaderPosyandu === true) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/auth/posyandu/login`, {
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          messageApi.open({
            type: "success",
            content: "Berhasil Login",
          });
          localStorage.setItem(
            "login_data",
            JSON.stringify(response.data.data)
          );
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        })
        .catch((error) => {
          messageApi.open({
            type: "error",
            content: "Email dan Password belum sesuai",
          });
        });
    }

    else {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/auth/orang-tua/login`, {
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          const role_user = response.data.data.user.role;
          messageApi.open({
            type: "success",
            content: "Berhasil Login",
          });
          localStorage.setItem(
            "login_data",
            JSON.stringify(response.data.data)
          );
          setTimeout(() => {
            // if else role user
            if (role_user === "ORANG_TUA") {
              navigate("/dashboard/");
            }
          }, 1000);
        })
        .catch((error) => {
          messageApi.open({
            type: "error",
            content: "Email dan Password belum sesuai",
          });
        });
    }

    if (admin) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/auth/admin/login`, {
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          messageApi.open({
            type: "success",
            content: "Berhasil Login",
          });
          localStorage.setItem(
            "login_data",
            JSON.stringify(response.data.data)
          );
          setTimeout(() => {
            navigate("/dashboard/admin");
          }, 1000);
        })
        .catch((error) => {
          messageApi.open({
            type: "error",
            content: "Email dan Password belum sesuai",
          });
        });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <BackgroundComponent />
      {contextHolder}
      {!Desa && !TenagaKesehatan && !kaderPosyandu && !admin ? (
        <Row
          style={{
            // background: `${
            //   TenagaKesehatan || Desa
            //     ? "linear-gradient(42deg,#090979,#00d4ff)"
            //     : "linear-gradient(-135deg,#c850c0,#4158d0)"
            // }`,
            background: `${TenagaKesehatan || Desa
              ? "rgba(1, 0, 0, 0)"
              : "rgba(0, 0, 0, 0)"
              }`,
            height: "100vh",
          }}
          justify="center"
          align="middle"
        >
          <Row
            style={{
              width: "50%",
              height: "100%",
              borderRadius: 10,
            }}
            justify="center"
            align="middle"
          >
            <Row justify="center" align="middle" style={{ width: '700px' }}>
              <Col>
                {/* Logo */}
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
                  style={{ fontSize: "20px" }}
                >
                  <h5 className="label">Email</h5>
                  <Form.Item
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
                    <Input id="input_signIn" placeholder="user@email.com" prefix={<span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }} >
                      <MailOutlined style={{ marginRight: '8px' }} />
                      |
                    </span>} style={{ borderRadius: "20px", height: 50, display: 'flex', alignItems: 'center' }} />
                  </Form.Item>

                  <h5 className="label">Password</h5>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Password masih kosong!",
                      },
                    ]}
                  >
                    <Input.Password id="input_signIn" placeholder="password" prefix={<span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                      <KeyOutlined style={{ marginRight: '8px' }} />
                      |
                    </span>} style={{ borderRadius: "20px", height: 50, display: 'flex', alignItems: 'center' }} />
                  </Form.Item>


                  <Form.Item>
                    <button
                      type="submit"
                      className="button__"
                      style={{ fontSize: '22px', height: 50, borderRadius: '20px', marginBottom: '5px' }}
                    >
                      LOGIN
                    </button>


                  </Form.Item>


                </Form>
              </Col>
              <Col align="center">
                <p>
                  Tidak punya akun? <Link to="/sign-up">Daftar</Link>,
                </p>
                <p>
                  atau Login sebagai <Link to="/sign-in/admin"> Admin</Link>, <Link to="/sign-in/kader-posyandu">Kader</Link>, <Link to="/sign-in/desa">Desa</Link>, <Link to="/sign-in/tenaga-kesehatan">Tenaga kesehatan</Link>
                </p>
              </Col>
            </Row>
          </Row>

          <Row
            style={{
              width: "50%",
              height: "90%",
              background: `url(${banner}) no-repeat center`,
              backgroundSize: '700px',
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}

          >

          </Row>
        </Row>
      ) : null}

      {kaderPosyandu === true ? (
        <Row
          style={{
            // background: `${
            //   TenagaKesehatan || Desa
            //     ? "linear-gradient(42deg,#090979,#00d4ff)"
            //     : "linear-gradient(-135deg,#c850c0,#4158d0)"
            // }`,
            background: `${TenagaKesehatan || Desa
              ? "rgba(1, 0, 0, 0)"
              : "rgba(0, 0, 0, 0)"
              }`,
            height: "100vh",
          }}
          justify="center"
          align="middle"
        >
          <Row
            style={{
              width: "50%",
              height: "100%",
              borderRadius: 10,
            }}
            justify="center"
            align="middle"
          >
            <Row justify="center" align="middle" style={{ width: '700px', gap: "20px" }}>
              <Col>
                {/* Logo */}
                <img src={logo}
                  alt="Image"
                  style={{
                    width: "200px",
                    height: "auto",
                    marginBottom: "10px",
                  }} />
              </Col>
              <Col span={20} justify="center" align="middle">
                <h3 style={{ color: "#CE4343" }}>Kader Posyandu</h3>
              </Col>
              <Col span={20}>
                <Form
                  name="basic"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  layout="vertical"
                  style={{ fontSize: "20px" }}
                >
                  <h5 className="label">Email</h5>
                  <Form.Item
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
                    <Input id="input_signIn" placeholder="user@email.com" prefix={<span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }} >
                      <MailOutlined style={{ marginRight: '8px' }} />
                      |
                    </span>} style={{ borderRadius: "20px", height: 50, display: 'flex', alignItems: 'center' }} />
                  </Form.Item>

                  <h5 className="label">Password</h5>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Password masih kosong!",
                      },
                    ]}
                  >
                    <Input.Password id="input_signIn" placeholder="password" prefix={<span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                      <KeyOutlined style={{ marginRight: '8px' }} />
                      |
                    </span>} style={{ borderRadius: "20px", height: 50, display: 'flex', alignItems: 'center' }} />
                  </Form.Item>


                  <Form.Item>
                    <button
                      type="submit"
                      className="button__"
                      style={{ fontSize: '22px', height: 50, borderRadius: '20px', marginBottom: '20px' }}
                    >
                      LOGIN
                    </button>


                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Row>

          <Row
            style={{
              width: "50%",
              height: "90%",
              background: `url(${banner}) no-repeat center`,
              backgroundSize: '700px',
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}

          >

          </Row>
        </Row>
      ) : null}

      {Desa === true ? (
        <Row
          style={{
            // background: `${
            //   TenagaKesehatan || Desa
            //     ? "linear-gradient(42deg,#090979,#00d4ff)"
            //     : "linear-gradient(-135deg,#c850c0,#4158d0)"
            // }`,
            background: `${TenagaKesehatan || Desa
              ? "rgba(1, 0, 0, 0)"
              : "rgba(0, 0, 0, 0)"
              }`,
            height: "100vh",
          }}
          justify="center"
          align="middle"
        >
          <Row
            style={{
              width: "50%",
              height: "100%",
              borderRadius: 10,
            }}
            justify="center"
            align="middle"
          >
            <Row justify="center" align="middle" style={{ width: '700px' }}>
              <Col>
                {/* Logo */}
                <img src={logo}
                  alt="Image"
                  style={{
                    width: "200px",
                    height: "auto",
                    marginBottom: "10px",
                  }} />
              </Col>
              <h5 style={{ color: "#CE4343", fontWeight: "700", marginTop: "30px" }}>Desa</h5>
              <Col span={20}>
                <Form
                  name="basic"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  layout="vertical"
                  style={{ fontSize: "20px" }}
                >
                  <h5 className="label">Email</h5>
                  <Form.Item
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
                    <Input id="input_signIn" placeholder="user@email.com" prefix={<span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }} >
                      <MailOutlined style={{ marginRight: '8px' }} />
                      |
                    </span>} style={{ borderRadius: "20px", height: 50, display: 'flex', alignItems: 'center' }} />
                  </Form.Item>

                  <h5 className="label">Password</h5>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Password masih kosong!",
                      },
                    ]}
                  >
                    <Input.Password id="input_signIn" placeholder="password" prefix={<span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                      <KeyOutlined style={{ marginRight: '8px' }} />
                      |
                    </span>} style={{ borderRadius: "20px", height: 50, display: 'flex', alignItems: 'center' }} />
                  </Form.Item>


                  <Form.Item>
                    <button
                      type="submit"
                      className="button__"
                      style={{ fontSize: '22px', height: 50, borderRadius: '20px', marginBottom: '20px' }}
                    >
                      LOGIN
                    </button>


                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Row>

          <Row
            style={{
              width: "50%",
              height: "90%",
              background: `url(${banner}) no-repeat center`,
              backgroundSize: '700px',
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}

          >

          </Row>
        </Row>
      ) : null}

      {TenagaKesehatan === true ? (
        <Row
          style={{
            // background: `${
            //   TenagaKesehatan || Desa
            //     ? "linear-gradient(42deg,#090979,#00d4ff)"
            //     : "linear-gradient(-135deg,#c850c0,#4158d0)"
            // }`,
            background: `${TenagaKesehatan || Desa
              ? "rgba(1, 0, 0, 0)"
              : "rgba(0, 0, 0, 0)"
              }`,
            height: "100vh",
          }}
          justify="center"
          align="middle"
        >
          <Row
            style={{
              width: "50%",
              height: "100%",
              borderRadius: 10,
            }}
            justify="center"
            align="middle"
          >
            <Row justify="center" align="middle" style={{ width: '700px' }}>
              <Col>
                {/* Logo */}
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
                  style={{ fontSize: "20px" }}
                >
                  <h5 className="label">Email</h5>
                  <Form.Item
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
                    <Input id="input_signIn" placeholder="user@email.com" prefix={<span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }} >
                      <MailOutlined style={{ marginRight: '8px' }} />
                      |
                    </span>} style={{ borderRadius: "20px", height: 50, display: 'flex', alignItems: 'center' }} />
                  </Form.Item>

                  <h5 className="label">Password</h5>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Password masih kosong!",
                      },
                    ]}
                  >
                    <Input.Password id="input_signIn" placeholder="password" prefix={<span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                      <KeyOutlined style={{ marginRight: '8px' }} />
                      |
                    </span>} style={{ borderRadius: "20px", height: 50, display: 'flex', alignItems: 'center' }} />
                  </Form.Item>


                  <Form.Item>
                    <button
                      type="submit"
                      className="button__"
                      style={{ fontSize: '22px', height: 50, borderRadius: '20px', marginBottom: '20px' }}
                    >
                      LOGIN
                    </button>


                  </Form.Item>

                  <Col span={30} align="center" justify="center">
                    <p>
                      Login sebagai <Link to="/sign-in"> Orang tua</Link>, <Link to="/sign-in/kader-posyandu">Kader</Link>, <Link to="/sign-in/admin">Admin</Link>
                    </p>
                  </Col>
                </Form>
              </Col>
              <Col>
                <p>
                  Tidak punya akun? <Link to="/sign-up">Daftar</Link>
                </p>
              </Col>
            </Row>
          </Row>

          <Row
            style={{
              width: "50%",
              height: "90%",
              background: `url(${banner}) no-repeat center`,
              backgroundSize: '700px',
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}

          >

          </Row>
        </Row>
      ) : null}

      {admin === true ? (
        <Row
          style={{
            background: `${TenagaKesehatan || Desa
              ? "rgba(1, 0, 0, 0)"
              : "rgba(0, 0, 0, 0)"
              }`,
            height: "100vh",
          }}
          justify="center"
          align="middle"
        >
          <Row
            style={{
              width: "50%",
              height: "100%",
              borderRadius: 10,
            }}
            justify="center"
            align="middle"
          >
            <Row justify="center" align="middle" style={{ width: '700px', gap: "20px" }}>
              <Col span={20} justify="center" align="middle">
                {/* Logo */}
                <img src={logo}
                  alt="Image"
                  style={{
                    width: "200px",
                    height: "auto",
                    marginBottom: "10px",
                  }} />
              </Col>
              <Col span={20} justify="center" align="middle">
                <h3 style={{ color: "#CE4343" }}>Admin</h3>
              </Col>

              <Col span={20}>
                <Form
                  name="basic"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  layout="vertical"
                  style={{ fontSize: "20px" }}
                >
                  <h5 className="label">Email</h5>
                  <Form.Item
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
                    <Input id="input_signIn" placeholder="user@email.com" prefix={<span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }} >
                      <MailOutlined style={{ marginRight: '8px' }} />
                      |
                    </span>} style={{ borderRadius: "20px", height: 50, display: 'flex', alignItems: 'center' }} />
                  </Form.Item>

                  <h5 className="label">Password</h5>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Password masih kosong!",
                      },
                    ]}
                  >
                    <Input.Password id="input_signIn" placeholder="password" prefix={<span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                      <KeyOutlined style={{ marginRight: '8px' }} />
                      |
                    </span>} style={{ borderRadius: "20px", height: 50, display: 'flex', alignItems: 'center' }} />
                  </Form.Item>


                  <Form.Item>
                    <button
                      type="submit"
                      className="button__"
                      style={{ fontSize: '22px', height: 50, borderRadius: '20px', marginBottom: '20px' }}
                    >
                      LOGIN
                    </button>


                  </Form.Item>
                  <Col span={30} align="center" justify="center">
                    <p>
                      Login sebagai <Link to="/sign-in"> Orang tua</Link>, <Link to="/sign-in/kader-posyandu">Kader</Link>, <Link to="/sign-in/desa">Desa</Link>
                    </p>
                  </Col>
                </Form>
              </Col>
            </Row>
          </Row>

          <Row
            style={{
              width: "50%",
              height: "90%",
              background: `url(${banner}) no-repeat center`,
              backgroundSize: '700px',
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}

          >

          </Row>
        </Row>
      ) : null}
    </>
  );
}
