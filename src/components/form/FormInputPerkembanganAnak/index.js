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
// import { dataBeratBadanByUmur } from "../../../json/berat_badan_by_umur";
import dataBeratBadanByUmurPria from "../../../json/ZScoreBeratBadanLakiLaki.json";
import dataBeratBadanByUmurPerempuan from "../../../json/ZScoreBeratBadanPerempuan.json";
import dataTinggiBadanByUmurPria from "../../../json/ZScorePanjangBadanLakiLaki.json";
import dataTinggiBadanByUmurPerempuan from "../../../json/ZScorePanjangBadanPerempuan.json";
import dataLingkarKepalaByUmurPria from "../../../json/ZScoreLingkarKepalaLakiLaki.json";
import dataLingkarKepalaByUmurPerempuan from "../../../json/ZScoreLingkarKepalaPerempuan.json";
import dataBeratTinggiBadanPria24Bulan from "../../../json/ZScoreBeratTinggiBadanLakiLaki24.json";
import dataBeratTinggiBadanPria60Bulan from "../../../json/ZScoreBeratTinggiBadanLakiLaki60.json";
import dataBeratTinggiBadanPerempuan24Bulan from "../../../json/ZScoreBeratTinggiBadanPerempuan24.json";
import dataBeratTinggiBadanPerempuan60Bulan from "../../../json/ZScoreBeratTinggiBadanPerempuan60.json";
import {
  determineAmbangBatas,
  determineAmbangBatasLingkarKepala,
  determineAmbangBatasPBBB,
  determineAmbangBatasTinggiBadan,
} from "../../../utilities/determineAmbangBatas";
import axios from "axios";
import { monthDiff } from "../../../utilities/calculateMonth";

