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
import { formatDate2 } from '../../utilities/Format';




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
  const [dataArtikel, setDataArtikel] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataAnak, setDataAnak] = useState(null);

  useEffect(() => {

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/artikel`,
      {
          headers: { Authorization: `Bearer ${user.token.value}` },
      })
      
      .then((response) => {
        setDataArtikel(response.data.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
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

  console.log(dataArtikel)

  return (
    <>
      <Navbar isLogin />
      {
        dataArtikel && 
            <div className="container">
              <div className="row pl-32 pr-32 py-5">
                <div className="col-md-18">
                  <h1 className='text-3xl'>{dataArtikel[0].judul}</h1>
                  <p className='text-gray-400'>{dataArtikel[0].penulis} {' / '} {formatDate2(dataArtikel[0].updated_at)}</p>
                  <img src={'https://api.gizibalita.com/img/' + dataArtikel[0].image} alt={dataArtikel[0].judul}  className=' max-w-full'/>
                  {/* <code className='mt-8'>
                    {dataArtikel[0].content}
                  </code> */}
                  <div dangerouslySetInnerHTML={{ __html: dataArtikel[0].content }} className='mt-8' />
                </div>
              </div>
            </div>
      }
      
    </>
  );
}
