import { Col, Row, Space, Table } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormInputDataAnak from "../../components/form/FormInputDataAnak";
import FormUpdateDataAnak from "../../components/form/FormUpdateDataAnak";
import Navbar from "../../components/layout/Navbar";
import Navigation from "../../components/layout/Navigation";
import './dashboard-style.css';
import bg_dashboard from "../../assets/img/bg-dashboard.svg";
import Carousel from 'react-bootstrap/Carousel';
import bayi from "../../assets/img/bayi_1.png";
import footerImage from "../../assets/img/powered_by_telkom.svg";



const BackgroundComponent = () => {
  const backgroundStyles = {
    position: "absolute",
    top: 80,
    left: -5,
    width: "100vw",
    height: '40%',
    zIndex: -10000,
    background: `url(${bg_dashboard}) no-repeat center`,
    backgroundSize: '100vw auto',
    borderRadius: "0 0 50px 50px",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.19)"
  };
  return <div style={backgroundStyles} />;
};

export default function Dashboard() {
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }

  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);
  const [isOpenModalInputDataAnak, setIsOpenModalInputDataAnak] =
    useState(false);
  const [isOpenModalUpdateDataAnak, setIsOpenModalUpdateDataAnak] =
    useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataAnak, setDataAnak] = useState(null);

  useEffect(() => {

    function fetchDataAnak() {
      if (user.user.role !== "ORANG_TUA") {
        axios
          .get(`${process.env.REACT_APP_BASE_URL}/api/posyandu/data-anak`, {
            headers: { Authorization: `Bearer ${user.token.value}` },
          })
          .then((response) => {
            const sortedData = response.data.data.sort((a, b) =>
              b.created_at.localeCompare(a.created_at)
            );
            setData(sortedData);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err);
          });
      } else {
        axios
          .get(`${process.env.REACT_APP_BASE_URL}/api/orang-tua/data-anak`, {
            headers: { Authorization: `Bearer ${user.token.value}` },
          })
          .then((response) => {
            const sortedData = response.data.data.sort((a, b) =>
              b.created_at.localeCompare(a.created_at)
            );
            setData(sortedData);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err);
          });
      }
    }

    fetchDataAnak();
    // eslint-disable-next-line
  }, [refreshKey]);

  function deleteAnak(id) {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/posyandu/data-anak/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token.value}` },
        }
      )
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const columns = [
    {
      title: "Nama Anak",
      dataIndex: "nama",
      key: "nama",
    },
    {
      title: "Tanggal Lalhir",
      dataIndex: "tanggal_lahir",
      key: "tanggal_lahir",
    },
    {
      title: "Umur",
      dataIndex: "tanggal_lahir",
      key: "tanggal_lahir",
      render: (umur) => `${moment().diff(moment(umur), "month")} Bulan`,
    },
    {
      title: "Jenis Kelamin",
      key: "gender",
      dataIndex: "gender",
      render: (gender) => (gender === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"),
    },
    // {
    //   title: "Orang Tua",
    //   key: "orang_tua",
    //   dataIndex: "orang_tua",
    // },
    {
      title: "Alamat",
      key: "alamat",
      dataIndex: "alamat",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/dashboard/detail/${record.id}`}>
            <button
              type="button"
              className="button_dashboard"
            >
              Detail
            </button>
          </Link>
          {/* <button
            type="button"
            className="button_dashboard"
            onClick={() => {
              setDataAnak(record);
              setIsOpenModalUpdateDataAnak(true);
            }}
          >
            Update
          </button> */}
          {user && user.user.role !== "ORANG_TUA" && (
            <button
              className="button_dashboard"
              onClick={() => deleteAnak(record.id)}
              type="button"
            >
              Delete
            </button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <BackgroundComponent />
      <Navbar isLogin />
      <Row className="justify-content-center align-items-center d-flex p-4" style={{ height: "400px", padding: "30px" }}>
        <Col sm="6" style={{ width: "400px" }}>
          <h6 className="dashboard">Hallo</h6>
          <h6 className="dashboard">{user && user.user.name}</h6>
          <h5 style={{ color: "#B14444" }}>Selamat Datang Kembali</h5>
          <button class="cssbuttons-io-button" onClick={() => setIsOpenModalInputDataAnak(true)}
            type="button">Tambah Anak
            <div class="icon">
              <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M31 7C31 3.41015 28.0899 0.5 24.5 0.5C20.9101 0.5 18 3.41015 18 7V17.75H7.25C3.66015 17.75 0.75 20.6601 0.75 24.25C0.75 27.8398 3.66015 30.75 7.25 30.75H18V41.5C18 45.0899 20.9101 48 24.5 48C28.0899 48 31 45.0899 31 41.5V30.75H41.75C45.3399 30.75 48.25 27.8399 48.25 24.25C48.25 20.6601 45.3399 17.75 41.75 17.75H31V7Z" fill="#FF9999" />
              </svg>
            </div>
          </button>
        </Col>
        <Col sm="6" style={{ width: "200px" }}>
          {data.length > 0 && (
            <Carousel>
              {data.map((item, index) => (
                <Carousel.Item interval={1000} style={{ justifyContent: "center", padding: "10px" }} key={index}>
                  <Link to={`/dashboard/detail/${item.id}`}>
                    <img className="d-block w-100" src={bayi} alt="Slide" />
                    <h6 style={{ position: "absolute", top: 260, left: 20, color: "white" }}>
                      {item.nama}
                    </h6>
                    <h6 style={{ position: "absolute", top: 280, left: 20, color: "white" }}>
                      {`${moment().diff(moment(item.tanggal_lahir), "month")} Bulan`}
                    </h6>
                  </Link>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </Col>
      </Row>
      <Row className="justify-content-center d-flex">
        {/* <Col span={24}>
          <Navigation
            breadcrumb={[
              {
                title: "Dashboard",
                link: "",
              },
            ]}
          />
        </Col> */}

        <Row className="align-items-center">
          <Col span={24}>
            <Table
              columns={columns}
              dataSource={data}
              loading={isLoading}
              pagination={{ pageSize: 7 }}
            />



          </Col>
        </Row>
      </Row>

      <Col sm="12" className="d-flex ">
        <FormInputDataAnak
          isOpen={isOpenModalInputDataAnak}
          onCancel={() => setIsOpenModalInputDataAnak(false)}
          fetch={() => setRefreshKey((oldKey) => oldKey + 1)}
        />
      </Col>

      <FormUpdateDataAnak
        isOpen={isOpenModalUpdateDataAnak}
        onCancel={() => setIsOpenModalUpdateDataAnak(false)}
        fetch={() => setRefreshKey((oldKey) => oldKey + 1)}
        data={dataAnak}
      />
    </>
  );
}
