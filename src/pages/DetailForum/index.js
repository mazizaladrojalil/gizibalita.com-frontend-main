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
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';


export default function DetailForum() {

  const convertToGoodString = (str) => {
    // Remove underscores and split the string into an array of words
    const words = str.split('_');

    // Capitalize the first letter of each word and convert the rest to lowercase
    const capitalizedWords = words.map((word) => {
      const firstLetter = word.charAt(0).toUpperCase();
      const restOfWord = word.slice(1).toLowerCase();
      return firstLetter + restOfWord;
    });

    // Join the words back together with spaces
    const goodString = capitalizedWords.join(' ');

    return goodString;
  };

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
  const lastItem = comment.slice(-1)[0];
  // const roleLastComment = convertToGoodString(lastItem.role);

  return (
    <>
      <Navbar isLogin />
      <Row>
        <Col sm={24}>
          <Spin size="large" spinning={isLoading} />
        </Col>
        {!isLoading && (
          <Col sm={24} style={{ display: "flex", justifyContent: "center" }}>
            <Container className="shadow-lg" style={{ backgroundColor: "#FCDEDE",marginTop:"50px", marginRight: "50px", width: "1500px", borderRadius: "30px" }}>
              <div style={{ margin: "20px", padding: "20px", width: "max-fit-content", borderRadius: "20px" }}>
                <div className="flex items-start px-4 py-6">
                  <div className="card-form-question" style={{ width: "1000px", fontSize: "16px" }}>
                    <div className="flex items-center justify-between" >
                      <h2 className="font-semibold text-gray-900 -mt-1" style={{ fontSize: "30px" }}>
                        {detailPost.title} - {moment(detailPost.time).format("DD MMMM YYYY")}
                      </h2>
                    </div>
                    <p className="text-gray-800">
                      {detailPost.nama} -  
                      <span className="text-red-600"> 
                        {detailPost.role === "ORANG_TUA"
                          ? " orang tua"
                          : " tenaga kesehatan"}
                      </span>
                      
                    </p>
                    <p className="mt-3 text-gray-700 text-sm">
                      {detailPost.content}
                    </p>
                    {/* <div style={{ height: "1px", backgroundColor: "black", margin: "10px 0 10px 0" }}></div>
                    <h2>
                      
                      {console.log(comment.slice(-1)[0])}
                      <p style={{fontWeight:"normal"}}>Terakhir dibalas oleh {(comment.slice(-1)[0]).nama} - {(comment.slice(-1)[0]).role}</p>
                    </h2> */}
                  </div>
                </div>
              </div>
            </Container>
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
              <Container className="shadow-lg" fluid style={{ width:"1200px",backgroundColor: "transparent", padding: "20px", border: "2px solid", borderColor: "#FCDEDE", borderRadius: "20px" }}>
                <Col sm={24}>
                  <Form.Item
                    label="Comment"
                    name="comment"
                    rules={[
                      {
                        required: true,
                        message: "comment masih kosong!",
                      },
                    ]}
                    labelCol={{ style: { fontSize: '25px' } }}
                  >
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Col>
                <Form.Item>
                <button
                  type="submit"
                  className="button_kirim"
                >
                  Kirim
                </button>
              </Form.Item>


              </Container>

              
            </Form>
          </div>

          <Divider />
          <Row justify={"center"}>
            {comment.map((item) => {
              return (
                <Col span={12}
                  key={item}
                  style={{ margin: "30px", padding: "20px", width: "1000px", borderRadius: "20px", backgroundColor: "#FCDEDE" }}
                  className="flex shadow-lg rounded-lg"
                >
                  <div className="flex items-start px-4 py-6">
                    <div className="w-100" >
                      <div className="flex items-center justify-between" >
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
