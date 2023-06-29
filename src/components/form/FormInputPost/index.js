import { Col, Form, Input, message, Modal, Row } from "antd";
import axios from "axios";
import React, { useState } from "react";

export default function FormInputPost(props) {
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);
  const { isOpen, onCancel, fetch } = props;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  function onOK() {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();

        axios
          .post(`${process.env.REACT_APP_BASE_URL}/api/post`, {
            user_id: user.user.id,
            title: values.judul,
            content: values.pertanyaan,
          })
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
        title="Input Pertanyaan"
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
            <Form form={form} name="form_input_data_anak" layout="vertical">
              <Form.Item
                label="Judul"
                name="judul"
                rules={[
                  {
                    required: true,
                    message: "Judul masih kosong!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Pertanyaan" name="pertanyaan">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
