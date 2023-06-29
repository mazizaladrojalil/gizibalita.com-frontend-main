import moment from "moment";
import { monthDiff } from "./calculateMonth";

export function placementColumn(columnYAxis, dataStatistik, dataAnak, tipe) {
  dataStatistik.forEach((data) => {
    for (let i = 0; i < columnYAxis.length; i++) {
      if (monthDiff(moment(dataAnak.tanggal_lahir), moment(data.date)) === i) {
        switch (tipe) {
          case "berat":
            columnYAxis[i] = Number(data.berat);
            break;
          case "tinggi":
            columnYAxis[i] = Number(data.tinggi);
            break;
          case "lingkar_kepala":
            columnYAxis[i] = Number(data.lingkar_kepala);
            break;
          default:
            break;
        }
      }
    }
    let column = columnYAxis;
    return column;
  });
}
