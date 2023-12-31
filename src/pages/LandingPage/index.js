import React from "react";
import landingPageImage from "../../assets/img/baby-banner.svg";
import video from "../../assets/video/video_testing.mp4";
import "./landingPage.css";
import NavbarComp from "../../components/layout/Navbar";
import bannerImage from "../../assets/img/banner_item.svg";
import footerImage from "../../assets/img/powered_by_telkom.svg";

import { Col, Container, Row } from 'react-bootstrap';
import background from '../SignIn/login_bg.svg';
import { Link } from "react-router-dom";





const BannerBackground = () => {
  const backgroundStyles = {
    backgroundImage: `url(${landingPageImage})`,
    position: "absolute",
    width: "600px",
    height: "629px",
    left: "940px",
    top: "150px",
    zIndex: -1
  }


  return <div style={backgroundStyles} />;
}

const BackgroundComponent = () => {
  const backgroundStyles = {
    position: "absolute",
    top: 50,
    left: 0,
    width: "100%",
    height: '100%',
    zIndex: -10000,
    background: `url(${background}) no-repeat center`,
    backgroundSize: '100vw auto',
  };
  return <div style={backgroundStyles} />;
};



export default function LandingPage() {
  return (
    <>
      <BackgroundComponent />
      <NavbarComp />
      {/* <div className="full-screen-container">

        <Row
          className="container"
          justify="center"
          align="middle"
          style={{ backgroundColor: "#f5f5f5", height: "100%"}}
        >
          <Col span={8}>
            <Row justify="start">
              <div className="title-banner">
                Track your child&apos;s growth anywhere, anytime
              </div>
              <div className="description-banner">
                Keep track of children&apos;s growth and development using GiziBalita
              </div>
              <button
                type="button"
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              >
                <a className="hover:text-white" href="/sign-in">
                  Get Started
                </a>
              </button>
            </Row>
          </Col>
          <Col span={10}>
            <Row justify="end">
              <img src={landingPageImage} width={450} height={450} alt="" />
            </Row>
          </Col>
        </Row>
      </div> */}
      <BannerBackground />
      <Col sm="12" style={{ justifyContent: 'center', display: "flex", width: "100vw", marginTop: "30px" }}>
        <Row
          style={{ backgroundColor: "transparent", width: "1600px", alignItems: "center", display: "flex" }}>
          <Col>
            <Row className="banner" style={{ alignContent: "start", justifyContent: "start", display: "flex" }}>
              {/* <div className="title-banner">
                TRACK YOUR CHILD&apos;S growth anywhere, anytime
              </div> */}
              <h2>Track Your Child's Growth</h2>
              <h2>Anywhere</h2>
              <h2>Anytime</h2>
              <div className="description-banner">
                Keep track of children&apos;s growth and development using GiziBalita
              </div>
              {/* <button
                type="button"
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              >
                <a className="hover:text-white" href="/sign-in">
                  Get Started
                </a>
              </button> */}
              <Row style={{ width: "300px" }}>
                <Col sm="6">
                  <a href="/sign-in">
                    <button class="button">
                      Login
                    </button>
                  </a>

                </Col>
                <Col sm="6">
                  <a href="/sign-up">
                    <button class="button">
                      Sign Up
                    </button>
                  </a>
                </Col>
              </Row>
            </Row>
          </Col>
          <Col>
          </Col>
        </Row>

      </Col>
      <Col style={{ justifyContent: 'center', display: "flex", width: "100vw" }}>
        <div style={{ height: "500px", backgroundColor: "white", width: "1180px", marginTop: "20px", borderRadius: "40px", filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))", justifyContent: "center", display: "flex" }}>
          <video src={video} loop autoPlay />
        </div>

      </Col>

      <Col style={{ justifyContent: 'center', display: "flex", width: "100vw" }}>
        <img src={bannerImage} style={{ marginTop: "50px" }}></img>
      </Col>

      <Col style={{ justifyContent: 'center', display: "flex", width: "100vw", backgroundColor: "#FFB4B4", marginTop: "100px" }}>
        <img src={footerImage}></img>
      </Col>

    </>
  );
}
