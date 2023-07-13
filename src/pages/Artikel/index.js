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
import { formatDate2, limitWords } from '../../utilities/Format';




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
  const [dataSorted, setDataSorted] = useState([]);
  const [dataKategori, setDataKategori] = useState([]);

  useEffect(() => {
    function fetchDataAnak() {

      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/artikel`, {
          headers: { Authorization: `Bearer ${user.token.value}` },
        })
        .then((response) => {
          setData(response.data.data);
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

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/artikel`,
        {
          headers: { Authorization: `Bearer ${user.token.value}` },
        })

      .then((response) => {
        const sortedData = response.data.data;
        setData(sortedData);
        setDataSorted(sortedData[sortedData.length - 1]);
        // setDataSorted(sortedData[0]);
        setIsLoading(false);
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
        setDataKategori(response.data.data)
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  console.log(dataSorted)
  console.log(dataKategori)
  console.log(data)
  return (
    <>
      <Navbar isLogin />
      {
        dataSorted &&

        // return <div className="container">tidak adas</div>;
        <div className="container">
          <div className="row pl-32 pr-32 py-5" key={dataSorted.id}>
            <div className="col-md-18 justify-self-auto">
              <h1 className='text-3xl'>{dataSorted.judul}</h1>
              <p className='text-gray-400'>{dataSorted.penulis} {' / '} {formatDate2(dataSorted.updated_at)}</p>
              <img src={'https://api.gizibalita.com/img/' + dataSorted.image} className='max-w-full' />

              <div className="grid grid-cols-4 gap-4">
                <div className='col-span-3'>
                  <div dangerouslySetInnerHTML={{ __html: dataSorted.content }} className='mt-4' />
                </div>
                <div class="flex my-4 space-x-6">
                  <div class="h-full border-r-2 border-gray-300"></div>
                  <div>
                    <div className='flex flex-row'>
                      <div class="h-4 border-r-2 border-red-500 mr-2"></div>
                      <h1>Berita Lainnya</h1>
                    </div>
                    {
                      dataKategori.map((kategoris) => {
                        const dataNextArtikel = data.filter(data => data.kategori === kategoris.name);
                        console.log(dataNextArtikel)
                        return (
                          <div>
                            <div className='mt-4 flex' key={kategoris.id}>
                              <hr class="w-8 border-t-4" style={{ marginTop: "9px", marginRight: "5px", color: "red" }}></hr>
                              <h1 style={{ fontSize: "16px", textTransform: "uppercase" }}>{kategoris.name}</h1>
                            </div>
                            {

                              dataNextArtikel.map((dataNextArtikel, index) => (
                                <div key={index}>
                                  <h1 style={{ fontSize: "14px", marginTop: "10px" }}>{dataNextArtikel.judul}</h1>
                                  <a onClick={(e) => {
                                    e.preventDefault();
                                    setDataSorted(dataNextArtikel);
                                  }}>
                                    <div className='justify-normal' dangerouslySetInnerHTML={{ __html: limitWords(dataNextArtikel.content, 15) }} />
                                  </a>
                                </div>
                              ))
                            }

                          </div>
                        )
                      })
                    }
                    {/* {
                              data.map((data) => (
                                <div >
                                  <h1 style={{fontSize: "14px", marginTop: "10px"}}>{data.judul}</h1>
                                  <div dangerouslySetInnerHTML={{ __html: limitWords(data.content, 20) }} />
                                </div>
                              ))
                            } */}

                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>

      }

    </>
  );
}
