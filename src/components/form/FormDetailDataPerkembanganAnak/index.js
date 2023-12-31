import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import dataBeratBadanByUmurPria from "../../../json/ZScoreBeratBadanLakiLaki.json";
import dataBeratBadanByUmurPerempuan from "../../../json/ZScoreBeratBadanPerempuan.json";
import dataTinggiBadanByUmurPria from "../../../json/ZScorePanjangBadanLakiLaki.json";
import dataTinggiBadanByUmurPerempuan from "../../../json/ZScorePanjangBadanPerempuan.json";
import dataLingkarKepalaByUmurPria from "../../../json/ZScoreLingkarKepalaLakiLaki.json";
import dataLingkarKepalaByUmurPerempuan from "../../../json/ZScoreLingkarKepalaPerempuan.json";
import dataBeratTinggiBadanPria from "../../../json/ZScoreBeratTinggiBadanLaki.json";
import dataBeratTinggiBadanPerempuan from "../../../json/ZScoreBeratTinggiBadanPerempuan.json";
import dataBeratTinggiBadanPria24Bulan from "../../../json/ZScoreBeratTinggiBadanLakiLaki24.json";
import dataBeratTinggiBadanPria60Bulan from "../../../json/ZScoreBeratTinggiBadanLakiLaki60.json";
import dataBeratTinggiBadanPerempuan24Bulan from "../../../json/ZScoreBeratTinggiBadanPerempuan24.json";
import dataBeratTinggiBadanPerempuan60Bulan from "../../../json/ZScoreBeratTinggiBadanPerempuan60.json";

import {
  determineAmbangBatas,
  determineAmbangBatasLingkarKepala,
  determineAmbangBatasTinggiBadan,
  determineAmbangBatasPBBB,
} from "../../../utilities/determineAmbangBatas";
import axios from "axios";
import { monthDiff } from "../../../utilities/calculateMonth";

