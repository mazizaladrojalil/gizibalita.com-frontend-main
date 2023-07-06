import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import '../Dashboard/dashboard-style.css';
import bg_dashboard from "../../assets/img/bg-dashboard.svg";
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import headline_news from "../../assets/img/headline-artikel.png";




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

export default function Artikel() {
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

      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/artikel`, {
          headers: { Authorization: `Bearer ${user.token.value}` },
        })
        .then((response) => {
          // const sortedData = response.data.data.sort((a, b) =>
          //   b.created_at.localeCompare(a.created_at)
          // );
          const sortedData = response.data.data;
          console.log(sortedData);
          setData(sortedData);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });

    }

    fetchDataAnak();
    // eslint-disable-next-line
  }, [refreshKey]);



  return (
    <>
      <Navbar isLogin />
      <Container fluid style={{ padding: "20px", marginTop: "50px" }}>
        <Row>
          <Col sm="12" className="d-flex justify-content-center">
            <h2 style={{ width: "1200px", fontWeight: "bold" }}>
              Geramnya Jokowi, Anggaran Stunting Rp 10 Miliar, Dipakai Rapat dan Perjalanan Dinas Rp 6 M
            </h2>

          </Col>
          <Col sm="12" className="d-flex justify-content-center">
            <Image style={{ width: "1200px" }} src={headline_news} thumbnail />
          </Col>
        </Row>
      </Container>
      <Container fluid style={{ padding: "20px" }} className="d-flex justify-content-center">
        <Col sm="6" className="d-flex justify-content-end" style={{ width: "600px" }}>
          <p>
            Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
            Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate nisi. Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh. Mauris sit amet magna non ligula vestibulum eleifend. Nulla varius volutpat turpis sed lacinia. Nam eget mi in purus lobortis eleifend. Sed nec ante dictum sem condimentum ullamcorper quis venenatis nisi. Proin vitae facilisis nisi, ac posuere leo.
            Nam pulvinar blandit velit, id condimentum diam faucibus at. Aliquam lacus nisi, sollicitudin at nisi nec, fermentum congue felis. Quisque mauris dolor, fringilla sed tincidunt ac, finibus non odio. Sed vitae mauris nec ante pretium finibus. Donec nisl neque, pharetra ac elit eu, faucibus aliquam ligula. Nullam dictum, tellus tincidunt tempor laoreet, nibh elit sollicitudin felis, eget feugiat sapien diam nec nisl. Aenean gravida turpis nisi, consequat dictum risus dapibus a. Duis felis ante, varius in neque eu, tempor suscipit sem. Maecenas ullamcorper gravida sem sit amet cursus. Etiam pulvinar purus vitae justo pharetra consequat. Mauris id mi ut arcu feugiat maximus. Mauris consequat tellus id tempus aliquet.
            Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
            Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate nisi. Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh. Mauris sit amet magna non ligula vestibulum eleifend. Nulla varius volutpat turpis sed lacinia. Nam eget mi in purus lobortis eleifend. Sed nec ante dictum sem condimentum ullamcorper quis venenatis nisi. Proin vitae facilisis nisi, ac posuere leo.
          </p>
        </Col>
        <Col sm="6" className="d-flex justify-content-end" style={{ width: "600px", paddingLeft: "40px" }}>
          <Row>
            {/* <Col sm="6">
                            <svg width="2" height="19" viewBox="0 0 2 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 18L1 1" stroke="#F53232" stroke-width="2" stroke-linecap="round" />
                            </svg>
                        </Col> */}
            <Col sm="2" className="d-flex justify-content-end">
              <div style={{ height: "20px", borderLeft: "4px solid #F53232", marginRight: "-340px" }}></div>
            </Col>
            <Col sm="10" className="d-flex justify-content-end">
              <h5 style={{ width: "190px", marginRight: "-50px" }} >Berita lainnya</h5>
            </Col>
            {
              data.map((item) => {
                return (
                  <><Col sm="12" className="d-flex justify-content-end">
                    <Card style={{ width: '18rem', marginBottom: "20px"}}>
                      <Card.Body>
                        <Card.Title>{item.judul}</Card.Title>
                        {console.log(item)}
                        <Card.Text>
                          {item.penulis}
                        </Card.Text>
                        <Card.Link href={item.link}>Baca selengkapnya</Card.Link>
                      </Card.Body>
                    </Card>
                  </Col></>
                )
              }
              )
            }
          </Row>
        </Col>
      </Container>
    </>
  );
}
