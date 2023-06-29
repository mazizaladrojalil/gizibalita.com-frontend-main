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
import moment from "moment";
import React, { useEffect, useState } from "react";
import './formUpdateData_style.css';

export default function FormUpdateDataAnak(props) {
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);
  const { isOpen, onCancel, fetch, data } = props;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataOrangTua, setDataOrangTua] = useState([]);

  useEffect(() => {
    if (user.user.role !== "ORANG_TUA") {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/posyandu/orang-tua`, {
          headers: { Authorization: `Bearer ${user.token.value}` },
        })
        .then((response) => {
          setDataOrangTua(response.data.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        nama: data.nama,
        panggilan: data.panggilan,
        jenisKelamin: data.gender,
        tanggalLahir: moment(data.tanggal_lahir),
        alamat: data.alamat,
        orangTua: data.id_orang_tua,
      });
    }
  }, [form, data]);

  function onOK() {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();

        if (user && user.user.role === "KADER_POSYANDU") {
          axios
            .put(
              `${process.env.REACT_APP_BASE_URL}/api/posyandu/data-anak/${data.id}`,
              {
                nama: values.nama,
                panggilan: values.panggilan,
                tanggal_lahir: moment(values.tanggalLahir).format("YYYY-MM-DD"),
                gender: values.jenisKelamin,
                alamat: values.alamat,
                id_orang_tua: values.orangTua,
              },
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

        if (user && user.user.role === "ORANG_TUA") {
          axios
            .put(
              `${process.env.REACT_APP_BASE_URL}/api/orang-tua/data-anak/${data.id}`,
              {
                nama: values.nama,
                panggilan: values.panggilan,
                tanggal_lahir: moment(values.tanggalLahir).format("YYYY-MM-DD"),
                gender: values.jenisKelamin,
                alamat: values.alamat,
              },
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
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

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
              className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-md px-3 py-2 text-center mr-6 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            >
              Batal
            </button>,
            <button
              key="submit"
              type="submit"
              onClick={onOK}
              className="simpant_btn"
            >
              Simpan
            </button>,
          ]}
        >
          <Row>
            <Col span={24}>
              <Form form={form} name="form_update_data_anak" layout="vertical">
                <Form.Item
                  label="Nama"
                  name="nama"
                  rules={[
                    {
                      required: true,
                      message: "Nama masih kosong!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Panggilan"
                  name="panggilan"
                  rules={[
                    {
                      required: true,
                      message: "Panggilan masih kosong!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Jenis Kelamin"
                  name="jenisKelamin"
                  rules={[
                    {
                      required: true,
                      message: "Jenis Kelamin masih kosong!",
                    },
                  ]}
                >
                  <Select>
                    <Select.Option value={"LAKI_LAKI"}>Laki-Laki</Select.Option>
                    <Select.Option value={"PEREMPUAN"}>Perempuan</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Tanggal Lahir"
                  name="tanggalLahir"
                  rules={[
                    {
                      required: true,
                      message: "Tanggal Lahir masih kosong!",
                    },
                  ]}
                >
                  <DatePicker />
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
                {user.user.role !== "ORANG_TUA" && (
                  <Form.Item
                    label="Orang Tua"
                    name="orangTua"
                    rules={[
                      {
                        required: true,
                        message: "Orang Tua masih kosong!",
                      },
                    ]}
                  >
                    <Select>
                      {dataOrangTua &&
                        dataOrangTua.map((data) => (
                          <Select.Option key={data.id} value={data.id}>
                            {data.nama}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                )}
              </Form>
            </Col>
          </Row>
        </Modal>
      )}
    </>
  );
}
