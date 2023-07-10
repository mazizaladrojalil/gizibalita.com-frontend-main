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

export default function FormInputDataExcel(props) {
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);
  const { isOpen, onCancel, fetch } = props;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [excelFile, setExcelFile] = useState(null);

  function onOK() {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        console.log(values);
        console.log(excelFile);

        if (user && user.user.role === "KADER_POSYANDU") {
          axios
            .post(
              `${process.env.REACT_APP_BASE_URL}/api/posyandu/data-anak-excel`, excelFile,
              {
                headers: { 
                    Authorization: `Bearer ${user.token.value}`,
                    'Content-Type': 'multipart/form',
                },
              }
            )
            .then((response) => {
              messageApi.open({
                type: "success",
                content: "Data berhasil diupload",
              });
              setTimeout(() => {
                onCancel();
                fetch();
              }, 2000);
            })
            .catch((err) => {
              console.log(err);
              messageApi.open({
                type: "error",
                content: "Data gagal diupload",
              });
              setTimeout(() => {
                onCancel();
              }, 20000);
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
      <Modal
        open={isOpen}
        onCancel={onCancel}
        title="Upload Data Excel"
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
            Upload
          </button>,
        ]}
      >
        <Row>
          <Col span={24}>
            <Form form={form} name="form_input_data_anak" layout="vertical">
              <Form.Item
                label="File"
                name="file"
                rules={[
                  {
                    required: true,
                    message: "File masih kosong!",
                  },
                ]}
              >
                {/* <input
                    type="file"
                    onChange={(e) => {
                        setExcelFile(e.target.files[0]);
                    }}
                /> */}
                <Input type="file" accept=".xlsx, .csv, .xls" onChange={
                    (e) => {
                        setExcelFile(e.target.files[0]);
                    }
                }/>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
