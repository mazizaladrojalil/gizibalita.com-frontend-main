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
import {
  determineAmbangBatas,
  determineAmbangBatasLingkarKepala,
  determineAmbangBatasTinggiBadan,
} from "../../../utilities/determineAmbangBatas";
import axios from "axios";
import { monthDiff } from "../../../utilities/calculateMonth";
import '../FormUpdateDataAnak/formUpdateData_style.css';

export default function FormUpdatePerkembanganAnak(props) {
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
    }
    // eslint-disable-next-line
  }, [isOpen, data]);
  console.log(data)

  const handleZScore = (beratBadan) => {
    const datePengukuran = form.getFieldValue(tanggalPengukuran);

    if (datePengukuran !== null && datePengukuran !== "") {
      let antropologiData = null;
      const determineMonth = `${
        monthDiff(moment(data.tanggal_lahir), moment(datePengukuran)) * -1
      }`;

      if (profil.gender === "LAKI_LAKI") {
        dataBeratBadanByUmurPria.forEach((item) => {
          if (item.bulan === determineMonth) {
            antropologiData = item;
            console.log("test1",data)
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

  const handleZScoreTinggiBadan = (tinggiBadan) => {
    const datePengukuran = form.getFieldValue(tanggalPengukuran);
    if (datePengukuran !== null && datePengukuran !== "") {
      let antropologiData = null;
      const determineMonth = `${
        monthDiff(moment(data.tanggal_lahir), moment(datePengukuran)) * -1
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
      const determineMonth = `${
        monthDiff(moment(data.tanggal_lahir), moment(datePengukuran)) * -1
      }`;

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

  function onOK() {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        console.log(values)

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
            <Form
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