export default function FormDetailPerkembanganAnak(props) {
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  const { isOpen, onCancel, data, profil, fetch } = props;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);
  const [zScoreBB, setZScoreBB] = useState(0);
  const [zScoreTB, setZScoreTB] = useState(0);
  const [zScoreLK, setZScoreLK] = useState(0);
  const [zScoreBBPB, setZScoreBBPB] = useState(0);
  const [tanggalPengukuran, setTanggalPengukuran] = useState(null);

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        tanggalPengukuran: moment(data.date),
        beratBadan: data.berat,
        tinggiBadan: data.tinggi,
        lingkarKepala: data.lingkar_kepala,
      });
      handleZScore(data.berat);
      handleZScoreTinggiBadan(data.tinggi);
      handleZScoreLingkarKepala(data.lingkar_kepala);
      handleZScorePBBB(data.berat, data.tinggi)
    }
    // eslint-disable-next-line
  }, [isOpen, data]);

  const handleZScore = (beratBadan) => {
    const datePengukuran = form.getFieldValue(tanggalPengukuran);

    if (datePengukuran !== null && datePengukuran !== "") {
      let antropologiData = null;
      const determineMonth = `${monthDiff(moment(data.tanggal_lahir), moment(datePengukuran)) * -1
        }`;

      if (profil.gender === "LAKI_LAKI") {
        dataBeratBadanByUmurPria.forEach((item) => {
          if (item.bulan === determineMonth) {
            antropologiData = item;
          }
        });

        if (antropologiData?.bulan === determineMonth) {
          setZScoreBB(determineAmbangBatas(beratBadan, antropologiData));
        }
      } else {
        dataBeratBadanByUmurPerempuan.forEach((item) => {
          if (item.bulan === determineMonth) {
            antropologiData = item;
          }
        });

        if (antropologiData?.bulan === determineMonth) {
          setZScoreBB(determineAmbangBatas(beratBadan, antropologiData));
        }
      }
    } else {
      setZScoreBB(0);
    }
  };

  const handleZScorePBBB = (beratBadan, tinggiBadan) => {
    let result;
    if (tinggiBadan - Math.floor(tinggiBadan) === 0.5) {
      result = tinggiBadan;
    } else if (tinggiBadan - Math.floor(tinggiBadan) === 0 || tinggiBadan - Math.floor(tinggiBadan) < 0.5) {
      result = Math.floor(tinggiBadan);
    } else {
      result = Math.floor(tinggiBadan) + 0.5;
    }
    if (zScoreTB !== null && zScoreBB !== null) {
      console.log("ini hasilnya", result)
      if (tanggalPengukuran !== null && tanggalPengukuran !== "") {
        let antropologiData = null;
        let umurAnak = `${monthDiff(
          moment(data.tanggal_lahir),
          moment(tanggalPengukuran)
        )}`;
        if (data.gender === "LAKI_LAKI") {
          if (umurAnak >= 0 && umurAnak <= 24) {

            dataBeratTinggiBadanPria24Bulan.forEach((item) => {
              // console.log(tinggiBadan.toFixed(1).toString(),"dan", parseFloat(item.pb))
              if (parseFloat(item.pb) === result) {
                antropologiData = item;
                console.log("p2")
              }

            })
            if (antropologiData !== null) {
              setZScoreBBPB(
                determineAmbangBatasPBBB(tinggiBadan, beratBadan, antropologiData)
              );
            }
          } else if (umurAnak > 24 && umurAnak <= 60) {
            dataBeratTinggiBadanPria60Bulan.forEach((item) => {
              if (parseFloat(item.pb) === result) {
                antropologiData = item;
                console.log("p2")
              }

            })
            if (antropologiData !== null) {
              setZScoreBBPB(
                determineAmbangBatasPBBB(tinggiBadan, beratBadan, antropologiData)
              );
            }
          }
        } else {
          if (umurAnak >= 0 && umurAnak <= 24) {
            dataBeratTinggiBadanPerempuan24Bulan.forEach((item) => {
              if (parseFloat(item.pb) === result) {
                antropologiData = item;
                console.log("p2")
              }

            })
            if (antropologiData !== null) {
              setZScoreBBPB(
                determineAmbangBatasPBBB(tinggiBadan, beratBadan, antropologiData)
              );
            }
          } else if (umurAnak > 24 && umurAnak <= 60) {
            dataBeratTinggiBadanPerempuan60Bulan.forEach((item) => {
              if (parseFloat(item.pb) === result) {
                antropologiData = item;
              }
            })
            if (antropologiData !== null) {
              setZScoreBBPB(
                determineAmbangBatasPBBB(tinggiBadan, beratBadan, antropologiData)
              );
            }
          }
        }
      } else {
        setZScoreTB(0);
      }
    }
  };

  const handleZScoreTinggiBadan = (tinggiBadan) => {
    const datePengukuran = form.getFieldValue(tanggalPengukuran);
    if (datePengukuran !== null && datePengukuran !== "") {
      let antropologiData = null;
      const determineMonth = `${monthDiff(moment(data.tanggal_lahir), moment(datePengukuran)) * -1
        }`;

      if (data.gender === "LAKI_LAKI") {
        dataTinggiBadanByUmurPria.forEach((item) => {
          if (item.bulan === determineMonth) {
            antropologiData = item;
          }
        });

        if (antropologiData?.bulan === determineMonth) {
          setZScoreTB(
            determineAmbangBatasTinggiBadan(tinggiBadan, antropologiData)
          );
        }
      } else {
        dataTinggiBadanByUmurPerempuan.forEach((item) => {
          if (item.bulan === determineMonth) {
            antropologiData = item;
          }
        });

        if (antropologiData?.bulan === determineMonth) {
          setZScoreTB(
            determineAmbangBatasTinggiBadan(tinggiBadan, antropologiData)
          );
        }
      }
    } else {
      setZScoreTB(0);
    }
  };

  const handleZScoreLingkarKepala = (lingkarKepala) => {
    const datePengukuran = form.getFieldValue(tanggalPengukuran);

    if (datePengukuran !== null && datePengukuran !== "") {
      let antropologiData = null;
      const determineMonth = `${monthDiff(moment(data.tanggal_lahir), moment(datePengukuran)) * -1
        }`;

      console.log("test", determineMonth);

      if (data.gender === "LAKI_LAKI") {
        dataLingkarKepalaByUmurPria.forEach((item) => {
          if (item.bulan === determineMonth) {
            antropologiData = item;
          }
        });

        if (antropologiData?.bulan === determineMonth) {
          setZScoreLK(
            determineAmbangBatasLingkarKepala(lingkarKepala, antropologiData)
          );
        }
      } else {
        dataLingkarKepalaByUmurPerempuan.forEach((item) => {
          if (item.bulan === determineMonth) {
            antropologiData = item;
          }
        });

        if (antropologiData?.bulan === determineMonth) {
          setZScoreLK(
            determineAmbangBatasLingkarKepala(lingkarKepala, antropologiData)
          );
        }
      }
    } else {
      setZScoreLK(0);
    }
  };

  // Status Gizi Anak
  const handleZScoreBeratTinggiBadan = (beratTinggiBadan) => {
    const datePengukuran = form.getFieldValue(tanggalPengukuran);
    if (datePengukuran !== null && datePengukuran !== "") {
      let antropologiData = null;
      const determineMonth = `${monthDiff(moment(data.tanggal_lahir), moment(datePengukuran)) * -1
        }`;
        
      if (data.gender === "LAKI_LAKI") {
        dataBeratTinggiBadanPria.forEach((item) => {

          // condition anak umur 0 - 24 bulan
          if (true) {
            item.forEach((subitem) => {
              if (subitem.pb === data.tinggi) {
                antropologiData = item;
              }
            });

            if (antropologiData?.pb === data.tinggi) {
              // setZScorePBBB()
            }
          }

          // condition anak umur 25 - 60
          else if (true) {

          }

        });
      } else {
        dataTinggiBadanByUmurPerempuan.forEach((item) => {
          if (item.bulan === determineMonth) {
            antropologiData = item;
          }
        });

        if (antropologiData?.bulan === determineMonth) {
          setZScoreTB(
            determineAmbangBatasTinggiBadan(beratTinggiBadan, antropologiData)
          );
        }
      }
    } else {
      setZScoreTB(0);
    }
  };


  function onOK() {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();

        if (user && user.user.role === "KADER_POSYANDU") {
          axios
            .put(
              `${process.env.REACT_APP_BASE_URL}/api/posyandu/statistik-anak/${data.id}`,
              {
                berat: parseFloat(values.beratBadan),
                tinggi: parseFloat(values.tinggiBadan),
                lingkar_kepala: parseFloat(values.lingkarKepala),
                date: moment(values.tanggalPengukuran).format("YYYY-MM-DD"),
                z_score_berat: zScoreBB,
                z_score_tinggi: zScoreTB,
                z_score_lingkar_kepala: zScoreLK,
                z_score_gizi: zScoreBBPB,
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
              `${process.env.REACT_APP_BASE_URL}/api/orang-tua/statistik-anak/${data.id}`,
              {
                berat: parseFloat(values.beratBadan),
                tinggi: parseFloat(values.tinggiBadan),
                lingkar_kepala: parseFloat(values.lingkarKepala),
                date: moment(values.tanggalPengukuran).format("YYYY-MM-DD"),
                z_score_berat: zScoreBB,
                z_score_tinggi: zScoreTB,
                z_score_lingkar_kepala: zScoreLK,
                z_score_gizi: zScoreBBPB,
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
      <Modal
        open={isOpen}
        onCancel={onCancel}
        title="Update Data Perkembangan Anak"
        footer={[
          <button
            key="back"
            type="button"
            onClick={onCancel}
            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-md px-3 py-2 text-center mr-6 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
          >
            Kembali
          </button>,
        ]}
      >
        <Row>
          <Col span={24}>
            <Row style={{ marginBottom: 50 }}>
              <Col span={24}>
                <Row>
                  <Col span={5}>Nama Anak</Col>
                  <Col span={1}>:</Col>
                  <Col span={18}>{profil ? profil.nama : null}</Col>
                </Row>
                <Row>
                  <Col span={5}>Jenis Kelamin</Col>
                  <Col span={1}>:</Col>
                  <Col span={18}>{profil ? profil.gender : null}</Col>
                </Row>
                <Row>
                  <Col span={5}>Tanggal Lahir</Col>
                  <Col span={1}>:</Col>
                  <Col span={18}>{profil ? profil.tanggal_lahir : null}</Col>
                </Row>
                <Row>
                  <Col span={5}>Berat Badan</Col>
                  <Col span={1}>:</Col>
                  <Col span={18}>{data ? data.berat : null}</Col>
                </Row>
              </Col>
            </Row>
            {/* <Form
              form={form}
              name="form_update_perkembangan_anak"
              layout="vertical"
            >
              <Form.Item
                label="Tanggal Pengukuran"
                name="tanggalPengukuran"
                rules={[
                  {
                    required: true,
                    message: "Tanggal Pengukuran masih kosong!",
                  },
                ]}
              >
                <DatePicker
                  onChange={(values) =>
                    setTanggalPengukuran(moment(values).format("YYYY-MM-DD"))
                  }
                  allowClear={false}
                />
              </Form.Item>
              <Form.Item
                label="Berat Badan"
                name="beratBadan"
                valuePropName
              >
                <InputNumber min={0} onChange={handleZScore} />
              </Form.Item>
              <Form.Item
                label="Z-Score Berat Badan"
                name="ZScoreBB"
                valuePropName
              >
                <Input
                  style={{ color: "#6e6e6e" }}
                  value={`${zScoreBB} SD`}
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="Tinggi Badan"
                name="tinggiBadan"
                rules={[
                  {
                    required: true,
                    message: "Tinggi Badan masih kosong!",
                  },
                ]}
              >
                <InputNumber min={0} onChange={handleZScoreTinggiBadan} />
              </Form.Item>
              <Form.Item
                label="Z-Score Tinggi Badan"
                name="ZScoreTB"
                valuePropName
              >
                <Input
                  style={{ color: "#6e6e6e" }}
                  value={`${zScoreTB} SD`}
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="Lingkar Kepala"
                name="lingkarKepala"
                rules={[
                  {
                    required: true,
                    message: "Lingkar Kepala masih kosong!",
                  },
                ]}
              >
                <InputNumber min={0} onChange={handleZScoreLingkarKepala} />
              </Form.Item>
              <Form.Item
                label="Z-Score Lingkar Kepala"
                name="ZScoreLK"
                valuePropName
              >
                <Input
                  style={{ color: "#6e6e6e" }}
                  value={`${zScoreLK} SD`}
                  disabled
                />
              </Form.Item>
            </Form> */}
          </Col>
        </Row>
      </Modal>
    </>
  );
}
