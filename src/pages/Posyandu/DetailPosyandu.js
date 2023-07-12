import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  registerables,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";
import dataBeratBadanByUmurPria from "../../json/ZScoreBeratBadanLakiLaki.json";
import dataBeratBadanByUmurPerempuan from "../../json/ZScoreBeratBadanPerempuan.json";
import dataTinggiBadanByUmurPria from "../../json/ZScorePanjangBadanLakiLaki.json";
import dataTinggiBadanByUmurPerempuan from "../../json/ZScorePanjangBadanPerempuan.json";
import dataLingkarKepalaByUmurPria from "../../json/ZScoreLingkarKepalaLakiLaki.json";
import dataLingkarKepalaByUmurPerempuan from "../../json/ZScoreLingkarKepalaPerempuan.json";
import Navbar from "../../components/layout/Navbar";
import { Col, Modal, Row, Space, message } from "antd";
import FormInputPerkembanganAnak from "../../components/form/FormInputPerkembanganAnak";
import { useParams } from "react-router-dom";
import axios from "axios";
import { monthDiff } from "../../utilities/calculateMonth";
import FormUpdatePerkembanganAnak from "../../components/form/FormUpdatePerkembanganAnak";
import Navigation from "../../components/layout/Navigation";
import Image from 'react-bootstrap/Image';
import bayi from "../../assets/img/bayi_1.png";
import "../Detail/detail-style.css";
import { AlignCenterOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import bg_dashboard from "../../assets/img/bg-dashboard.svg";
import footerImage from "../../assets/img/powered_by_telkom.svg";
import Table from "../../components/layout/Table";
import FormDetailPerkembanganAnak from "../../components/form/FormDetailDataPerkembanganAnak";
// import { placementColumn } from "../../utilities/columnMonth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ...registerables
);

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

