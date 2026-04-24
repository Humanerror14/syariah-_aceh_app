export interface Article {
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  tag: 'FIQIH' | 'TRADISI' | 'REGULASI' | 'LAINNYA';
  pdfUrl?: string;
}

export const articles: Article[] = [
  {
    title: 'Syarat Wajib Zakat Mal',
    excerpt: 'Seseorang wajib berzakat harta jika memenuhi syarat agama, kepemilikan, dan nisab.',
    content: "Seseorang wajib berzakat harta jika beragama Islam, merdeka, milik penuh, mencapai nisab (sekitar 85-93 gram emas murni), dan telah mencapai haul (kepemilikan 1 tahun Hijriah).\n\nZakat harta (Mal) merupakan salah satu dari Rukun Islam yang bertujuan untuk membersihkan harta kita. Apabila harta berupa simpanan, emas, perdagangan, atau ternak telah mencapai batas nisabnya, wajib dikeluarkan zakatnya sebesar 2,5%.\n\nContoh: Jika Anda memiliki tabungan senilai harga 100 gram emas selama satu tahun penuh, maka 2,5% dari total tersebut merupakan hak bagi para mustahik zakat.",
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800',
    tag: 'FIQIH',
    pdfUrl: 'https://kemenag.go.id/storage/files/1620311456_Fatwa-MUI-Nomor-23-Tahun-2020-tentang-Pemanfaatan-Harta-Zakat-Infaq-dan-Shadaqah-untuk-Penanggulangan-Wabah-Covid-19-dan-Dampaknya.pdf'
  },
  {
    title: 'Standardisasi Mayam',
    content: "Sesuai fatwa MPU Aceh, standardisasi mayam tetap dipertahankan sebagai alat ukur mahar dan dizakatkan. Berdasarkan mufakat alim ulama dan dinas syariat Islam, disepakati bahwa ekuivalensi 1 Mayam adalah 3.33 gram.\n\nDalam adat perkawinan masyarakat Aceh, mayam adalah satuan mutlak untuk mahar kawin. Nilai mayam bisa fluktuatif mengikuti harga emas global, tetapi perhitungan bobotnya selalu konstan.\n\nOleh karena itu, dalam aplikasi ini kita merujuk pada standar 1 Mayam = 3.33 gram sebagai dasar konversi menuju satuan Sistem Internasional (Metric).",
    excerpt: 'Standardisasi mayam tetap dipertahankan sebagai alat ukur adat dengan ekuivalensi 3.33 gram.',
    thumbnail: 'https://mmc.tirto.id/image/2019/11/14/istock-177431217_1_ratio-16x9.jpg',
    tag: 'TRADISI',
    pdfUrl: 'https://kemenag.go.id/storage/files/1620311456_Fatwa-MUI-Nomor-23-Tahun-2020-tentang-Pemanfaatan-Harta-Zakat-Infaq-dan-Shadaqah-untuk-Penanggulangan-Wabah-Covid-19-dan-Dampaknya.pdf'
  },
  {
    title: 'Zakat Fitrah & Beras',
    content: "Standardisasi zakat fitrah di Aceh mengacu pada 1 sha' beras (2.8 kg) atau uang tunai senilai harga pasar beras kelas premium di wilayah tersebut.\n\nZakat Fitrah adalah zakat jiwa yang diwajibkan bagi setiap muslim (laki-laki maupun perempuan, besar maupun kecil) yang menjumpai bulan Ramadhan dan memiliki kelebihan makanan untuk dirinya sendiri dan keluarganya.\n\nPecahan kadar zakat fitrah di Aceh dan Indonesia pada umumnya dibulatkan ke atas untuk kehati-hatian, dengan pedoman utama dari MPU Aceh yakni 2.8 Kg per jiwa.",
    excerpt: "Ketentuan zakat fitrah di Aceh mengacu pada 1 sha' beras (2.8 kg) atau uang tunai.",
    thumbnail: 'https://imgcdn.espos.id/@espos/images/2022/04/beras.jpg?quality=60',
    tag: 'REGULASI',
    pdfUrl: 'https://kemenag.go.id/storage/files/1620311456_Fatwa-MUI-Nomor-23-Tahun-2020-tentang-Pemanfaatan-Harta-Zakat-Infaq-dan-Shadaqah-untuk-Penanggulangan-Wabah-Covid-19-dan-Dampaknya.pdf'
  },
  {
    title: 'Tradisi standar pengukuran luas tanah dan berat hasil panen',
    content: "Salah satu budaya (warisan) masyarakat Aceh yang masih digunakan sampai saat ini adalah konsep takaran . Takaran (alat ukur satuan) merupakan suatu budaya pengukuran yang digunakan masyarakat Aceh untuk menyelesaikan permasalahan yang timbul dalam masyarakat. Budaya pengukuran yang digunakan dalam masyarakat Aceh indentik dengan pengetahuan sains dan matematika yang dikenal dengan etnosains dan etnomatematik. Tetapi jenis takaran (konsep pengukuran) apa saja yang\n\ndigunakan dalam adat istiadat masyarakat Aceh penting untuk diteliti",
    excerpt: "Salah satu budaya (warisan) masyarakat Acehyang masih digunakan sampai saat ini adalah konsep takaran",
    thumbnail: 'https://img.antarafoto.com/cache/1200x792/2024/04/27/tradisi-kenduri-turun-sawah-di-aceh-1b7yf-dom.jpg',
    tag: 'TRADISI',
    pdfUrl: 'https://kemenag.go.id/storage/files/1620311456_Fatwa-MUI-Nomor-23-Tahun-2020-tentang-Pemanfaatan-Harta-Zakat-Infaq-dan-Shadaqah-untuk-Penanggulangan-Wabah-Covid-19-dan-Dampaknya.pdf'
  },
  {
    title: 'Keutamaan Berwakaf dalam Tradisi Aceh',
    content: "Wakaf telah lama menjadi pilar pembangunan sosial di Aceh. Dari tanah masjid hingga 'Habib Bugak' di Saudi Arabia yang manfaatnya diperuntukkan bagi jamaah haji asal Aceh.\n\nDalam tradisi keislaman Aceh, wakaf bukan sekadar menyerahkan harta, tetapi membangun peradaban yang berkelanjutan (Amal Jariyah). Penduduk Aceh secara historis dikenal sangat dermawan dalam menghibahkan tanah dan properti untuk kepentingan umat.\n\nStandardisasi pengelolaan wakaf saat ini terus dibenahi agar memberikan manfaat ekonomi yang nyata bagi masyarakat luas.",
    excerpt: 'Wakaf di Aceh memiliki nilai sejarah yang kuat sebagai pilar pembangunan peradaban.',
    thumbnail: 'https://www.trenmedia.co.id/wp-content/uploads/2026/02/ARTIKEL_Bagaimana-Hukum-Menjual-Tanah-Wakaf-Simak-Penjelasannya1.webp',
    tag: 'FIQIH',
    pdfUrl: 'https://kemenag.go.id/storage/files/1620311456_Fatwa-MUI-Nomor-23-Tahun-2020-tentang-Pemanfaatan-Harta-Zakat-Infaq-dan-Shadaqah-untuk-Penanggulangan-Wabah-Covid-19-dan-Dampaknya.pdf'
  }
];
