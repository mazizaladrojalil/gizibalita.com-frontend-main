import { utils, writeFile } from 'xlsx';

const exportTemplate = () => {
    const handleExport = (data) => {
        console.log(data);
        const pt = "Gofit";
        const headings = [
            [
                'No',
                'Nama',
                'Panggilan',
                'Tanggal Lahir',
                'Alamat',
                'JK',
                'Nama Orang Tua',
                'Tanggal Pengukuran',
                'Berat',
                'Tinggi',
                'LiLA',
            ],
        ];
        const newData = data.map((item, index) => {
            return [
                index + 1,
                item.nama,
                item.panggilan,
                item.tglLahir,
                item.alamat,
                item.jk,
                item.nama_ortu,
                item.tgl_ukur,
                item.berat,
                item.tinggi,
                item.lila,
            ];
        });
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        ws['!cols'] = [
            // { wch: 8 }, // ID column
            // { wch: 15 }, // No Pelanggan column
            // { wch: 20 }, // Nama column
            // { wch: 30 }, // Alamat column
            // { wch: 15 }, // No HP column
            // { wch: 20 }, // Email column
            // { wch: 15 }, // Username column
            // { wch: 15 }, // Role column
            // { wch: 15 }, // Status column
            // { wch: 20 }, // Created At column
        ];
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, newData, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Template_Input_Anak.xlsx');
    };

    return { handleExport };
};

export default exportTemplate;