export default function FormInputPerkembanganAnak(props) {
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  const { isOpen, onCancel, data, idAnak, fetch } = props;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);
  const [zScoreBB, setZScoreBB] = useState(0);
  const [zScoreTB, setZScoreTB] = useState(0);
  const [zScoreLK, setZScoreLK] = useState(0);
  const [zScoreBBPB, setZScoreBBPB] = useState(0);
  const [tanggalPengukuran, setTanggalPengukuran] = useState("");

  const handleZScore = (beratBadan) => {
    if (tanggalPengukuran !== null && tanggalPengukuran !== "") {
      let antropologiData = null;
      if (data.gender === "LAKI_LAKI") {
        dataBeratBadanByUmurPria.forEach((item) => {
          if (
            item.bulan ===
            `${monthDiff(
              moment(data.tanggal_lahir),
              moment(tanggalPengukuran)
            )}`
          ) {
            antropologiData = item;
          }
        });

        if (
          antropologiData.bulan ===
          `${monthDiff(moment(data.tanggal_lahir), moment(tanggalPengukuran))}`
        ) {
          setZScoreBB(determineAmbangBatas(beratBadan, antropologiData));
        }
      } else {
        dataBeratBadanByUmurPerempuan.forEach((item) => {
          if (
            item.bulan ===
            `${monthDiff(
              moment(data.tanggal_lahir),
              moment(tanggalPengukuran)
            )}`
          ) {
            antropologiData = item;
          }
        });

        if (
          antropologiData.bulan ===
          `${monthDiff(moment(data.tanggal_lahir), moment(tanggalPengukuran))}`
        ) {
          setZScoreBB(determineAmbangBatas(beratBadan, antropologiData));
        }
      }
    } else {
      setZScoreBB(0);
    }
  };

  useEffect(() => {
    if (zScoreTB !== null && zScoreBB !== null) {
      if (tanggalPengukuran !== null && tanggalPengukuran !== "") {
        let antropologiData = null;
        let umurAnak = `${monthDiff(
          moment(data.tanggal_lahir),
          moment(tanggalPengukuran)
        )}`;
        if (data.gender === "LAKI_LAKI") {
          if (umurAnak >= 0 && umurAnak <= 24) {
            dataBeratTinggiBadanPria24Bulan.forEach((item) => {
              if (item.pb === data.tinggiBadan) {
                antropologiData = item;
              }
            })
            if (antropologiData.pb === data.tinggiBadan) {
              setZScoreBBPB(
                determineAmbangBatasPBBB(data.tinggiBadan, data.beratBadan, antropologiData)
              );
            }
          } else if (umurAnak > 24 && umurAnak <= 60) {
            dataBeratTinggiBadanPria60Bulan.forEach((item) => {
              if (item.pb === data.tinggiBadan) {
                antropologiData = item;
              }
            })
            if (antropologiData.pb === data.tinggiBadan) {
              setZScoreBBPB(
                determineAmbangBatasPBBB(data.tinggiBadan, data.beratBadan, antropologiData)
              );
            }
          }
        } else {
          if (umurAnak >= 0 && umurAnak <= 24) {
            dataBeratTinggiBadanPerempuan24Bulan.forEach((item) => {
              if (item.pb === data.tinggiBadan) {
                antropologiData = item;
              }
            })
            if (antropologiData.pb === data.tinggiBadan) {
              setZScoreBBPB(
                determineAmbangBatasPBBB(data.tinggiBadan, data.beratBadan, antropologiData)
              );
            }
          } else if (umurAnak > 24 && umurAnak <= 60) {
            dataBeratTinggiBadanPerempuan60Bulan.forEach((item) => {
              if (item.pb === data.tinggiBadan) {
                antropologiData = item;
              }
            })
            if (antropologiData.pb === data.tinggiBadan) {
              setZScoreBBPB(
                determineAmbangBatasPBBB(data.tinggiBadan, data.beratBadan, antropologiData)
              );
            }
          }
        }
      } else {
        setZScoreTB(0);
      }
    }
  }, [zScoreTB, zScoreBB])

  const handleZScoreTinggiBadan = (tinggiBadan) => {
    if (tanggalPengukuran !== null && tanggalPengukuran !== "") {
      let antropologiData = null;
      if (data.gender === "LAKI_LAKI") {
        dataTinggiBadanByUmurPria.forEach((item) => {
          if (
            item.bulan ===
            `${monthDiff(
              moment(data.tanggal_lahir),
              moment(tanggalPengukuran)
            )}`
          ) {
            antropologiData = item;
          }
        });

        if (
          antropologiData.bulan ===
          `${monthDiff(moment(data.tanggal_lahir), moment(tanggalPengukuran))}`
        ) {
          setZScoreTB(
            determineAmbangBatasTinggiBadan(tinggiBadan, antropologiData)
          );
        }
      } else {
        dataTinggiBadanByUmurPerempuan.forEach((item) => {
          if (
            item.bulan ===
            `${monthDiff(
              moment(data.tanggal_lahir),
              moment(tanggalPengukuran)
            )}`
          ) {
            antropologiData = item;
          }
        });

        if (
          antropologiData.bulan ===
          `${monthDiff(moment(data.tanggal_lahir), moment(tanggalPengukuran))}`
        ) {
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
    if (tanggalPengukuran !== null && tanggalPengukuran !== "") {
      let antropologiData = null;
      if (data.gender === "LAKI_LAKI") {
        dataLingkarKepalaByUmurPria.forEach((item) => {
          if (
            item.bulan ===
            `${monthDiff(
              moment(data.tanggal_lahir),
              moment(tanggalPengukuran)
            )}`
          ) {
            antropologiData = item;
          }
        });

        if (
          antropologiData.bulan ===
          `${monthDiff(moment(data.tanggal_lahir), moment(tanggalPengukuran))}`
        ) {
          setZScoreLK(
            determineAmbangBatasLingkarKepala(lingkarKepala, antropologiData)
          );
        }
      } else {
        dataLingkarKepalaByUmurPerempuan.forEach((item) => {
          if (
            item.bulan ===
            `${monthDiff(
              moment(data.tanggal_lahir),
              moment(tanggalPengukuran)
            )}`
          ) {
            antropologiData = item;
          }
        });
        if (
          antropologiData.bulan ===
          `${monthDiff(moment(data.tanggal_lahir), moment(tanggalPengukuran))}`
        ) {
          setZScoreLK(
            determineAmbangBatasLingkarKepala(lingkarKepala, antropologiData)
          );
        }
      }
    } else {
      setZScoreLK(0);
    }
  };

  function onOK() {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        console.log(values)
        if (user && user.user.role === "KADER_POSYANDU") {
          axios
            .post(
              `${process.env.REACT_APP_BASE_URL}/api/posyandu/statistik-anak`,
              {
                id_anak: parseInt(idAnak),
                berat: values.beratBadan,
                tinggi: values.tinggiBadan,
                lingkar_kepala: values.lingkarKepala,
                date: moment(values.tanggalPengukuran).format("YYYY-MM-DD"),
                z_score_berat: zScoreBB,
                z_score_tinggi: zScoreTB,
                z_score_lingkar_kepala: zScoreLK,
                z_score_gizi : zScoreBBPB
              },
              {
                headers: { Authorization: `Bearer ${user.token.value}` },
              }
            )
            .then((response) => {
              console.log("test", zScoreBBPB);
              messageApi.open({
                type: "success",
                content: "Data berhasil tersimpan",
              });
              setTimeout(() => {
                onCancel();
                fetch();
                window.location.reload()
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
            .post(
              `${process.env.REACT_APP_BASE_URL}/api/orang-tua/statistik-anak`,
              {
                id_anak: parseInt(idAnak),
                berat: values.beratBadan,
                tinggi: values.tinggiBadan,
                lingkar_kepala: values.lingkarKepala,
                date: moment(values.tanggalPengukuran).format("YYYY-MM-DD"),
                z_score_berat: zScoreBB,
                z_score_tinggi: zScoreTB,
                z_score_lingkar_kepala: zScoreLK,
                z_score_gizi : zScoreBBPB,
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
        title="Input Data Perkembangan Anak"
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
            <Row style={{ marginBottom: 50 }}>
              <Col span={24}>
                <Row>
                  <Col span={5}>Nama Anak</Col>
                  <Col span={1}>:</Col>
                  <Col span={18}>{data ? data.nama : null}</Col>
                </Row>
                <Row>
                  <Col span={5}>Jenis Kelamin</Col>
                  <Col span={1}>:</Col>
                  <Col span={18}>{data ? data.gender : null}</Col>
                </Row>
                <Row>
                  <Col span={5}>Tanggal Lahir</Col>
                  <Col span={1}>:</Col>
                  <Col span={18}>{data ? data.tanggal_lahir : null}</Col>
                </Row>
              </Col>
            </Row>
            <Form
              form={form}
              name="form_input_perkembangan_anak"
              layout="vertical"

            >
              <Form.Item
                label="Tanggal Pengukuran"
                name="tanggalPengukuran"
                style={{ fontSize: "14px" }}
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
                rules={[
                  {
                    required: true,
                    message: "Berat Badan masih kosong!",
                  },
                ]}
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
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
