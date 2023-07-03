export function Berat(posyandu, data) {
    const kategoriBerat = [];
    data.map((item) => {
        if(item.id_posyandu === posyandu){
             kategoriBerat.push({
                kategori : "OBESITAS",
                total : item.berat_badan.obesitas
            },{
                kategori : "NORMAL",
                total : item.berat_badan.normal
            }, {
                kategori : "KURUS",
                total : item.berat_badan.kurus
            },{
                kategori : "SANGAT KURUS",
                total : item.berat_badan.sangat_kurus
            }, {
                kategori : "GEMUK",
                total : item.berat_badan.gemuk
            })
        } 
    });
    return kategoriBerat;
}

export function Tinggi(posyandu, data) {
    const kategoriTinggi = [];
    data.map((item) => {
        if(item.id_posyandu === posyandu){
             kategoriTinggi.push({
                kategori : "TINGGI",
                total : item.tinggi_badan.tinggi
            },{
                kategori : "NORMAL",
                total : item.tinggi_badan.normal
            }, {
                kategori : "PENDEK",
                total : item.tinggi_badan.pendek
            },{
                kategori : "SANGAT PENDEK",
                total : item.tinggi_badan.sangat_pendek
            })
        } 
    });
    return kategoriTinggi;
}

export function Lingkar(posyandu, data) {
    const kategoriLingkar = [];
    data.map((item) => {
        if(item.id_posyandu === posyandu){
             kategoriLingkar.push({
                kategori : "MAKROSEFIL",
                total : item.lingkar_kepala.makrosefali
            },{
                kategori : "NORMAL",
                total : item.lingkar_kepala.normal
            }, {
                kategori : "MIKROSEFIL",
                total : item.lingkar_kepala.mikrosefali
            })
        } 
    });
    return kategoriLingkar;
}