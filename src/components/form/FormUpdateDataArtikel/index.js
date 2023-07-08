import {
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import './style.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function FormUpdateDataArtikel(props) {
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);
  const { isOpen, onCancel, fetch, data } = props;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [imageFile, setImageFile] = useState(null);
  const [valueContent, setValueContent] = useState('');

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        judul: data.judul,
        kategori: data.kategori,
        penulis: data.penulis,
      });
      setValueContent(data.content)
    }
  }, [form, data]);

  function onOK() {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();

        if(imageFile){
            let formData = new FormData();
            formData.append('judul', values.judul);
            formData.append('kategori', values.kategori);
            formData.append('penulis', values.penulis);
            formData.append('content', valueContent);
            formData.append('image', imageFile);

            console.log(formData)

            if (user && user.user.role === "ADMIN") {
            axios
                .post(
                `${process.env.REACT_APP_BASE_URL}/api/artikel/${data.id}`,formData,
                {
                    headers: { Authorization: `Bearer ${user.token.value}` },
                }
                )
                .then((response) => {
                messageApi.open({
                    type: "success",
                    content: "Data berhasil tersimpan",
                });
                setTimeout(() => {
                    onCancel();
                    setValueContent('');
                    window.location.reload()
                    fetch();
                }, 1000);
                })
                .catch((err) => {
                console.log(err);
                messageApi.open({
                    type: "error",
                    content: "Data gagal tersimpan",
                });
                setTimeout(() => {
                    onCancel();
                }, 1000);
                });
            }
        }

      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }
  const kategoris = [
    {
      nama : "Stungting",
      value : "Stungting"
    },
    {
      nama : "Ibu",
      value : "Ibu"
    },
    {
      nama : "Anak",
      value : "Anak"
    },
    {
      nama : "Asuransi",
      value : "Asuransi"
    }
  ];

  return (
    <>
      {contextHolder}
      {data && (
        <Modal
          open={isOpen}
          onCancel={onCancel}
          title="Update Data Anak"
          footer={[
            <button
              key="back"
              type="button"
              onClick={onCancel}
              className="batal_btn"
            >
              Batal
            </button>,
            <button
              key="submit"
              type="submit"
              onClick={onOK}
              className="simpan_btn"
            >
              Simpan
            </button>,
          ]}
        >
          <Row>
            <Col span={24}>
              <Form form={form} name="form_update_data_anak" layout="vertical">
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
                  <Select listHeight={100} optionFilterProp="children" showSearch placeholder="Pilih Kategori">
                    {kategoris.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.nama}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

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
                  <Input placeholder="Masukkan judul"/>
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
                      className="flex flex-col justify-center items-center w-full h-64 bg-white rounded-lg border-2 border-dashed cursor-pointer dark:hover:bg-bray-800" style={{borderColor: "#FFB4B4"}}
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
                          <p className="mb-2 text-sm dark:text-gray-400" style={{color: "#b41318"}}>
                            <span className="font-semibold">
                              Click to upload
                            </span>{' '}
                              or drag and drop
                            </p>
                            <p className="text-xs" style={{color: "#b41318"}}>
                              Unggah Cover Digital
                            </p>
                        </div>
                    )}
                    <input
                      id="import_pelanggan"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      style={{color: "#b41318"}}
                        onChange={(e) => {
                          setImageFile(e.target.files[0]);
                        }}
                    />
                  </label>
                </div>
                </Form.Item>
                <Form.Item
                  style={{ Width: "100%" }}
                  label="Paragraf"
                  name="kontent"
                >
                </Form.Item>
                <ReactQuill theme="snow" value={valueContent} onChange={setValueContent} />;
              </Form>
            </Col>
          </Row>
        </Modal>
      )}
    </>
  );
}
