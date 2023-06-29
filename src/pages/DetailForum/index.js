import { Col, Divider, Form, Input, Row, Spin } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Navigation from "../../components/layout/Navigation";
import avatar from "../../assets/icon/user.png";
import "./forum-style.css";
import footerImage from "../../assets/img/powered_by_telkom.svg";

export default function DetailForum() {
  let { id } = useParams();
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [detailPost, setDetailPost] = useState({});
  const [comment, setComment] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/post/${id}`)
      .then((response) => {
        setIsLoading(false);
        setDetailPost(response.data.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/comment/${id}`)
      .then((response) => {
        setIsLoading(false);
        const sortedData = response.data.data.sort((a, b) =>
          b.time.localeCompare(a.time)
        );
        setComment(sortedData);
      })
      .catch((err) => {
        setIsLoading(false);
      });
    // eslint-disable-next-line
  }, [refreshKey]);

  const onFinish = (values) => {
    const data = {
      user_id: user.user.id,
      post_id: id,
      content: values.comment,
    };
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/comment`, data)
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1);
        form.resetFields();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (values) => {
    console.log(values);
  };

  return (
    <>
      <Navbar isLogin />
      <Row>
        <Col>
          <Spin size="large" spinning={isLoading} />
        </Col>
        {!isLoading && (
          <Col span={24}>
            <div style={{ margin: "20px", padding: "20px", width: "max-fit-content", borderRadius: "20px" }}>
              <div className="flex items-start px-4 py-6">

                <div className="">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 -mt-1">
                      {detailPost.title}
                    </h2>
                    <small className="text-sm text-gray-700">
                      {moment(detailPost.time).format("DD MMMM YYYY")}
                    </small>
                  </div>
                  <p className="text-gray-800">
                    {detailPost.nama} (
                    <span className="text-blue-600">
                      {detailPost.role === "ORANG_TUA"
                        ? "orang tua"
                        : "tenaga kesehatan"}
                    </span>
                    )
                  </p>
                  <p className="mt-3 text-gray-700 text-sm">
                    {detailPost.content}
                  </p>
                </div>
              </div>
            </div>
          </Col>
        )}

        <Col span={24}>
          <div style={{ margin: "20px", padding: "20px" }}>
            <Form
              form={form}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="horizontal"
            >
              <Form.Item
                label="Comment"
                name="comment"
                rules={[
                  {
                    required: true,
                    message: "comment masih kosong!",
                  },
                ]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item>
                <button
                  type="submit"
                  className="simpan_btn"
                >
                  Kirim
                </button>
              </Form.Item>
            </Form>
          </div>

          <Divider />
          <Row justify={"center"}>
            {comment.map((item) => {
              return (
                <Col span={6}
                  key={item}
                  style={{ margin: "20px", padding: "20px", width: "500px", borderRadius: "20px" }}
                  className="flex bg-gray-100 shadow-lg rounded-lg"
                >
                  <div className="flex items-start px-4 py-6">

                    <div className="w-20">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium text-gray-700 mt-1">
                          {item.nama}
                        </h2>
                        <small className="text-xs text-gray-700">
                          {moment(item.time).format("DD MMMM YYYY")}
                        </small>
                      </div>
                      <p className="text-gray-800">
                        <span className="text-blue-600">
                          {item.role === "ORANG_TUA"
                            ? "orang tua"
                            : "tenaga kesehatan"}
                        </span>
                      </p>
                      <Divider />
                      <p className="mt-3 text-gray-700 text-sm">{item.content}</p>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>

        </Col>
      </Row>
    </>
  );
}
