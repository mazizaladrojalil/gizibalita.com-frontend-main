import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import FormUpdateDataArtikel from "../../components/form/FormUpdateDataArtikel";
import { formatDate2 } from "../../utilities/Format";
import { FiRotateCcw } from "react-icons/fi";
import ReactSelect from 'react-select';
import "./index.css";
export default function ArtikelAdmin() {
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  const [user, setUser] = useState(login_data);
  const [form] = Form.useForm();
  const [refreshKey, setRefreshKey] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [imageFile, setImageFile] = useState(null);
  const [dataKategori, setDataKategori] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataArtikel, setDataArtikel] = useState(null);
  const [valueContent, setValueContent] = useState('');
  const [statePage, setStatePage] = useState('');
  const [isOpenModalUpdateDataArtikel, setIsOpenModalUpdateDataArtikel] = useState(false);
  const [searchText, setSearchedText] = useState("");

  const [statePageKateogries, setStatePageKateogries] = useState(false);

  const onFinish = (values) => {
    console.log(values);
    if (!statePageKateogries) {
      if (imageFile) {
        let formData = new FormData();
        formData.append('judul', values.judul);
        formData.append('kategori', values.kategori);
        formData.append('penulis', values.penulis);
        formData.append('content', valueContent);
        formData.append('image', imageFile);

        console.log(formData)
        axios
          .post(`${process.env.REACT_APP_BASE_URL}/api/artikel`, formData, {
            headers: { Authorization: `Bearer ${user.token.value}` },
            'Content-Type': 'multipart/form',
          })
          .then((response) => {
            setRefreshKey((oldKey) => oldKey + 1);
            messageApi.open({
              type: "success",
              content: "Data berhasil tersimpan",
            })
            form.resetFields();
            setValueContent('');
            setImageFile(null)
          })
          .catch((err) => {
            messageApi.open({
              type: "error",
              content: "Data gagal tersimpan",
            });
          });
      }
    } else {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/kategori`, values, {
          headers: { Authorization: `Bearer ${user.token.value}` },
        })
        .then((response) => {
          setRefreshKey((oldKey) => oldKey + 1);
          messageApi.open({
            type: "success",
            content: "Data berhasil tersimpan",
          })
          form.resetFields();
          setValueContent('');
          setImageFile(null)
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: "Data gagal tersimpan",
          });
        });
    }

  };

  const onFinishFailed = (values) => {
    console.log(values);
  };

  const columns = [
    {
      title: "Judul Berita",
      dataIndex: "judul",
      key: "judul",
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return String(record.judul).toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: "Tanggal Upload",
      dataIndex: "kategori",
      key: "kategori",
      render: (_, record) => (
        formatDate2(record.updated_at)
      )
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex">
          <button
            type="button"
            className="buttonUpdateArtikel"
            onClick={() => {
              setDataArtikel(record);
              setIsOpenModalUpdateDataArtikel(true);
            }}
          >
            Update
          </button>
          <button
            type="button"
            className="buttonDeleteArtikel"
            onClick={() => {
              Modal.confirm({
                title: "Apakah anda yakin?",
                icon: <ExclamationCircleOutlined />,
                content: "Data yang dihapus tidak dapat dikembalikan",
                okText: "Ya",
                cancelText: "Tidak",
                onOk: () => {
                  deleteDesa(record.id)
                },
              })
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  console.log(dataSource)
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/artikel`,
        {
          headers: { Authorization: `Bearer ${user.token.value}` },
        })

      .then((response) => {
        setDataSource(response.data.data);
        setIsLoading(false);
        setStatePage("Artikel");
        setStatePageKateogries(false)
      })
      .catch((err) => {
        setIsLoading(false);
      });
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/kategori`,
        {
          headers: { Authorization: `Bearer ${user.token.value}` },
        })

      .then((response) => {
        setDataKategori(response.data.data);
        setIsLoading(false);
        setStatePageKateogries(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
    // eslint-disable-next-line
  }, [refreshKey]);

  function deleteDesa(id) {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/api/artikel/${id}`, {
        headers: { Authorization: `Bearer ${user.token.value}` },
      })
      .then((response) => {
        messageApi.open({
          type: "success",
          content: "Data berhasil dihapus",
        });
        setTimeout(() => {
          setRefreshKey((oldKey) => oldKey + 1);
          window.location.reload();
          setValueContent('');
          fetch();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        messageApi.open({
          type: "error",
          content: "Data gagal dihapus",
        });
      });
  }

  return (
    <>
      <Container fluid style={{ backgroundColor: "white", padding: "20px", borderRadius: "20px" }}>
        {contextHolder}
        <Row justify="space-between">
          <Col span={24}>
            <div style={{ justifyContent: "center", display: "flex", marginBottom: "20px" }}>
              <button
                style={{ height: "40px", width: "120px", marginRight: "20px" }}
                class="button_kirim"
                onClick={() => {
                  setStatePage("Artikel");
                }}
              >
                <h1 className="h1_admin" style={{ color: "white" }}>Artikel</h1>
              </button>
              <button
                style={{ height: "40px", width: "120px" }}
                class="button_kirim"
                onClick={() => {
                  setStatePage("Riwayat");
                }}
              >
                <h1 className="h1_admin" style={{ color: "white" }}>Riwayat</h1>
              </button>
            </div>
          </Col>
          <Col sm={24}>
            {
              statePage === "Artikel" ? (
                <Form
                  form={form}
                  name="basic"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  layout="horizontal"
                >
                  <Form.Item
                    label="Pilih kategori"
                    name="kategori"
                    rules={[
                      {
                        required: true,
                        message: "Kategori masih kosong!",
                      },
                    ]}
                  >
                    <Select size="4" listHeight={100} optionFilterProp="children" showSearch placeholder="Pilih Kategori">

                      <Select.Option value="add">
                        <Button onClick={() => {
                          setStatePageKateogries(true)

                        }}>Tambah Kategori</Button>
                      </Select.Option>

                      {
                        statePageKateogries ?
                          <Select.Option>
                          </Select.Option> :
                          dataKategori.map((item) => (

                            <Select.Option key={item.id} value={item.name} >
                              {item.name}
                            </Select.Option>
                          ))
                      }
                    </Select>
                  </Form.Item>
                  {
                    statePageKateogries &&
                    <Form.Item
                      style={{ Width: "100%" }}
                      label="Tambah Kategori"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Nama Kategori masih kosong!",
                        },
                      ]}
                    >
                      <Input placeholder="Masukkan Nama Kategori" />
                    </Form.Item>
                  }

                  {
                    !statePageKateogries &&
                    <div>
                      <Form.Item
                        style={{ Width: "100%" }}
                        label="Judul"
                        name="judul"
                        rules={[
                          {
                            required: true,
                            message: "Judul masih kosong!",
                          },
                        ]}
                      >
                        <Input placeholder="Masukkan judul" />
                      </Form.Item>
                      <Form.Item
                        style={{ Width: "100%" }}
                        label="Nama penulis"
                        name="penulis"
                        rules={[
                          {
                            required: true,
                            message: "Penulis masih kosong!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        style={{ Width: "100%" }}
                        label="Unggah cover artikel"
                        name="image"
                        rules={[
                          {
                            required: true,
                            message: "Cover masih kosong!",
                          },
                        ]}
                      >

                        <div className="flex justify-center items-center w-full">
                          <label
                            htmlFor="import_pelanggan"
                            className="flex flex-col justify-center items-center w-full h-64 bg-white rounded-lg border-2 border-dashed cursor-pointer dark:hover:bg-bray-800" style={{ borderColor: "#FFB4B4" }}
                          >

                            {imageFile ? (
                              <div className="flex flex-col justify-center items-center w-full h-full">
                                {imageFile?.name}
                              </div>
                            ) : (
                              <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                <svg
                                  aria-hidden="true"
                                  className="mb-3 w-10 h-10 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                  ></path>
                                </svg>
                                <p className="mb-2 text-sm dark:text-gray-400" style={{ color: "#b41318" }}>
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{' '}
                                  or drag and drop
                                </p>
                                <p className="text-xs" style={{ color: "#b41318" }}>
                                  Unggah Cover Digital
                                </p>
                              </div>
                            )}
                            <input
                              id="import_pelanggan"
                              type="file"
                              accept=".jpg, .jpeg, .png"
                              style={{ color: "#b41318" }}
                              onChange={(e) => {
                                setImageFile(e.target.files[0]);
                              }}
                            />
                          </label>
                        </div>
                      </Form.Item>
                      <Form.Item
                        style={{ Width: "100%", flexDirection: "row" }}
                        label="Paragraf"
                        name="content"
                      >

                      </Form.Item>
                      <ReactQuill theme="snow" value={valueContent} onChange={setValueContent} />;
                    </div>
                  }


                  <Col span={24} align="center">
                    <Form.Item>
                      {/* <button type="button" class="button_kirim mx-5">
                      Kirim
                    </button> */}
                      <Button type="primary" htmlType="submit">
                        {statePageKateogries ? "Tambah" : "Kirim"}
                      </Button>
                      {
                        statePageKateogries &&
                        <Button type="primary" htmlType="submit" onClick={() => {
                          setStatePageKateogries(false)
                        }}>
                          Batal
                        </Button>
                      }

                    </Form.Item>
                  </Col>
                </Form>
              ) : (
                !isLoading && (
                  <Table
                    title={
                      () => (
                        <div className="flex justify-between items-center">
                          <div className="flex justify-start items-center">
                            <h2 className="text-sm font-semibold">Daftar Posyandu</h2>
                          </div>
                          <div className="flex justify-end items-center">
                            <Input.Search
                              placeholder="Search here ..."
                              onSearch={(value) => {
                                setSearchedText(value)
                              }}
                            />
                          </div>
                        </div>

                      )
                    }
                    dataSource={dataSource}
                    columns={columns}
                    loading={isLoading}
                    pagination={{ pageSize: 5 }}
                  />
                )
              )
            }
          </Col>
          <Col>
            <FormUpdateDataArtikel
              isOpen={isOpenModalUpdateDataArtikel}
              onCancel={() => setIsOpenModalUpdateDataArtikel(false)}
              fetch={() => setRefreshKey((oldKey) => oldKey + 1)}
              data={dataArtikel}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}


// function ArtikelAdmin() {
//   const [selectedOption, setSelectedOption] = useState('');
//   const [showPopup, setShowPopup] = useState(false);

//   const handleOptionChange = (e) => {
//     setSelectedOption(e.target.value);
//     setShowPopup(true);
//   };

//   const handlePopupClose = () => {
//     setShowPopup(false);
//   };

//   return (
//     <div>
//       <h1>Pilih Opsi</h1>
//       <select value={selectedOption} onChange={handleOptionChange}>
//         <option value="">Pilih</option>
//         <option value="option1">Opsi 1</option>
//         <option value="option2">Opsi 2</option>
//         <option value="option3">Opsi 3</option>
//       </select>
//       {showPopup && (
//         <div>
//           <h2>Pop-up</h2>
//           <p>Anda memilih opsi: {selectedOption}</p>
//           <button onClick={handlePopupClose}>Tutup</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ArtikelAdmin;
