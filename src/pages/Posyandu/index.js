import { Col, DatePicker, Form, message, Row, Spin, Modal } from "antd";
import Navbar from "../../components/layout/Navbar";
import bg_dashboard from "../../assets/img/bg-dashboard.svg";
import { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../components/layout/Table";
import CustomButton from "../../components/layout/Button/CustomButton";
import axios from "axios";
import moment from "moment";
import ReactToPrint from 'react-to-print';
import BukuPanduan from './BukuPanduan';
import "./posyandu.css";
import { Link, useNavigate } from "react-router-dom";
import FormUpdateDataAnak from "../../components/form/FormUpdateDataAnak";
import { ExclamationCircleOutlined } from '@ant-design/icons';

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

const PosyanduDashboard = () => {
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setUser] = useState(login_data);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataAnak, setDataAnak] = useState(null);
  const ref = useRef();
  const navigate = useNavigate();
  const [isOpenModalUpdateDataAnak, setIsOpenModalUpdateDataAnak] = useState(false);
  console.log(user);
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
  const columns = useMemo(() => {
    return [
      {
        Header: 'Nama Anak',
        accessor: 'nama',
      },
      {
        Header: 'Tangal Lahir',
        accessor: 'tanggal_lahir',
      },
      {
        Header: 'Umur',
        accessor: 'umur',
        Cell: ({ row }) => {
          const umur = row.original.tanggal_lahir;
          return (
            <span>
              {`${moment().diff(moment(umur), "month")} Bulan`}
            </span>
          );
        },
      },
      {
        Header: 'Jenis Kelamin',
        accessor: 'gender',
        Cell: ({ value }) => {
          return (
            <span>
              {
                value === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"
              }
            </span>
          );
        },
      },
       {
        Header: 'Alamat',
        accessor: 'alamat',
      },
      {
        Header: '',
        accessor: 'aksi',
        Cell: ({ row }) => {
          const id = row.original.id;
          const data = row.original;
          return (
            <>
              <div style={{justifyContent:"space-between", display:"flex"}}>
                  <button 
                    class="btnDetail" 
                    onClick={(e) => navigate(`/posyandu/dashboard/detail/${id}`)}
                  >
                      Detail
                  </button>
                {/* </Link> */}
               
                <button 
                  type="button" 
                  class="buttonUpdate"
                  onClick={() => {
                    setDataAnak(data);
                    setIsOpenModalUpdateDataAnak(true);
                  }}
                >
                  Update
                </button>
                <button 
                  class="buttonDelete"
                  onClick={() => {
                    Modal.confirm({
                      title: "Apakah anda yakin?",
                      icon: <ExclamationCircleOutlined />,
                      content: "Data yang dihapus tidak dapat dikembalikan",
                      okText: "Ya",
                      cancelText: "Tidak",
                      onOk: () => {
                        axios
                          .delete(
                            `${process.env.REACT_APP_BASE_URL}/api/posyandu/data-anak/${id}`,
                            {
                              headers: {
                                Authorization: `Bearer ${user.token.value}`,
                              },
                            }
                          )
                          .then((response) => {
                            messageApi.open({
                              type: "success",
                              content: "Data berhasil dihapus",
                            });
                            setTimeout(() => {
                              setRefreshKey((oldKey) => oldKey + 1);
                              window.location.reload();
                              fetch();
                            }, 1000);
                          })
                          
                          .catch((err) => {
                            console.log(err);
                            messageApi.open({
                              type: "error",
                              content: "Data gagal dihapus",
                          });
                            setTimeout(() => {
                              window.location.reload();
                            }, 1000);
                          });
                      },
                      // onCancel: () => {
                      //    messageApi.open({
                      //         type: "error",
                      //         content: "Data gagal dihapus",
                      //     });
                      // },
                    })
                  }}
                >
                  Delete
                </button>
              </div>
            {/* <div className="flex">
              <CustomButton className="bg-orange-500">
                Detail
              </CustomButton>
              <CustomButton className="bg-green-300">
                Update
              </CustomButton>
              <CustomButton className="bg-red-300">
                Delete
              </CustomButton>
            </div> */}
            
            </>
          );
        },
      },
    ];
  }, []);
  return (
    <>
      {contextHolder}
       <div style={{display:"none"}}>
          <BukuPanduan ref={ref}/>
        </div>
      <BackgroundComponent />
      <Navbar isLogin kader/>
      <Row className="justify-content-center align-items-center flex" style={{marginTop:"94px"}}>
        <Col>
          <h6 className="dashboard">Hallo {user && user.user.name}</h6>
          
        </Col>
      </Row>
      <Row className="justify-content-center" style={{marginTop:"30px"}}>
         
         {/* <Link to={`/dashboard/detail/${record.id}`}>
            <button type="button" class="button3 mx-5">
              Cek Data Anak
            </button>
          </Link> */}
       
        <ReactToPrint
          trigger={() => {
            return (
              <button type="button" class="button3 mx-5">
                Baca Panduan
              </button>
            );
          }}
          content={() => ref.current}
          documentTitle="Buku Panduan.pdf"
        />
       
      </Row>
      <Row className="justify-content-center" style={{marginTop:"30px"}}>
        <Col >
          <Table
            data={data || []}
            columns={columns}
            initialState={{
              pageSize: 10,
            }}
            ButtonCus/>
        </Col>
      </Row>
          
        <Col sm="12" className="d-flex">
          <FormUpdateDataAnak
            isOpen={isOpenModalUpdateDataAnak}
            onCancel={() => setIsOpenModalUpdateDataAnak(false)}
            fetch={() => setRefreshKey((oldKey) => oldKey + 1)}
            data={dataAnak}
          />
        </Col>
    </>
  )
}

export default PosyanduDashboard