export default function DetailPosyandu() {
  let { id } = useParams();
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);
  const [
    isOpenModalInputPerkembanganAnak,
    setIsOpenModalInputPerkembanganAnak,
  ] = useState(false);
  const [data, setData] = useState([]);
  const [dataAnak, setDataAnak] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [
    isOpenModalDetailPerkembanganAnak,
    setIsOpenModalDetailPerkembanganAnak,
  ] = useState(false);
  const [
    isOpenModalUpdatePerkembanganAnak,
    setIsOpenModalUpdatePerkembanganAnak,
  ] = useState(false);
  const [dataPerkembanganAnakDetail, setDataPerkembanganAnakDetail] = useState(null);
  const [dataPerkembanganAnak, setDataPerkembanganAnak] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  // const columnYAxis = Array(61).fill(null);
  // const columnYAxisBerat = placementColumn(
  //   columnYAxis,
  //   data,
  //   dataAnak,
  //   "berat"
  // );
  // const columnYAxisTinggi = placementColumn(
  //   columnYAxis,
  //   data,
  //   dataAnak,
  //   "tinggi"
  // );
  // const columnYAxisLingkarKepala = placementColumn(
  //   columnYAxis,
  //   data,
  //   dataAnak,
  //   "lingkar_kepala"
  // );

  // const labels = Array.from(Array(61).keys());

  const labels = Array.from(Array(61).keys());
  function datasetChart(type) {
    const dataset = [];
    for (let i = 0; i < data.length; i++) {
      if (
        monthDiff(moment(dataAnak.tanggal_lahir), moment(data[i].date)) * -1 ===
        monthDiff(moment(dataAnak.tanggal_lahir), moment(data[i].date))
      ) {
        dataset.push(
          monthDiff(moment(dataAnak.tanggal_lahir), moment(data[i].date)) * -1
        );
      } else {
        dataset.push(
          monthDiff(moment(dataAnak.tanggal_lahir), moment(data[i].date))
        );
      }
    }

    if (type === "berat") {
      // buatlah 60 array dari bulan "dataset"
      const result = [];
      let j = 0;
      for (let i = 0; i < 61; i++) {
        // kemudian dari "dataset" difilter yang ada value nya di ganti dengan value berat badan
        if (dataset.includes(i) && j < data.length) {
          result.push(Number(data[j].berat));
          j++;
        } else {
          result.push(null);
        }
      }
      return result;
    } else if (type === "tinggi") {
      // buatlah 60 array dari bulan "dataset"
      const result = [];
      let j = 0;
      for (let i = 0; i < 61; i++) {
        // kemudian dari "dataset" difilter yang ada value nya di ganti dengan value tinggi badan
        if (dataset.includes(i) && j < data.length) {
          result.push(Number(data[j].tinggi));
          j++;
        } else {
          result.push(null);
        }
      }
      return result;
    } else if (type === "lingkar_kepala") {
      // buatlah 60 array dari bulan "dataset"
      const result = [];
      let j = 0;
      for (let i = 0; i < 61; i++) {
        // kemudian dari "dataset" difilter yang ada value nya di ganti dengan value lingkar_kepala badan
        if (dataset.includes(i) && j < data.length) {
          result.push(Number(data[j].lingkar_kepala));
          j++;
        } else {
          result.push(null);
        }
      }
      return result;
    }
  }


  const dataChartPriaBB = {
    labels: labels,
    datasets: [
      {
        // data: data.map((data) => data.berat),
        data: datasetChart("berat"),
        pointBackgroundColor: "black",
        borderColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
        type: "line",
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
        type: "line",
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
        type: "line",
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
      {
        data: dataBeratBadanByUmurPria.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
        type: "line",
      },
    ],
  };

  const dataChartPerempuanBB = {
    labels: labels,
    datasets: [
      {
        // data: data.map((data) => data.berat),
        data: datasetChart("berat"),
        pointBackgroundColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataBeratBadanByUmurPerempuan.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
    ],
  };

  const dataChartPriaTB = {
    labels: labels,
    datasets: [
      {
        // data: data.map((data) => data.tinggi),
        data: datasetChart("tinggi"),
        pointBackgroundColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPria.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
    ],
  };

  const dataChartPerempuanTB = {
    labels: labels,
    datasets: [
      {
        // data: data.map((data) => data.tinggi),
        data: datasetChart("tinggi"),
        pointBackgroundColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataTinggiBadanByUmurPerempuan.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
    ],
  };

  const dataChartPriaLK = {
    labels: labels,
    datasets: [
      {
        // data: data.map((data) => data.lingkar_kepala),
        data: datasetChart("lingkar_kepala"),
        pointBackgroundColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPria.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
    ],
  };

  const dataChartPerempuanLK = {
    labels: labels,
    datasets: [
      {
        // data: data.map((data) => data.lingkar_kepala),
        data: datasetChart("lingkar_kepala"),
        pointBackgroundColor: "black",
        type: "scatter",
        showLine: false,
        pointRadius: 5,
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.SD3neg),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.SD2neg),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.SD1neg),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.median),
        borderColor: "rgb(154, 255, 136)",
        backgroundColor: "rgba(0, 255, 30, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.SD1pos),
        borderColor: "rgb(234, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.SD2pos),
        borderColor: "rgb(255, 137, 163)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
      {
        data: dataLingkarKepalaByUmurPerempuan.map((data) => data.SD3pos),
        borderColor: "rgb(255, 0, 55)",
        backgroundColor: "rgba(255, 0, 55, 0.5)",
      },
    ],
  };

  const optionsBB = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Berat Badan (kg)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Umur (Bulan)",
        }, // Maximum value for the x-axis
      },
    },
    elements: {
      point: {
        radius: 0,
        pointStyle: "circle",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      title: {
        display: true,
        text: "Berat Badan berdasarkan Umur",
      },
    },
  };

  const optionsTB = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Tinggi Badan (cm)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Umur (Bulan)",
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        pointStyle: "circle",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      title: {
        display: true,
        text: "Tinggi Badan berdasarkan Umur",
      },
    },
  };

  const optionsLK = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Lingkar Kepala (cm)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Umur (Bulan)",
        },
        min: 0,
        max: 60,
      },
    },
    elements: {
      point: {
        radius: 0,
        pointStyle: "circle",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      title: {
        display: true,
        text: "Lingkar Kepala berdasarkan Umur",
      },
    },
  };

  useEffect(() => {
    function fetchDataPerkembanganAnak() {
      if (user.user.role !== "ORANG_TUA") {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/api/posyandu/statistik-anak/${id}`,
            {
              headers: { Authorization: `Bearer ${user.token.value}` },
            }
          )
          .then((response) => {
            const sortedData = response.data.data.sort((a, b) =>
              a.date.localeCompare(b.date)
            );

            setData(sortedData);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
          });
      } else {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/api/orang-tua/statistik-anak/${id}`,
            {
              headers: { Authorization: `Bearer ${user.token.value}` },
            }
          )
          .then((response) => {
            const sortedData = response.data.data.sort((a, b) =>
              a.date.localeCompare(b.date)
            );
            // const sortedData = data.sort((a, b) => {
            //   let da = new Date(a.date),
            //     db = new Date(b.date);
            //   return db - da;
            // });
            // const sortedTable = data.sort((a, b) => {
            //   let da = new Date(a.date),
            //     db = new Date(b.date);
            //   return da - db;
            // });

            setData(sortedData);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
          });
      }
    }

    fetchDataPerkembanganAnak();

    // eslint-disable-next-line
  }, [refreshKey]);

  useEffect(() => {
    function fetchDataAnakByID() {
      if (user.user.role !== "ORANG_TUA") {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/api/posyandu/data-anak/${id}`,
            {
              headers: { Authorization: `Bearer ${user.token.value}` },
            }
          )
          .then((response) => {
            setDataAnak(response.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/api/orang-tua/data-anak/${id}`,
            {
              headers: { Authorization: `Bearer ${user.token.value}` },
            }
          )
          .then((response) => {
            setDataAnak(response.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    fetchDataAnakByID();
    // eslint-disable-next-line
  }, []);

  function deletePerkembanganAnak(id) {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/posyandu/statistik-anak/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token.value}` },
        }
      )
      .then((response) => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const columns = useMemo(() => {
    return [
      {
        Header: 'Tanggal Pengukuran',
        accessor: 'tanggalPengukuran',
        Cell: ({ row }) => {
          const date = row.original.date;
          return (
            <span>
              {moment(date).format("DD MMMM YYYY")}
            </span>
          );
        },
      },
      {
        Header: "Umur",
        accessor: "date",
        Cell: ({ value, row }) => {
          const tglPengukuran = row.original.date;
          return (
            <span>
              {`${monthDiff(
                moment(dataAnak.tanggal_lahir),
                moment(tglPengukuran)
              )} Bulan`}
            </span>
          );
        }
      },
      {
        Header: "Berat Badan",
        accessor: "berat",
        Cell: ({ value }) => {
          return (
            <span>
              {value} kg
            </span>
            );
          }
      },
      {
        Header: "Status - BB/U",
        accessor: "statusBB",
        Cell: ({ row }) => {
          const statusBB = row.original.statistik.berat;
          return (
            <span>
              {statusBB}
            </span>
            );
          }
      },
      {
        Header: "Tinggi Badan",
        accessor: "tinggi",
        Cell: ({ value }) => {
          return (
              <span>
                {value} cm
              </span>
          );
        }
      },
      {
        Header: "Status - TB/U",
        accessor: "statusTB",
        Cell: ({ row }) => {
          const statusBB = row.original.statistik.tinggi;
          return (
            <span>
              {statusBB}
            </span>
          );
        }
      },
      {
        Header: "Lingkar Kepala",
        accessor: "lingkar_kepala",
        Cell: ({ value }) => {
          return (
              <span>
                {value} cm
              </span>
          );
        }
      },
      {
        Header: "Status - LK/U",
        accessor: "statusLK",
        Cell: ({ row }) => {
          const statusBB = row.original.statistik.lingkar_kepala;
          return (
            <span>
              {statusBB}
            </span>
          );
        }
      },
      {
        Header: "Status - Gizi",
        accessor: "statusGizi",
        Cell: ({ row }) => {
          const statusBB = row.original.statistik.gizi;
          return (
            <span>
              {statusBB}
            </span>
          );
        }
      },
      {
        Header: "",
        accessor: "aksi",
        Cell: ({ row }) => {
          const id = row.original.id;
          const dataAksi = row.original;
          return (
            <>
              <div style={{justifyContent:"space-between", display:"flex"}}>
                {/* </Link> */}
               
                <button 
                  type="button" 
                  class="buttonUpdate"
                  onClick={() => {
                    setDataPerkembanganAnak(dataAksi);
                    setIsOpenModalUpdatePerkembanganAnak(true);
                  }}
                >
                  Update
                </button>
                <button 
                  class="buttonDelete"
                  onClick={() => {
                    Modal.confirm({
                      title: "Apakah anda yakin?",
                      icon: <ExclamationCircleOutlined />,
                      content: "Data yang dihapus tidak dapat dikembalikan",
                      okText: "Ya",
                      cancelText: "Tidak",
                      onOk: () => {
                        axios
                          .delete(
                            `${process.env.REACT_APP_BASE_URL}/api/posyandu/statistik-anak/${id}`,
                            {
                              headers: {
                                Authorization: `Bearer ${user.token.value}`,
                              },
                            }
                          )
                          .then((response) => {
                            messageApi.open({
                              type: "success",
                              content: "Data berhasil dihapus",
                            });
                            setTimeout(() => {
                              setRefreshKey((oldKey) => oldKey + 1);
                              window.location.reload();
                              fetch();
                            }, 1000);
                          })
                          
                          .catch((err) => {
                            console.log(err);
                            messageApi.open({
                              type: "error",
                              content: "Data gagal dihapus",
                          });
                          });
                      },
                    })
                  }}
                >
                  Delete
                </button>
              </div>
            {/* <div className="flex">
              <CustomButton className="bg-orange-500">
                Detail
              </CustomButton>
              <CustomButton className="bg-green-300">
                Update
              </CustomButton>
              <CustomButton className="bg-red-300">
                Delete
              </CustomButton>
            </div> */}
            
            </>
          );
        }
      }
    ];
  }, []);
  const [activeContent, setActiveContent] = useState('Content 1');

  const handleButtonClick = (content) => {
    setActiveContent(content);
  };

  return (
    <>
      {contextHolder}
      <Navbar isLogin />
      <BackgroundComponent />
      <Row style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Col span={24}>
          {/* <button
            onClick={() => setIsOpenModalInputPerkembanganAnak(true)}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-6 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Data Perkembangan Anak +
          </button> */}
          <Row style={{ alignItems: "center", height: "350px" }} justify={"center"} >
            <Col span={12}>
              <h6 className="dashboard">{dataAnak.nama}</h6>
              <h6 className="dashboard" style={{ fontSize: "25px" }}>{`${moment().diff(moment(dataAnak.tanggal_lahir), "month")} Bulan`}</h6>
              
              <div style={{justifyContent:"start", display:"flex"}}>
                <button class="cssbuttons-io-button" onClick={() => setIsOpenModalInputPerkembanganAnak(true)}
                  type="button" style={{ marginBottom: "20px", marginRight: "20px" }}>Tambah
                  <div class="icon">
                    <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M31 7C31 3.41015 28.0899 0.5 24.5 0.5C20.9101 0.5 18 3.41015 18 7V17.75H7.25C3.66015 17.75 0.75 20.6601 0.75 24.25C0.75 27.8398 3.66015 30.75 7.25 30.75H18V41.5C18 45.0899 20.9101 48 24.5 48C28.0899 48 31 45.0899 31 41.5V30.75H41.75C45.3399 30.75 48.25 27.8399 48.25 24.25C48.25 20.6601 45.3399 17.75 41.75 17.75H31V7Z" fill="#FF9999" />
                    </svg>
                  </div>
                </button>
              </div>
             
              
            </Col>
            <Col >
              <Image style={{ width: "150px" }} src={bayi} rounded />
            </Col>
          </Row>




        </Col>

        <Col span={24}>
          {/* <Table columns={columns} dataSource={data} loading={isLoading} /> */}
          <Table
            columns={columns} 
            data={data}
          />
        </Col>

        <Col>
          <button className="button_detail" onClick={() => handleButtonClick('Content 1')}>Berat Badan</button>
          <button className="button_detail" onClick={() => handleButtonClick('Content 2')}>Tinggi badan</button>
          <button className="button_detail" style={{ width: "190px" }} onClick={() => handleButtonClick('Content 3')}>Lingkar kepala</button>
        </Col>

        {activeContent === 'Content 1' && (
          <Col className="mt-8 border-2 p-4 border-black" span={24}>
            <Line
              data={
                dataAnak.gender === 'LAKI_LAKI'
                  ? dataChartPriaBB
                  : dataChartPerempuanBB
              }
              options={optionsBB}
            />
          </Col>
        )}

        {activeContent === 'Content 2' && (
          <Col className="my-8 border-2 p-4 border-black" span={24}>
            <Line
              data={
                dataAnak.gender === 'LAKI_LAKI'
                  ? dataChartPriaTB
                  : dataChartPerempuanTB
              }
              options={optionsTB}
            />
          </Col>
        )}

        {activeContent === 'Content 3' && (
          <Col className="my-8 border-2 p-4 border-black" span={24}>
            <Line
              data={
                dataAnak.gender === 'LAKI_LAKI'
                  ? dataChartPriaLK
                  : dataChartPerempuanLK
              }
              options={optionsLK}
            />
          </Col>
        )}
      </Row>

      <FormInputPerkembanganAnak
        isOpen={isOpenModalInputPerkembanganAnak}
        onCancel={() => setIsOpenModalInputPerkembanganAnak(false)}
        data={dataAnak ? dataAnak : null}
        idAnak={id}
        fetch={() => setRefreshKey((oldKey) => oldKey + 1)}
      />

      <FormUpdatePerkembanganAnak
        isOpen={isOpenModalUpdatePerkembanganAnak}
        onCancel={() => setIsOpenModalUpdatePerkembanganAnak(false)}
        fetch={() => setRefreshKey((oldKey) => oldKey + 1)}
        data={dataPerkembanganAnak}
        profil={dataAnak}
      />
    </>
  );
}
