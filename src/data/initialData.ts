import { SensorModule, QuizQuestion, QuizSubmission } from '../types';

export const INITIAL_SENSORS: SensorModule[] = [
  {
    id: 'dht11',
    name: 'DHT11 / Sensor Suhu & Kelembapan',
    category: 'Lingkungan',
    shortDescription: 'Sensor digital terkalibrasi untuk mengukur temperatur ambient 0-50°C dan kelembapan relatif udara 20-90% RH via 1-Wire.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    fullDefinition: 'DHT11 adalah sensor komposit digital murah dengan kalibrasi presisi tinggi di pabrik untuk pembacaan suhu dan kelembapan udara. Sensor ini mengintegrasikan komponen penginderaan kelembaban resistif, termistor NTC (Negative Temperature Coefficient), dan mikrokontroler 8-bit internal yang mengonversi data analog menjadi paket data digital 40-bit terenkripsi checksum.',
    specifications: {
      operatingVoltage: '3.3V - 5.5V DC',
      measurementRange: 'Suhu 0 - 50°C (±2°C), Kelembapan 20 - 90% RH (±5% RH)',
      outputSignal: 'Digital Single-Bus (1-Wire Proprietary)',
      accuracy: '±2°C (Suhu) / ±5% RH (Kelembapan)',
      responseTime: '2 detik (Sampling rate 1Hz)'
    },
    workingPrinciple: 'Mikrokontroler mengirim sinyal start LOW selama 18ms. Sensor merespons dengan sinyal acknowledge dan mentransmisikan data serial 40 bit (5 byte) yang terdiri dari: Byte 1 = Integer Kelembaban, Byte 2 = Desimal Kelembaban, Byte 3 = Integer Suhu, Byte 4 = Desimal Suhu, Byte 5 = Checksum pengujian keabsahan.',
    mathFormula: 'Checksum Validasi: (Byte1 + Byte2 + Byte3 + Byte4) & 0xFF == Byte5',
    sensingStages: {
      stage1: 'Transduksi Fisik: Perubahan resistansi substrat polimer saat molekul uap air diserap & perubahan resistansi termistor NTC.',
      stage2: 'Pengkondisi Sinyal: IC internal 8-bit membaca sinyal ADC, mencocokkan koefisien kalibrasi OTP ROM terprogram.',
      stage3: 'Mikrokontroler Arduino: Menerima pulsa LOW/HIGH durasi mikrodetik (50µs LOW + 26-28µs HIGH untuk bit 0, 70µs HIGH untuk bit 1).'
    },
    pins: [
      { name: 'VCC (+)', type: 'VCC', description: 'Catu daya positif modul (3.3V - 5V DC)', arduinoPin: '5V Pin Arduino' },
      { name: 'DATA (Out)', type: 'DIGITAL', description: 'Jalur komunikasi serial 1-Wire data dua arah', arduinoPin: 'Pin Digital D2 Arduino' },
      { name: 'NC (Not Connected)', type: 'NC', description: 'Pin kosong pada modul 4-pin (tidak terhubung)', arduinoPin: 'Dibiarkan Kosong' },
      { name: 'GND (-)', type: 'GND', description: 'Ground referensi tegangan bersama', arduinoPin: 'GND Pin Arduino' }
    ],
    anatomyImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    internalComponents: [
      {
        name: 'Polimer Substrat Higroskopis',
        description: 'Lapisan dielektrik penyerap uap air yang resistansinya berubah berbanding terbalik dengan kelembaban.',
        imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Termistor NTC Presisi',
        description: 'Resistor termal berbahan semikonduktor dengan resistansi yang menurun secara eksponensial seiring kenaikan temperatur.',
        imageUrl: 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Resistor Pull-Up 10kΩ',
        description: 'Menjaga jalur data pin 1-Wire tetap HIGH saat saluran dalam kondisi pasif (idle).',
        imageUrl: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'IC Mikrokontroler 8-bit & OTP Memory',
        description: 'Memproses komparasi kalibrasi pabrik dan merangkai bit serial sebelum dikirimkan ke pin output.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      }
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=FqGQ9KzFD06',
    simulationType: 'analog-slider'
  },
  {
    id: 'pir',
    name: 'PIR (Passive Infrared / Sensor Gerak)',
    category: 'Gerak & Cahaya',
    shortDescription: 'Sensor pendeteksi pergerakan objek bermassa panas (manusia/hewan) melalui radiasi inframerah pasif sudut 120°.',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    fullDefinition: 'PIR (Passive Infrared Sensor) modul HC-SR501 adalah sensor elektronika yang mendeteksi perubahan radiasi inframerah yang dipancarkan oleh objek hidup di area jangkauan sensor. Sensor ini disebut pasif karena tidak memancarkan energi sendiri, melainkan hanya menyerap radiasi inframerah sekitar.',
    specifications: {
      operatingVoltage: '4.5V - 20V DC (Regulator internal ke 3.3V)',
      measurementRange: 'Jarak 3 - 7 meter (dapat diatur via trimpot)',
      outputSignal: 'Digital TTL HIGH (3.3V saat gerak) / LOW (0V diam)',
      accuracy: 'Sudut konus sensor < 120 derajat',
      responseTime: 'Delay waktu 0.3 - 18 detik (dapat diatur)'
    },
    workingPrinciple: 'Lensa Fresnel membagi zona penginderaan menjadi beberapa segmen. Ketika tubuh manusia melintasi dua elemen piroelektrik yang bersebelahan, terjadi beda potensial diferensial yang diperkuat oleh chip BISS0001 menjadi pulsa logika HIGH pada pin output.',
    mathFormula: 'V_out = Differential Pyroelectric Output: ΔV = V_slot1 - V_slot2',
    sensingStages: {
      stage1: 'Transduksi Radiasi: Lensa Fresnel memfokuskan spektrum gelombang IR (8-14µm) ke kristal piroelektrik (Lithium Tantalate).',
      stage2: 'Pengkondisian IC BISS0001: Penguat operasional dua tahap (op-amp amplifier), komparator jendela (window comparator).',
      stage3: 'Arduino Read: Arduino membaca status logika digital HIGH (1) atau LOW (0) pada pin interrupt atau digital biasa.'
    },
    pins: [
      { name: 'VCC', type: 'VCC', description: 'Catu daya 5V DC', arduinoPin: '5V Pin Arduino' },
      { name: 'OUT', type: 'DIGITAL', description: 'Sinyal digital logika 3.3V TTL', arduinoPin: 'Pin Digital D7 Arduino' },
      { name: 'GND', type: 'GND', description: 'Ground', arduinoPin: 'GND Pin Arduino' }
    ],
    anatomyImageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    internalComponents: [
      {
        name: 'Lensa Fresnel Segmented',
        description: 'Lensa plastik cembung mikrosegmentasi untuk memperlebar cakupan dan memfokuskan radiasi inframerah ke sensor piroelektrik.',
        imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Dual Pyroelectric Element',
        description: 'Dua elemen sensor berpolaritas terbalik untuk meniadakan gangguan suhu sekitar (common mode noise).',
        imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Trimpot Sensitivitas & Delay',
        description: 'Dua potensiometer mini untuk mengatur jarak jangkauan (3-7m) dan lama waktu aktif pulsa HIGH.',
        imageUrl: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'IC BISS0001 & Jumper Mode',
        description: 'IC pemroses sinyal piroelektrik dengan filter jendela dan jumper pemilihan mode trigger (L/H).',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      }
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=6F1B_N6MXlE',
    simulationType: 'motion-trigger'
  },
  {
    id: 'ldr',
    name: 'LDR (Light Dependent Resistor / Sensor Cahaya)',
    category: 'Gerak & Cahaya',
    shortDescription: 'Sensor fotokonduktif yang nilai hambatannya berubah secara drastis berdasarkan intensitas cahaya pada permukaannya.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    fullDefinition: 'LDR adalah komponen semikonduktor foto-resistor berbahan Cadmium Sulfide (CdS). Resistansinya sangat tinggi dalam kondisi gelap gulita (hingga beberapa Mega Ohm) dan menurun drastis menjadi beberapa ratus Ohm saat terkena paparan cahaya terang.',
    specifications: {
      operatingVoltage: '3.3V - 5V DC',
      measurementRange: '1 Lux (Gelap) hingga 10.000+ Lux (Terang Terik)',
      outputSignal: 'Analog (A0) tegangan 0-5V & Digital (D0) komparator LM393',
      accuracy: 'Sensitivitas foton puncak 540nm (spektrum hijau-kuning)',
      responseTime: '20ms - 30ms'
    },
    workingPrinciple: 'Fotokonduktivitas elektron: Ketika foton cahaya mengenai pita valensi semikonduktor CdS, elektron melompat ke pita konduksi menghasilkan pembawa muatan bebas, sehingga konduktivitas naik dan resistansi turun.',
    mathFormula: 'Pembagi Tegangan: V_out = V_cc * (R_ldr / (R_ldr + R_fixed))',
    sensingStages: {
      stage1: 'Absorpsi Foton: Cahaya membangkitkan elektron-lubang pada kisi kristal semikonduktor CdS.',
      stage2: 'Jaringan Pembagi Tegangan: Mengubah fluktuasi resistansi menjadi variasi tegangan analog (0 - 5 Volt).',
      stage3: 'Komparasi LM393 & ADC: Menghasilkan output digital D0 (threshold trimpot) dan analog A0 (10-bit ADC 0-1023 Arduino).'
    },
    pins: [
      { name: 'VCC', type: 'VCC', description: 'Tegangan masukan 3.3V - 5V', arduinoPin: '5V Pin Arduino' },
      { name: 'GND', type: 'GND', description: 'Ground sirkuit', arduinoPin: 'GND Pin Arduino' },
      { name: 'DO', type: 'DIGITAL', description: 'Output digital komparator (HIGH/LOW)', arduinoPin: 'Pin Digital D8 Arduino' },
      { name: 'AO', type: 'ANALOG', description: 'Output analog linier pembagi tegangan', arduinoPin: 'Pin Analog A0 Arduino' }
    ],
    anatomyImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    internalComponents: [
      {
        name: 'Foto-Resistor CdS',
        description: 'Sensor jalur zig-zag berbahan Kadmium Sulfida untuk memaksimalkan area interaksi cahaya.',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'IC Komparator LM393',
        description: 'Komparator tegangan presisi ganda untuk menentukan batas logika digital DO.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Trimpot Kalibrasi Ambang',
        description: 'Potensiometer multi-putar untuk menyetel batas intensitas cahaya aktif DO.',
        imageUrl: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=400&q=80'
      }
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=6F1B_N6MXlE',
    simulationType: 'light-sensor'
  },
  {
    id: 'ir-obstacle',
    name: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
    category: 'Gerak & Cahaya',
    shortDescription: 'Sensor optik reflektif inframerah yang mendeteksi rintangan objek di hadapannya pada jarak 2 - 30 cm.',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    fullDefinition: 'Modul sensor halangan inframerah terdiri dari sepasang LED pemancar (transmitter) inframerah dan fotodioda penerima (receiver). Sensor ini memanfaatkan pantulan berkas sinar inframerah ketika mengenai permukaan benda padat di depannya.',
    specifications: {
      operatingVoltage: '3.3V - 5V DC',
      measurementRange: '2 cm - 30 cm (diatur via potensiometer onboard)',
      outputSignal: 'Digital TTL (LOW aktif saat halangan terdeteksi)',
      accuracy: 'Sudut pantul 35°',
      responseTime: 'Sangat cepat (< 5ms)'
    },
    workingPrinciple: 'LED IR memancarkan radiasi tak kasat mata (panjang gelombang 940nm). Jika ada benda di depan, radiasi dipantulkan kembali dan ditangkap fotodioda. Arus balik fotodioda meningkat, mengubah tegangan masuk ke IC LM393 dan menghasilkan logika LOW.',
    mathFormula: 'Intensitas Refleksi: I_reflected ∝ 1 / (Jarak)^2 * Albedo_Objek',
    sensingStages: {
      stage1: 'Emisi & Refleksi: Emisi berkas IR 940nm dan refleksi optik permukaan objek rintangan.',
      stage2: 'Fotodeteksi: Arus foto pada photodiode diubah menjadi tegangan pada pin inverting LM393.',
      stage3: 'Threshold Komparator: LM393 membandingkan dengan tegangan referensi trimpot menghasilkan output aktif LOW.'
    },
    pins: [
      { name: 'VCC', type: 'VCC', description: 'Daya 3.3V - 5V', arduinoPin: '5V Pin Arduino' },
      { name: 'GND', type: 'GND', description: 'Ground sirkuit', arduinoPin: 'GND Pin Arduino' },
      { name: 'OUT', type: 'DIGITAL', description: 'Sinyal deteksi (LOW jika ada halangan)', arduinoPin: 'Pin Digital D3 Arduino' }
    ],
    anatomyImageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    internalComponents: [
      {
        name: 'LED Infrared Transmitter (Transparan)',
        description: 'Dioda emisi pemancar sinar inframerah gelombang 940nm konstan.',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Photodiode Receiver (Hitam pekat)',
        description: 'Detektor foton dengan filter optik daylight-filter untuk mengurangi distorsi cahaya tampak.',
        imageUrl: 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'IC Op-Amp LM393 & Trimpot Jarak',
        description: 'Komparator komparasi tegangan sinyal deteksi rintangan dan penyetel sensitivitas.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      }
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=6F1B_N6MXlE',
    simulationType: 'distance-slider'
  },
  {
    id: 'mq2',
    name: 'MQ-2 / Sensor Gas & Asap',
    category: 'Gas & Bahaya',
    shortDescription: 'Sensor semikonduktor elektrokimia bersensitivitas tinggi terhadap LPG, propana, metana, alkohol, hidrogen, dan asap kebakaran.',
    imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
    fullDefinition: 'MQ-2 menggunakan material sensitif gas berupa Timah Dioksida (SnO2) dengan konduktivitas rendah di udara bersih. Ketika molekul gas mudah terbakar atau asap terikat dengan kisi sensor yang dipanaskan, konduktivitas sensor meningkat secara proporsional dengan konsentrasi gas.',
    specifications: {
      operatingVoltage: '5.0V ± 0.1V DC (Membutuhkan arus pemanas ~150mA)',
      measurementRange: 'Konsentrasi 300 - 10000 ppm (Gas mudah terbakar)',
      outputSignal: 'Analog AO (0 - 5V) dan Digital DO (Threshold)',
      accuracy: 'Sensitivitas tinggi terhadap LPG, Propana, Asap rokok/kayu',
      responseTime: 'Respon cepat < 10 detik, pemulihan < 30 detik'
    },
    workingPrinciple: 'Filamen pemanas (heater) memanaskan SnO2 hingga ~300°C. Oksigen di udara bersih diserap membentuk ion O2- negatif di permukaan. Gas pereduksi (LPG/Asap) bereaksi melepaskan elektron kembali ke SnO2, menurunkan hambatan listrik sensor.',
    mathFormula: 'Karakteristik Sensitivitas: Rs/Ro = A * (ppm)^B (Skala Logaritmik)',
    sensingStages: {
      stage1: 'Aktivasi Termal & Kemisorpsi: Heater internal mengaktivasi penyerapan oksigen pada permukaan kristal SnO2.',
      stage2: 'Reduksi Gas Reduktor: Gas hidrokarbon bereaksi dengan ion oksigen, menurunkan barier potensial butir SnO2.',
      stage3: 'Konversi Tegangan: Resistansi yang menurun menghasilkan kenaikan tegangan analog pada pin AO ke Arduino ADC.'
    },
    pins: [
      { name: 'VCC', type: 'VCC', description: 'Daya 5V DC (Wajib stabil untuk pemanas)', arduinoPin: '5V Pin Arduino' },
      { name: 'GND', type: 'GND', description: 'Ground pemanas dan sirkuit', arduinoPin: 'GND Pin Arduino' },
      { name: 'DO', type: 'DIGITAL', description: 'Output digital ambang batas alarm', arduinoPin: 'Pin Digital D4 Arduino' },
      { name: 'AO', type: 'ANALOG', description: 'Output analog pembacaan kadar ppm gas', arduinoPin: 'Pin Analog A1 Arduino' }
    ],
    anatomyImageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
    internalComponents: [
      {
        name: 'Sensor Tube SnO2 & Micro-Heater Coil',
        description: 'Tabung keramik Al2O3 terlapis SnO2 dengan kumparan koil pemanas nikel-kromium.',
        imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Jaring Pelindung Stainless Steel Double Layer',
        description: 'Pelindung tahan ledakan (anti-explosion flame arrestor mesh) dari baja tahan karat.',
        imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'IC Komparator LM393 & Potensiometer',
        description: 'Sirkuit ambang batas pembanding sinyal digital gas bocor dan penyesuai sensitivitas.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      }
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=6F1B_N6MXlE',
    simulationType: 'gas-flame'
  },
  {
    id: 'flame',
    name: 'Sensor Api / Flame Sensor',
    category: 'Gas & Bahaya',
    shortDescription: 'Sensor pendeteksi gelombang cahaya infra merah dari nyala api pembakaran (760nm - 1100nm) dalam sudut pandang 60°.',
    imageUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80',
    fullDefinition: 'Flame Sensor adalah modul pendeteksi api yang dirancang khusus untuk mendeteksi spektrum radiasi inframerah yang dipancarkan secara khas oleh reaksi pembakaran bahan hidrokarbon. Sangat umum digunakan pada robot pemadam api dan sistem peringatan bahaya kebakaran.',
    specifications: {
      operatingVoltage: '3.3V - 5V DC',
      measurementRange: 'Jarak deteksi api lilin hingga 80 cm - 1 meter',
      outputSignal: 'Digital DO (LOW aktif) & Analog AO (Tegangan berbanding intensitas)',
      accuracy: 'Spektrum respon 760 nm sampai 1100 nm',
      responseTime: 'Respon milidetik sangat instan'
    },
    workingPrinciple: 'Fotodioda penerima optik sensitif pada spektrum sempit inframerah api. Ketika radiasi api terdeteksi, arus balik mengalir melalui fotodioda sebanding dengan intensitas api dan jarak, kemudian diproses oleh komparator LM393.',
    mathFormula: 'Fluks Radiasi Api: E = I / d^2 (Hukum Kuadrat Terbalik Radiasi)',
    sensingStages: {
      stage1: 'Deteksi Emisi Spektral Api: Fotodioda mendeteksi radiasi api pada spektrum inframerah dekat 760-1100nm.',
      stage2: 'Amplifikasi Arus Foto: Perubahan arus diubah menjadi tegangan pada op-amp komparator LM393.',
      stage3: 'Trigger Arduino: Pin DO mengirim pulsa interupsi LOW ke Arduino untuk menyalakan buzzer atau pompa air.'
    },
    pins: [
      { name: 'VCC', type: 'VCC', description: 'Tegangan input 3.3V - 5V', arduinoPin: '5V Pin Arduino' },
      { name: 'GND', type: 'GND', description: 'Ground referensi', arduinoPin: 'GND Pin Arduino' },
      { name: 'DO', type: 'DIGITAL', description: 'Sinyal digital api terdeteksi', arduinoPin: 'Pin Digital D5 Arduino' },
      { name: 'AO', type: 'ANALOG', description: 'Sinyal analog intensitas radiasi api', arduinoPin: 'Pin Analog A2 Arduino' }
    ],
    anatomyImageUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80',
    internalComponents: [
      {
        name: 'High-Speed IR Photodiode (Filter Hitam)',
        description: 'Komponen semikonduktor optik peka panjang gelombang 760-1100nm spektrum api.',
        imageUrl: 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Potensiometer Kalibrasi Sensitivitas',
        description: 'Pengatur ambang batas jarak deteksi api agar tidak salah terpicu lampu ruangan.',
        imageUrl: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'IC LM393 & LED Indikator Status',
        description: 'Komparator komparasi tegangan dan indikator visual saat kobaran api tertangkap sensor.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      }
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=6F1B_N6MXlE',
    simulationType: 'gas-flame'
  },
  {
    id: 'hc-sr04',
    name: 'HC-SR04 / Sensor Jarak Ultrasonik',
    category: 'Jarak & Kecepatan',
    shortDescription: 'Modul pengukur jarak non-kontak berbasis gelombang suara ultrasonik 40kHz dengan rentang 2 cm hingga 400 cm.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    fullDefinition: 'HC-SR04 adalah modul sensor jarak ultrasonik yang memanfaatkan pantulan gelombang akustik frekuensi tinggi (40 kHz). Terdiri dari pemancar ultrasonik (Transmitter/Trigger), penerima (Receiver/Echo), dan sirkuit kontrol waktu presisi.',
    specifications: {
      operatingVoltage: '5V DC (Arus kerja ~15mA)',
      measurementRange: '2 cm hingga 400 cm (Resolusi 0.3 cm)',
      outputSignal: 'Pulsa Digital HIGH pada pin Echo dengan durasi waktu pantulan',
      accuracy: 'Akurasi pembacaan hingga 3 mm',
      responseTime: 'Siklus pengukuran periodik disarankan > 60 ms'
    },
    workingPrinciple: 'Mikrokontroler memicu pin Trigger dengan pulsa HIGH minimal 10µs. Sensor secara otomatis memancarkan 8 siklus gelombang 40kHz. Pin Echo berubah HIGH dan tetap HIGH hingga gelombang pantul diterima kembali oleh Receiver.',
    mathFormula: 'Jarak (cm) = (Durasi Waktu Echo dalam Mikrodetik * Kecepatan Suara 0.0343 cm/µs) / 2',
    sensingStages: {
      stage1: 'Pembangkitan Gelombang: Transduser piezoelektrik memancarkan semburan 8 pulsa akustik 40kHz ke udara.',
      stage2: 'Penerimaan Pantulan Gema: Transduser penerima mengubah tekanan gelombang pantul menjadi sinyal mikro-volt.',
      stage3: 'Perhitungan pulseIn Arduino: Mikrokontroler menghitung durasi HIGH pada pin Echo menggunakan fungsi pulseIn().'
    },
    pins: [
      { name: 'VCC', type: 'VCC', description: 'Catu daya positif 5V DC', arduinoPin: '5V Pin Arduino' },
      { name: 'Trig (Trigger)', type: 'DIGITAL', description: 'Pin input pemicu pulsa 10µs dari Arduino', arduinoPin: 'Pin Digital D9 Arduino' },
      { name: 'Echo', type: 'DIGITAL', description: 'Pin output pulsa lebar durasi pantulan gelombang', arduinoPin: 'Pin Digital D10 Arduino' },
      { name: 'GND', type: 'GND', description: 'Ground sirkuit', arduinoPin: 'GND Pin Arduino' }
    ],
    anatomyImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    internalComponents: [
      {
        name: 'Piezoelectric Transmitter 40kHz (T)',
        description: 'Kristal piezoelektrik yang berosilasi pada 40kHz mengubah energi listrik menjadi pulsa suara ultrasonik.',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Piezoelectric Receiver 40kHz (R)',
        description: 'Kristal piezoelektrik penangkap tekanan getaran suara pantul dan mengubahnya kembali menjadi tegangan listrik.',
        imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'IC Kontroler & Op-Amp LM324 / MAX232',
        description: 'Membangkitkan daya piezoelektrik tegangan tinggi dan mengamplifikasi sinyal gema pantul yang sangat lemah.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      }
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=6F1B_N6MXlE',
    simulationType: 'distance-slider'
  },
  {
    id: 'soil-moisture',
    name: 'Sensor Kelembapan Tanah / Soil Moisture',
    category: 'Lingkungan',
    shortDescription: 'Sensor probe pengukur kadar air tanah berbasis konduktivitas listrik antara dua elektroda terpapar tanah.',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    fullDefinition: 'Modul Soil Moisture menggunakan dua probe konduktif terbuka yang ditancapkan ke dalam tanah sebagai elektroda pembagi tegangan. Semakin banyak kandungan air dalam tanah, semakin tinggi konduktivitas tanah dan semakin rendah resistansinya.',
    specifications: {
      operatingVoltage: '3.3V - 5V DC',
      measurementRange: 'Tanah kering total (0%) hingga jenuh air (100%)',
      outputSignal: 'Analog AO (0-5V) & Digital DO (Komparator LM393)',
      accuracy: 'Relatif terhadap kepadatan dan jenis garam tanah',
      responseTime: 'Instan respon pembacaan arus'
    },
    workingPrinciple: 'Arus listrik dialirkan melalui elektroda probe tembaga. Air dalam tanah melarutkan elektrolit sehingga mempermudah aliran muatan. Tegangan jatuh pada probe diukur oleh pin analog Arduino.',
    mathFormula: 'Kadar Air (%) = Map (Nilai ADC Analog, Nilai Basah, Nilai Kering, 100, 0)',
    sensingStages: {
      stage1: 'Konduksi Ionik: Air dan ion dalam tanah menghantarkan arus listrik antara dua kaki elektroda.',
      stage2: 'Pengkondisian Sinyal Modul: Sirkuit pembagi tegangan dan komparator onboard memproses tegangan jatuh.',
      stage3: 'Konversi ADC Arduino: Arduino membaca analog 10-bit (0-1023) untuk menentukan kapan menyalakan pompa irigasi.'
    },
    pins: [
      { name: 'VCC', type: 'VCC', description: 'Catu daya modul 3.3V - 5V', arduinoPin: '5V Pin Arduino' },
      { name: 'GND', type: 'GND', description: 'Ground sirkuit', arduinoPin: 'GND Pin Arduino' },
      { name: 'DO', type: 'DIGITAL', description: 'Output digital ambang batas kering/basah', arduinoPin: 'Pin Digital D6 Arduino' },
      { name: 'AO', type: 'ANALOG', description: 'Output analog linier tingkat kebasahan tanah', arduinoPin: 'Pin Analog A3 Arduino' }
    ],
    anatomyImageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    internalComponents: [
      {
        name: 'Probe Elektroda Fork PCB',
        description: 'Kaki garpu pelat tembaga tahan karat yang ditancapkan ke media tanah pertanian.',
        imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'IC Komparator LM393',
        description: 'Menghasilkan logika DO aktif LOW saat tanah mencapai ambang kelembapan tertentu.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Trimpot Multi-turn Penyetel Batas',
        description: 'Penyetel kepekaan deteksi batas kelembaban tanah kering.',
        imageUrl: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=400&q=80'
      }
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=6F1B_N6MXlE',
    simulationType: 'analog-slider'
  },
  {
    id: 'raindrops',
    name: 'Sensor Hujan / Raindrops Sensor',
    category: 'Lingkungan',
    shortDescription: 'Sensor pelat deteksi rintik tetesan air hujan berbasis sirkuit jejak tembaga interdigital konduktif.',
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80',
    fullDefinition: 'Modul sensor hujan terdiri dari papan sirkuit bermotif sisir tembaga (interdigital trace board) terpisah dan modul pemroses LM393. Saat tetesan air hujan mengenai pelat, tetesan tersebut menghubungkan jalur-jalur konduktif dan menurunkan nilai hambatan sirkuit.',
    specifications: {
      operatingVoltage: '3.3V - 5V DC',
      measurementRange: 'Tanpa hujan (Kering) hingga Hujan deras berair penuh',
      outputSignal: 'Digital DO (Output switch) dan Analog AO (Tegangan kontinuitas)',
      accuracy: 'Sangat peka terhadap tetesan mikro air hujan',
      responseTime: '< 1 detik saat basah'
    },
    workingPrinciple: 'Pelat nikel dilapisi pola konduktor yang saling bersilangan tanpa bersentuhan langsung. Tetesan air hujan berfungsi sebagai konduktor penghubung yang mengalirkan arus listrik antara dua terminal konduktor.',
    mathFormula: 'V_AO = V_CC * (R_papan_basah / (R_papan_basah + R_pullup))',
    sensingStages: {
      stage1: 'Jembatan Tetes Air: Tetes air murni atau hujan menjadi jembatan resistif antar jalur interdigital.',
      stage2: 'Pengkondisian Modul: Penurunan resistansi menaikkan arus pada sirkuit detektor LM393.',
      stage3: 'Logika Arduino: Arduino mendeteksi tetesan air pertama untuk menutup atap otomatis atau mengaktifkan wiper.'
    },
    pins: [
      { name: 'VCC', type: 'VCC', description: 'Daya modul 3.3V - 5V', arduinoPin: '5V Pin Arduino' },
      { name: 'GND', type: 'GND', description: 'Ground sistem', arduinoPin: 'GND Pin Arduino' },
      { name: 'DO', type: 'DIGITAL', description: 'Output digital deteksi ada hujan (LOW)', arduinoPin: 'Pin Digital D11 Arduino' },
      { name: 'AO', type: 'ANALOG', description: 'Output analog intensitas lebatnya air hujan', arduinoPin: 'Pin Analog A4 Arduino' }
    ],
    anatomyImageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80',
    internalComponents: [
      {
        name: 'Raindrop Collector Board 5x4 cm',
        description: 'Pelat PCB pelapis nikel anti-oksidasi dengan pola sisir jejak konduktif ganda penangkap tetesan air.',
        imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Modul Kontroler LM393 & Trimpot',
        description: 'Papan pemroses konduktivitas sinyal menjadi level logika digital dan analog siap pakai.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Kabel Jumper Flat 2-Pin Modul',
        description: 'Kabel penghubung antara pelat deteksi dan board pemroses sinyal.',
        imageUrl: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=400&q=80'
      }
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=6F1B_N6MXlE',
    simulationType: 'analog-slider'
  },
  {
    id: 'sw420',
    name: 'SW-420 / Sensor Getaran (Vibration)',
    category: 'Getaran & Sentuh',
    shortDescription: 'Modul sensor getaran dan guncangan mekanik menggunakan pegas kontak sensitif internal untuk sistem alarm antimaling.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    fullDefinition: 'SW-420 adalah sensor switch getaran berdaya rendah tipe normal-tertutup (normally closed). Ketika dalam keadaan tenang tanpa guncangan, sakelar berada pada kondisi tertutup (konduktif). Ketika terkena guncangan atau benturan, pegas mekanis di dalamnya memantul dan membuka sirkuit sesaat.',
    specifications: {
      operatingVoltage: '3.3V - 5V DC',
      measurementRange: 'Getaran omnidirectional tanpa batasan sudut',
      outputSignal: 'Digital TTL (LOW saat tenang, pulsa HIGH saat terguncang)',
      accuracy: 'Sensitivitas tinggi dapat disetel via trimpot onboard',
      responseTime: '< 15 ms'
    },
    workingPrinciple: 'Di dalam tabung logam kecil terdapat kontak pegas sentuh. Guncangan inersial menyebabkan pegas terpisah dari pin sentral, menyebabkan penurunan arus sesaat yang dibaca oleh komparator LM393 menjadi pulsa logika HIGH.',
    mathFormula: 'Inersia Impuls: F = m * a > F_spring_preload',
    sensingStages: {
      stage1: 'Defleksi Mekanis: Gaya guncangan atau akselerasi menggerakkan massa pegas internal.',
      stage2: 'Transisi Logika On-Board: Putusnya kontak sesaat memicu pergantian tegangan komparator LM393.',
      stage3: 'Interupsi Arduino: Arduino mendeteksi transisi RISING edge untuk menghitung frekuensi getaran gempa atau sabotase.'
    },
    pins: [
      { name: 'VCC', type: 'VCC', description: 'Catu daya 3.3V - 5V DC', arduinoPin: '5V Pin Arduino' },
      { name: 'GND', type: 'GND', description: 'Ground referensi', arduinoPin: 'GND Pin Arduino' },
      { name: 'DO', type: 'DIGITAL', description: 'Output sinyal digital getaran', arduinoPin: 'Pin Digital D12 Arduino' }
    ],
    anatomyImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    internalComponents: [
      {
        name: 'Elemen Saklar Tabung Getaran SW-420',
        description: 'Tabung sakelar tertutup kedap udara tahan oksidasi berisi pegas konduktif sensitif terhadap inersia benturan.',
        imageUrl: 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'IC Komparator Tegangan LM393',
        description: 'Mengubah fluktuasi transien getaran menjadi gelombang persegi logika digital tajam.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Trimpot Kalibrasi Getaran',
        description: 'Penyetel kekakuan ambang batas sensitivitas deteksi getaran mekanis.',
        imageUrl: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=400&q=80'
      }
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=6F1B_N6MXlE',
    simulationType: 'motion-trigger'
  }
];

export const INITIAL_QUESTIONS: QuizQuestion[] = [
  // DHT11 Questions
  {
    id: 'q1',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Protokol komunikasi apa yang digunakan oleh modul sensor DHT11 untuk mengirimkan data ke Arduino?',
    options: [
      { key: 'A', text: 'I2C (Inter-Integrated Circuit)' },
      { key: 'B', text: 'SPI (Serial Peripheral Interface)' },
      { key: 'C', text: 'UART Serial RS-232' },
      { key: 'D', text: 'Single-Wire (1-Wire proprietary digital serial)' }
    ],
    correctAnswer: 'D',
    explanation: 'DHT11 menggunakan protokol komunikasi 1-Wire tunggal proprietary di mana data dikirim serial dalam bentuk paket 40-bit melalui satu jalur kabel data.'
  },
  {
    id: 'q2',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Berapakah rentang pengukuran suhu dan akurasi standar dari modul sensor DHT11?',
    options: [
      { key: 'A', text: '0 - 50°C dengan akurasi ±2°C' },
      { key: 'B', text: '-40°C s.d 125°C dengan akurasi ±0.5°C' },
      { key: 'C', text: '-20°C s.d 80°C dengan akurasi ±1°C' },
      { key: 'D', text: '25°C s.d 100°C dengan akurasi ±5°C' }
    ],
    correctAnswer: 'A',
    explanation: 'Modul DHT11 dirancang untuk rentang suhu ambient ruangan 0 - 50°C dengan toleransi akurasi pengukuran sebesar ±2°C.'
  },
  {
    id: 'q3',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Berapa total panjang bit data yang dikirimkan oleh sensor DHT11 dalam satu siklus pembacaan utuh?',
    options: [
      { key: 'A', text: '16 bit (2 byte)' },
      { key: 'B', text: '40 bit (5 byte)' },
      { key: 'C', text: '64 bit (8 byte)' },
      { key: 'D', text: '32 bit (4 byte)' }
    ],
    correctAnswer: 'B',
    explanation: 'Paket data DHT11 terdiri dari 40 bit (5 byte): Byte ke-1 & 2 kelembaban, Byte ke-3 & 4 suhu, dan Byte ke-5 adalah checksum validasi.'
  },
  {
    id: 'q4',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Komponen internal apa yang digunakan di dalam DHT11 untuk mengukur suhu secara fisik?',
    options: [
      { key: 'A', text: 'Termistor NTC (Negative Temperature Coefficient)' },
      { key: 'B', text: 'Termokopel Tipe K' },
      { key: 'C', text: 'Sensor Suhu Inframerah MLX90614' },
      { key: 'D', text: 'Resistor Logam Platinum RTD PT100' }
    ],
    correctAnswer: 'A',
    explanation: 'DHT11 menggunakan termistor NTC berbahan semikonduktor, di mana resistansinya menurun saat temperatur lingkungan mengalami peningkatan.'
  },
  {
    id: 'q5',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Mengapa pembacaan sensor DHT11 disarankan tidak dilakukan lebih cepat dari interval 1 detik (1 Hz)?',
    options: [
      { key: 'A', text: 'Karena waktu sampling dan respon elemen resistif memerlukan waktu stabilisasi minimal 1 detik' },
      { key: 'B', text: 'Karena pin Arduino akan mengalami korsleting jika terlalu cepat' },
      { key: 'C', text: 'Karena memori RAM Arduino Uno akan langsung penuh' },
      { key: 'D', text: 'Karena tegangan 5V akan drop drastis' }
    ],
    correctAnswer: 'A',
    explanation: 'Sensor DHT11 memiliki respon pemulihan termal dan higroskopis yang relatif lambat. Membaca lebih cepat dari 1 detik hanya akan menghasilkan data usang (stale data) atau kegagalan checksum.'
  },
  {
    id: 'dht-6',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Berapakah rentang pengukuran kelembapan udara relatif (RH) yang mampu dideteksi oleh sensor DHT11?',
    options: [
      { key: 'A', text: '20% - 90% RH' },
      { key: 'B', text: '0% - 100% RH' },
      { key: 'C', text: '50% - 60% RH saja' },
      { key: 'D', text: '10% - 40% RH' }
    ],
    correctAnswer: 'A',
    explanation: 'Sensor DHT11 memiliki rentang pengukuran kelembapan udara antara 20% hingga 90% RH dengan akurasi ±5% RH.'
  },
  {
    id: 'dht-7',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Berapakah nilai resistor pull-up yang lazim dipasang pada pin data modul sensor DHT11?',
    options: [
      { key: 'A', text: '4.7 kΩ hingga 10 kΩ' },
      { key: 'B', text: '1 Mega Ohm' },
      { key: 'C', text: '10 Ohm' },
      { key: 'D', text: '100 kΩ' }
    ],
    correctAnswer: 'A',
    explanation: 'Resistor pull-up berukuran 4.7kΩ sampai 10kΩ diperlukan untuk menjaga kestabilan sinyal bus komunikasi 1-Wire saat jalur idle.'
  },
  {
    id: 'dht-8',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Berapa durasi sinyal LOW yang harus dikirimkan mikrokontroler Arduino untuk memulai (start signal) pembacaan DHT11?',
    options: [
      { key: 'A', text: 'Minimal 18 milidetik' },
      { key: 'B', text: '1 menit penuh' },
      { key: 'C', text: '5 mikrodetik' },
      { key: 'D', text: '10 detik' }
    ],
    correctAnswer: 'A',
    explanation: 'Mikrokontroler harus menarik jalur data ke level LOW selama minimal 18 milidetik agar DHT11 mendeteksi sinyal start dari Arduino.'
  },
  {
    id: 'dht-9',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Bagaimana cara modul DHT11 membedakan bit logika 0 dan bit logika 1 pada transmisi data?',
    options: [
      { key: 'A', text: 'Berdasarkan durasi pulsa HIGH setelah sinyal LOW 50µs (26-28µs untuk bit 0, dan 70µs untuk bit 1)' },
      { key: 'B', text: 'Berdasarkan frekuensi gelombang radio yang berubah' },
      { key: 'C', text: 'Berdasarkan tinggi amplitudo tegangan 12 Volt' },
      { key: 'D', text: 'Berdasarkan perubahan warna pada bodi sensor' }
    ],
    correctAnswer: 'A',
    explanation: 'Setiap bit data diawali pulsa LOW selama 50µs. Durasi pulsa HIGH berikutnya menentukan nilai bit: 26-28µs bernilai logika 0, sedangkan 70µs bernilai logika 1.'
  },
  {
    id: 'dht-10',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Tegangan kerja yang aman untuk menyalakan modul sensor DHT11 adalah:',
    options: [
      { key: 'A', text: '3.3V hingga 5.5V DC' },
      { key: 'B', text: '12V hingga 24V AC' },
      { key: 'C', text: '220V PLN' },
      { key: 'D', text: '1.2V baterai jam' }
    ],
    correctAnswer: 'A',
    explanation: 'DHT11 beroperasi pada tegangan searah (DC) antara 3.3V hingga 5.5V, sehingga sangat fleksibel baik untuk mikrokontroler 3.3V (ESP32) maupun 5V (Arduino Uno).'
  },

  // DHT11 Additional 10 Questions (dht-11 to dht-20)
  {
    id: 'dht-11',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Berapakah jumlah pin fisik bawaan pada komponen sensor DHT11 sebelum dipasang pada papan modul breakout?',
    options: [
      { key: 'A', text: '4 pin (VCC, DATA, NC, GND)' },
      { key: 'B', text: '2 pin saja' },
      { key: 'C', text: '6 pin' },
      { key: 'D', text: '8 pin DIP' }
    ],
    correctAnswer: 'A',
    explanation: 'Komponen fisik DHT11 aslinya memiliki 4 pin: Pin 1 VCC, Pin 2 DATA, Pin 3 NC (Not Connected), dan Pin 4 GND.'
  },
  {
    id: 'dht-12',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Berapakah resolusi pembacaan data suhu dan kelembapan pada sensor DHT11?',
    options: [
      { key: 'A', text: 'Resolusi 8-bit (hanya nilai bilangan bulat / integer)' },
      { key: 'B', text: 'Resolusi 16-bit presisi tinggi 4 desimal' },
      { key: 'C', text: 'Resolusi 24-bit audio' },
      { key: 'D', text: 'Resolusi 32-bit' }
    ],
    correctAnswer: 'A',
    explanation: 'DHT11 hanya menyediakan data dengan resolusi 8-bit bulat (tanpa angka desimal bermakna, byte desimal biasanya 0) berbeda dengan DHT22 yang 16-bit.'
  },
  {
    id: 'dht-13',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Bagaimana cara memverifikasi bahwa data transmisi dari DHT11 tidak mengalami corrupt (rusak)?',
    options: [
      { key: 'A', text: 'Memeriksa apakah byte ke-5 sama dengan jumlahan 8-bit dari 4 byte data sebelumnya (Checksum)' },
      { key: 'B', text: 'Melihat kedipan lampu LED Arduino' },
      { key: 'C', text: 'Mengukur resistansi kabel dengan multimeter' },
      { key: 'D', text: 'Menghubungkan pin data langsung ke buzzer' }
    ],
    correctAnswer: 'A',
    explanation: 'Byte ke-5 adalah Checksum: (Byte1 + Byte2 + Byte3 + Byte4) & 0xFF harus bernilai sama persis dengan Byte5.'
  },
  {
    id: 'dht-14',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Library Arduino paling populer yang sering digunakan untuk membaca sensor DHT11 adalah:',
    options: [
      { key: 'A', text: 'DHT sensor library oleh Adafruit' },
      { key: 'B', text: 'Servo.h' },
      { key: 'C', text: 'LiquidCrystal_I2C.h' },
      { key: 'D', text: 'WiFi.h' }
    ],
    correctAnswer: 'A',
    explanation: 'Library DHT sensor library buatan Adafruit beserta Unified Sensor Driver merupakan library standar yang paling umum digunakan.'
  },
  {
    id: 'dht-15',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Berapakah konsumsi arus rata-rata modul DHT11 saat melakukan konversi data pengukuran?',
    options: [
      { key: 'A', text: 'Sekitar 0.5 mA s.d 2.5 mA' },
      { key: 'B', text: '5 Ampere' },
      { key: 'C', text: '500 mA' },
      { key: 'D', text: '10 Ampere' }
    ],
    correctAnswer: 'A',
    explanation: 'DHT11 merupakan sensor berdaya sangat rendah dengan konsumsi arus saat aktif sekitar 0.5 - 2.5 mA dan saat standby hanya 100-150 µA.'
  },
  {
    id: 'dht-16',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Apa fungsi utama lapisan polimer higroskopis di dalam sensor DHT11?',
    options: [
      { key: 'A', text: 'Menyerap uap air sehingga konstanta dielektrik dan konduktivitasnya berubah' },
      { key: 'B', text: 'Melindungi sensor dari sengatan petir' },
      { key: 'C', text: 'Menerangi ruangan dalam kondisi gelap' },
      { key: 'D', text: 'Mendinginkan sirkuit Arduino' }
    ],
    correctAnswer: 'A',
    explanation: 'Polimer higroskopis menyerap molekul air di udara sehingga konduktivitas dan kapasitansi resistifnya berubah proporsional terhadap kelembapan relatif.'
  },
  {
    id: 'dht-17',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Berapa jarak transmisi kabel maksimum yang direkomendasikan untuk modul DHT11 tanpa penguat sinyal?',
    options: [
      { key: 'A', text: 'Hingga sekitar 20 meter menggunakan kabel berkualitas baik' },
      { key: 'B', text: 'Maksimal 2 sentimeter saja' },
      { key: 'C', text: '100 kilometer' },
      { key: 'D', text: '500 meter' }
    ],
    correctAnswer: 'A',
    explanation: 'Dengan kabel twisted-pair dan resistor pull-up 4.7kΩ, sinyal 1-Wire DHT11 dapat mentransmisikan data hingga jarak 20 meter.'
  },
  {
    id: 'dht-18',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Apa arti nilai koefisien temperatur "NTC" pada termistor DHT11?',
    options: [
      { key: 'A', text: 'Nilai hambatan (resistansi) berkurang saat suhu naik' },
      { key: 'B', text: 'Nilai hambatan bertambah saat suhu naik' },
      { key: 'C', text: 'Sensor tidak peka terhadap perubahan suhu' },
      { key: 'D', text: 'Tegangan selalu tetap 0 Volt' }
    ],
    correctAnswer: 'A',
    explanation: 'NTC singkatan dari Negative Temperature Coefficient, artinya resistansinya berbanding terbalik dengan temperatur (makin panas makin kecil hambatannya).'
  },
  {
    id: 'dht-19',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Fungsi pull-up resistor pada pin data DHT11 adalah:',
    options: [
      { key: 'A', text: 'Menjaga level logika tetap HIGH saat kondisi idle dan menghindari kondisi floating' },
      { key: 'B', text: 'Menaikkan arus hingga 2 Ampere' },
      { key: 'C', text: 'Menurunkan tegangan menjadi negatif' },
      { key: 'D', text: 'Membuat sensor berkedip terus menerus' }
    ],
    correctAnswer: 'A',
    explanation: 'Jalur komunikasi 1-Wire open-drain memerlukan resistor pull-up agar tegangan bus berada pada level HIGH stabil ketika mikrokontroler atau sensor tidak menariknya ke LOW.'
  },
  {
    id: 'dht-20',
    sensorId: 'dht11',
    sensorName: 'DHT11 / Sensor Suhu & Kelembapan',
    question: 'Jika output pembacaan DHT11 di Serial Monitor menampilkan "nan" (Not a Number), penyebab umumnya adalah:',
    options: [
      { key: 'A', text: 'Kabel pin data longgar, pin Arduino salah, atau interval pembacaan terlalu cepat (< 1 detik)' },
      { key: 'B', text: 'Sensor membaca suhu di atas 1000 derajat Celcius' },
      { key: 'C', text: 'Ruangan terlalu berisik' },
      { key: 'D', text: 'Kabel USB komputer terbalik' }
    ],
    correctAnswer: 'A',
    explanation: 'Nilai "nan" menunjukkan mikrokontroler gagal menerima sinyal balasan acknowledge dari sensor atau interval pembacaan melanggar batas sampling 1 Hz.'
  },

  // PIR (Passive Infrared) Questions (10 Soal)
  {
    id: 'pir-1',
    sensorId: 'pir',
    sensorName: 'PIR (Passive Infrared / Sensor Gerak)',
    question: 'Mengapa sensor PIR disebut sebagai sensor "Pasif"?',
    options: [
      { key: 'A', text: 'Karena tidak memancarkan energi sendiri, melainkan hanya mendeteksi radiasi inframerah dari objek hidup luar' },
      { key: 'B', text: 'Karena sensor ini tidak memerlukan catu daya baterai sama sekali' },
      { key: 'C', text: 'Karena hanya bekerja saat mikrokontroler dimatikan' },
      { key: 'D', text: 'Karena hanya tersusun dari komponen pasif resistor' }
    ],
    correctAnswer: 'A',
    explanation: 'Kata "Pasif" berarti sensor tidak memancarkan cahaya atau gelombang inframerah sendiri, melainkan hanya menerima radiasi panas inframerah dari tubuh manusia/hewan.'
  },
  {
    id: 'pir-2',
    sensorId: 'pir',
    sensorName: 'PIR (Passive Infrared / Sensor Gerak)',
    question: 'Komponen optik berbentuk kubah putih yang menutupi elemen sensor PIR HC-SR501 adalah:',
    options: [
      { key: 'A', text: 'Lensa Fresnel' },
      { key: 'B', text: 'Kaca Prisma Bikonkaf' },
      { key: 'C', text: 'Filter Cermin Cekung' },
      { key: 'D', text: 'Polarisator Cahaya' }
    ],
    correctAnswer: 'A',
    explanation: 'Lensa Fresnel kubah putih membagi zona deteksi menjadi beberapa segmen faset untuk memfokuskan radiasi inframerah dari berbagai sudut hingga 120 derajat.'
  },
  {
    id: 'pir-3',
    sensorId: 'pir',
    sensorName: 'PIR (Passive Infrared / Sensor Gerak)',
    question: 'Chip IC pengolah sinyal yang terpasang pada modul sensor PIR HC-SR501 adalah:',
    options: [
      { key: 'A', text: 'BISS0001 (Micro Power PIR Motion Detector IC)' },
      { key: 'B', text: 'ATmega328P' },
      { key: 'C', text: 'NE555 Timer' },
      { key: 'D', text: 'LM7805' }
    ],
    correctAnswer: 'A',
    explanation: 'BISS0001 adalah IC komparator dan penguat khusus pengolah sinyal sensor gerak piroelektrik dengan konsumsi daya sangat rendah.'
  },
  {
    id: 'pir-4',
    sensorId: 'pir',
    sensorName: 'PIR (Passive Infrared / Sensor Gerak)',
    question: 'Berapa jarak jangkauan deteksi objek yang dapat disetel pada modul PIR HC-SR501?',
    options: [
      { key: 'A', text: 'Sekitar 3 hingga 7 meter' },
      { key: 'B', text: '50 hingga 100 meter' },
      { key: 'C', text: 'Hanya 5 sentimeter' },
      { key: 'D', text: '1 kilometer' }
    ],
    correctAnswer: 'A',
    explanation: 'Dengan memutar trimpot sensitivitas (Sx), jarak deteksi PIR HC-SR501 dapat diatur antara 3 meter sampai dengan 7 meter.'
  },
  {
    id: 'pir-5',
    sensorId: 'pir',
    sensorName: 'PIR (Passive Infrared / Sensor Gerak)',
    question: 'Berapa tegangan output pada pin OUT sensor PIR HC-SR501 saat terdeteksi pergerakan objek?',
    options: [
      { key: 'A', text: 'Logika HIGH 3.3V TTL' },
      { key: 'B', text: '12V DC' },
      { key: 'C', text: '220V AC' },
      { key: 'D', text: '0V LOW konstan' }
    ],
    correctAnswer: 'A',
    explanation: 'Modul PIR memiliki regulator internal 3.3V, sehingga pin OUT mengeluarkan sinyal logika HIGH sebesar 3.3V yang kompatibel dengan Arduino (5V) maupun ESP32 (3.3V).'
  },
  {
    id: 'pir-6',
    sensorId: 'pir',
    sensorName: 'PIR (Passive Infrared / Sensor Gerak)',
    question: 'Dua buah potensiometer (trimpot) pada papan PCB PIR HC-SR501 berfungsi untuk mengatur:',
    options: [
      { key: 'A', text: 'Sensitivitas (jarak jangkauan) dan Delay Time (durasi sinyal aktif)' },
      { key: 'B', text: 'Volume audio dan kontras layar' },
      { key: 'C', text: 'Frekuensi radio dan bandwidth' },
      { key: 'D', text: 'Kecepatan clock CPU Arduino' }
    ],
    correctAnswer: 'A',
    explanation: 'Dua trimpot pada modul PIR digunakan untuk menyetel sensitivitas jarak (3-7 meter) dan durasi penundaan pulsa output HIGH (0.3 s.d 18 detik).'
  },
  {
    id: 'pir-7',
    sensorId: 'pir',
    sensorName: 'PIR (Passive Infrared / Sensor Gerak)',
    question: 'Jumper mode "H" (Repeat Trigger) pada modul sensor PIR HC-SR501 berarti:',
    options: [
      { key: 'A', text: 'Output tetap HIGH selama objek masih terus bergerak di area deteksi' },
      { key: 'B', text: 'Output langsung mati permanen saat ada gerakan' },
      { key: 'C', text: 'Sensor hanya merespons sekali seumur hidup' },
      { key: 'D', text: 'Sensor memancarkan gelombang ultrasound' }
    ],
    correctAnswer: 'A',
    explanation: 'Mode Repeat Trigger (posisi H) memperpanjang status HIGH selama ada pergerakan terus menerus di depan sensor.'
  },
  {
    id: 'pir-8',
    sensorId: 'pir',
    sensorName: 'PIR (Passive Infrared / Sensor Gerak)',
    question: 'Material kristal apa yang umumnya digunakan pada elemen piroelektrik penerima radiasi PIR?',
    options: [
      { key: 'A', text: 'Lithium Tantalate (LiTaO3) atau Keramik PZT' },
      { key: 'B', text: 'Kaca silika biasa' },
      { key: 'C', text: 'Besi galvanis' },
      { key: 'D', text: 'Aluminium foil' }
    ],
    correctAnswer: 'A',
    explanation: 'Elemen piroelektrik terbuat dari material kristal khusus seperti Lithium Tantalate yang menghasilkan muatan listrik piezo/piroelektrik saat terkena radiasi panas.'
  },
  {
    id: 'pir-9',
    sensorId: 'pir',
    sensorName: 'PIR (Passive Infrared / Sensor Gerak)',
    question: 'Mengapa sensor PIR memerlukan waktu pemanasan (warm-up / kalibrasi awal) sekitar 30-60 detik saat pertama kali dinyalakan?',
    options: [
      { key: 'A', text: 'Untuk menstabilkan pembacaan termal lingkungan sekitar dan meredam fluktuasi muatan kristal' },
      { key: 'B', text: 'Karena kabel tembaga butuh dipanaskan hingga membara' },
      { key: 'C', text: 'Menunggu Arduino merestart 10 kali' },
      { key: 'D', text: 'Agar lensa kubah putih memuai' }
    ],
    correctAnswer: 'A',
    explanation: 'Saat power-up, sirkuit penguat op-amp dan kristal piroelektrik memerlukan waktu stabilisasi background baseline sekitar 30-60 detik.'
  },
  {
    id: 'pir-10',
    sensorId: 'pir',
    sensorName: 'PIR (Passive Infrared / Sensor Gerak)',
    question: 'Aplikasi nyata paling umum dari penggunaan sensor PIR dalam kehidupan sehari-hari adalah:',
    options: [
      { key: 'A', text: 'Lampu otomatis penerangan lorong & alarm keamanan anti-maling' },
      { key: 'B', text: 'Mengukur kelembapan air tanah' },
      { key: 'C', text: 'Mendeteksi kebocoran gas LPG' },
      { key: 'D', text: 'Menimbang berat muatan truk' }
    ],
    correctAnswer: 'A',
    explanation: 'PIR sangat luas dipakai untuk saklar lampu otomatis hemat energi dan sensor alarm pendeteksi penyusup/gerakan manusia.'
  },

  // IR Obstacle Sensor Questions (10 Soal)
  {
    id: 'ir-1',
    sensorId: 'ir-obstacle',
    sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
    question: 'Berapakah pinout antarmuka standar pada modul sensor IR Obstacle?',
    options: [
      { key: 'A', text: '3 pin: VCC, GND, dan OUT (Digital)' },
      { key: 'B', text: '8 pin paralel' },
      { key: 'C', text: '1 pin saja' },
      { key: 'D', text: '4 pin analog differential' }
    ],
    correctAnswer: 'A',
    explanation: 'Modul sensor halangan IR standar memiliki 3 pin utama: VCC (3.3V-5V), GND (Ground), dan OUT (output sinyal digital).'
  },
  {
    id: 'ir-2',
    sensorId: 'ir-obstacle',
    sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
    question: 'Dua komponen LED optik di bagian depan sensor IR Obstacle masing-masing berfungsi sebagai:',
    options: [
      { key: 'A', text: 'LED Pemancar IR (Transmitter) dan Fotodioda Penerima IR (Receiver)' },
      { key: 'B', text: 'LED Merah dan LED Biru dekoratif' },
      { key: 'C', text: 'Lampu flash kamera dan senter' },
      { key: 'D', text: 'Laser penunjuk arah dan fototransistor radio' }
    ],
    correctAnswer: 'A',
    explanation: 'Satu LED bening memancarkan berkas gelombang inframerah, sedangkan fotodioda hitam di sebelahnya menangkap pantulan radiasi inframerah dari objek di depannya.'
  },
  {
    id: 'ir-3',
    sensorId: 'ir-obstacle',
    sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
    question: 'Logika output pada pin OUT modul IR Obstacle ketika mendeteksi adanya halangan objek adalah:',
    options: [
      { key: 'A', text: 'Aktif LOW (logika 0V) dan LED indikator menyala' },
      { key: 'B', text: 'Logika 12V AC' },
      { key: 'C', text: 'Tegangan mengambang tak terukur' },
      { key: 'D', text: 'Sinyal frekuensi 5 GHz' }
    ],
    correctAnswer: 'A',
    explanation: 'Mayoritas modul IR Obstacle beroperasi aktif LOW: saat ada pantulan halangan terdeteksi, pin OUT menghasilkan tegangan 0V (LOW) dan LED indikator hijau/merah menyala.'
  },
  {
    id: 'ir-4',
    sensorId: 'ir-obstacle',
    sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
    question: 'Apa fungsi utama IC komparator LM393 pada modul IR Obstacle?',
    options: [
      { key: 'A', text: 'Membandingkan tegangan fotodioda dengan tegangan referensi trimpot untuk menghasilkan output digital biner' },
      { key: 'B', text: 'Menyimpan program sketch Arduino' },
      { key: 'C', text: 'Mengubah sinyal menjadi frekuensi audio MP3' },
      { key: 'D', text: 'Mengatur waktu penanggalan RTC' }
    ],
    correctAnswer: 'A',
    explanation: 'IC komparator LM393 membandingkan level tegangan analog hasil pantulan cahaya IR dengan ambang batas (threshold) dari potensiometer menjadi logika HIGH/LOW.'
  },
  {
    id: 'ir-5',
    sensorId: 'ir-obstacle',
    sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
    question: 'Mengapa objek berwarna hitam pekat lebih sulit dideteksi oleh sensor IR Obstacle dibandingkan objek putih terang?',
    options: [
      { key: 'A', text: 'Warna hitam menyerap hampir seluruh spektrum inframerah sehingga intensitas pantulan sangat rendah' },
      { key: 'B', text: 'Warna hitam membakar sensor optik' },
      { key: 'C', text: 'Warna hitam membalikkan kutub polaritas listrik' },
      { key: 'D', text: 'Karena sensor hanya diprogram membaca warna putih' }
    ],
    correctAnswer: 'A',
    explanation: 'Permukaan berwarna hitam menyerap radiasi inframerah dan memantulkannya sangat sedikit, sedangkan permukaan putih memantulkan sebagian besar cahaya kembali ke fotodioda.'
  },
  {
    id: 'ir-6',
    sensorId: 'ir-obstacle',
    sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
    question: 'Berapakah jarak deteksi umum yang efektif untuk modul sensor IR Obstacle?',
    options: [
      { key: 'A', text: '2 cm hingga 30 cm' },
      { key: 'B', text: '10 meter hingga 50 meter' },
      { key: 'C', text: '1 kilometer' },
      { key: 'D', text: '0.1 milimeter' }
    ],
    correctAnswer: 'A',
    explanation: 'Modul rintangan IR jarak dekat memiliki rentang efektif antara 2 cm hingga 30 cm tergantung pantulan warna dan setelan trimpot.'
  },
  {
    id: 'ir-7',
    sensorId: 'ir-obstacle',
    sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
    question: 'Bagaimana pengaruh paparan terik sinar matahari langsung terhadap sensor IR Obstacle?',
    options: [
      { key: 'A', text: 'Menyebabkan saturasi fotodioda (false trigger) karena sinar matahari mengandung banyak spektrum inframerah' },
      { key: 'B', text: 'Membuat sensor bekerja 10 kali lebih cepat' },
      { key: 'C', text: 'Tidak ada pengaruh sama sekali' },
      { key: 'D', text: 'Menaikkan efisiensi daya baterai' }
    ],
    correctAnswer: 'A',
    explanation: 'Cahaya matahari kaya akan spektrum IR alami yang akan menjenuhkan fotodioda sehingga sensor mengira selalu ada halangan di depannya.'
  },
  {
    id: 'ir-8',
    sensorId: 'ir-obstacle',
    sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
    question: 'Robotika jenis apa yang paling banyak menggunakan modul sensor IR Obstacle?',
    options: [
      { key: 'A', text: 'Robot Penghindar Halangan (Obstacle Avoidance Robot) dan Robot Pengikut Dinding' },
      { key: 'B', text: 'Drone penyelam bawah laut' },
      { key: 'C', text: 'Satelit luar angkasa' },
      { key: 'D', text: 'Pembangkit listrik tenaga nuklir' }
    ],
    correctAnswer: 'A',
    explanation: 'Robot obstacle avoidance menggunakan sensor IR di bagian bemper depan untuk mendeteksi dinding atau rintangan agar dapat berbelok otomatis.'
  },
  {
    id: 'ir-9',
    sensorId: 'ir-obstacle',
    sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
    question: 'Tegangan operasional DC yang aman untuk mencatu modul IR Obstacle adalah:',
    options: [
      { key: 'A', text: '3.3V hingga 5V DC' },
      { key: 'B', text: '24V hingga 48V DC' },
      { key: 'C', text: '110V AC' },
      { key: 'D', text: '0.5V DC' }
    ],
    correctAnswer: 'A',
    explanation: 'Modul ini dirancang dengan rentang tegangan catu daya 3.3V sampai 5V DC yang sangat ramah terhadap mikrokontroler Arduino Uno, Nano, maupun ESP8266/ESP32.'
  },
  {
    id: 'ir-10',
    sensorId: 'ir-obstacle',
    sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
    question: 'Fungsi instruksi Arduino `digitalRead(pinIR)` untuk membaca sensor IR Obstacle adalah:',
    options: [
      { key: 'A', text: 'Membaca kondisi logika HIGH atau LOW dari pin digital sensor' },
      { key: 'B', text: 'Mengukur sudut kemiringan sensor dalam satuan derajat' },
      { key: 'C', text: 'Menghitung berat objek halangan' },
      { key: 'D', text: 'Menyalakan motor servo secara otomatis' }
    ],
    correctAnswer: 'A',
    explanation: 'Fungsi digitalRead membaca status logika biner pin mikrokontroler, menghasilkan LOW ketika objek terdeteksi dan HIGH ketika tidak ada halangan.'
  },

  // LDR (Light Dependent Resistor) Questions (10 Soal)
  {
    id: 'ldr-1',
    sensorId: 'ldr',
    sensorName: 'LDR (Light Dependent Resistor / Sensor Cahaya)',
    question: 'Bagaimana karakteristik nilai resistansi LDR terhadap intensitas cahaya yang mengenainya?',
    options: [
      { key: 'A', text: 'Semakin terang cahaya, nilai resistansi LDR semakin kecil (turun)' },
      { key: 'B', text: 'Semakin terang cahaya, nilai resistansi LDR semakin besar' },
      { key: 'C', text: 'Resistansi LDR selalu konstan 1 kΩ tidak peduli intensitas cahaya' },
      { key: 'D', text: 'Resistansinya berfluktuasi secara acak' }
    ],
    correctAnswer: 'A',
    explanation: 'LDR memiliki karakteristik fotokonduktif: foton cahaya mengeksitasi elektron ke pita konduksi sehingga hambatan listriknya turun drastis di tempat terang.'
  },
  {
    id: 'ldr-2',
    sensorId: 'ldr',
    sensorName: 'LDR (Light Dependent Resistor / Sensor Cahaya)',
    question: 'Bahan semikonduktor utama yang umum dipakai untuk membuat permukaan bergelombang pada LDR adalah:',
    options: [
      { key: 'A', text: 'Kadmium Sulfida (CdS)' },
      { key: 'B', text: 'Tembaga murni' },
      { key: 'C', text: 'Besi tuang' },
      { key: 'D', text: 'Karet isolator' }
    ],
    correctAnswer: 'A',
    explanation: 'Permukaan zig-zag pada fotoresistor LDR menggunakan material semikonduktor Kadmium Sulfida (CdS) yang peka terhadap spektrum cahaya tampak.'
  },
  {
    id: 'ldr-3',
    sensorId: 'ldr',
    sensorName: 'LDR (Light Dependent Resistor / Sensor Cahaya)',
    question: 'Dalam rangkaian bersama Arduino, mengapa LDR harus dirangkai secara seri dengan resistor tetap membentuk "Pembagi Tegangan" (Voltage Divider)?',
    options: [
      { key: 'A', text: 'Agar perubahan resistansi LDR dapat dikonversi menjadi perubahan tegangan analog (Volt) yang bisa dibaca ADC' },
      { key: 'B', text: 'Untuk membuat LDR menyala terang di malam hari' },
      { key: 'C', text: 'Untuk mencegah korsleting pada kabel USB komputer' },
      { key: 'D', text: 'Agar Arduino tidak membutuhkan program software' }
    ],
    correctAnswer: 'A',
    explanation: 'Mikrokontroler hanya bisa membaca tegangan (Volt) melalui pin ADC (A0-A5), bukan hambatan langsung. Rangkaian voltage divider mengubah ΔR menjadi ΔV.'
  },
  {
    id: 'ldr-4',
    sensorId: 'ldr',
    sensorName: 'LDR (Light Dependent Resistor / Sensor Cahaya)',
    question: 'Jika LDR berada di ruangan yang gelap gulita (tanpa cahaya), berapa perkiraan besar resistansinya?',
    options: [
      { key: 'A', text: 'Sangat besar, berkisar antara 1 Mega Ohm (1 MΩ) hingga 10 MΩ' },
      { key: 'B', text: 'Hampir 0 Ohm (seperti kawat tembaga)' },
      { key: 'C', text: 'Tepat 10 Ohm' },
      { key: 'D', text: 'Negatif 500 Ohm' }
    ],
    correctAnswer: 'A',
    explanation: 'Dalam kondisi gelap pekat (dark resistance), nilai hambatan fotoresistor melonjak hingga orde Mega Ohm (MΩ).'
  },
  {
    id: 'ldr-5',
    sensorId: 'ldr',
    sensorName: 'LDR (Light Dependent Resistor / Sensor Cahaya)',
    question: 'Modul sensor LDR yang memiliki 4 pin (AO, DO, VCC, GND) menyediakan dua jenis output, yaitu:',
    options: [
      { key: 'A', text: 'Analog Output (AO) untuk nilai kontinu intensitas & Digital Output (DO) untuk batas ambang gelap/terang' },
      { key: 'B', text: 'Audio Output dan Video Output' },
      { key: 'C', text: 'Arus searah dan arus bolak balik' },
      { key: 'D', text: 'Clock dan Data I2C' }
    ],
    correctAnswer: 'A',
    explanation: 'Pin AO mengeluarkan tegangan analog sebanding dengan cahaya, sedangkan pin DO mengeluarkan logika digital HIGH/LOW hasil komparasi LM393.'
  },
  {
    id: 'ldr-6',
    sensorId: 'ldr',
    sensorName: 'LDR (Light Dependent Resistor / Sensor Cahaya)',
    question: 'Berapakah rentang pembacaan nilai fungsi `analogRead()` pada pin ADC Arduino Uno (10-bit) saat membaca output LDR?',
    options: [
      { key: 'A', text: '0 hingga 1023' },
      { key: 'B', text: '0 hingga 255' },
      { key: 'C', text: '-50 hingga +50' },
      { key: 'D', text: '1 hingga 100 persen' }
    ],
    correctAnswer: 'A',
    explanation: 'ADC 10-bit pada mikrokontroler Arduino Uno membagi tegangan referensi 0-5V menjadi 2^10 rentang integer, yaitu 0 hingga 1023.'
  },
  {
    id: 'ldr-7',
    sensorId: 'ldr',
    sensorName: 'LDR (Light Dependent Resistor / Sensor Cahaya)',
    question: 'Contoh penerapan teknologi berbasis LDR yang paling sering ditemui di fasilitas umum adalah:',
    options: [
      { key: 'A', text: 'Lampu Penerangan Jalan Umum (PJU) otomatis menyala saat petang' },
      { key: 'B', text: 'Sensor kebocoran tabung gas elpiji' },
      { key: 'C', text: 'Rem otomatis kereta cepat' },
      { key: 'D', text: 'Pengukur kadar garam air laut' }
    ],
    correctAnswer: 'A',
    explanation: 'Lampu PJU otomatis menggunakan LDR untuk mendeteksi saat matahari terbenam (gelap) sehingga saklar relay langsung menyalakan lampu jalanan.'
  },
  {
    id: 'ldr-8',
    sensorId: 'ldr',
    sensorName: 'LDR (Light Dependent Resistor / Sensor Cahaya)',
    question: 'Berapakah nilai resistor pull-down atau pull-up yang lazim dipasangkan secara seri dengan LDR pada breadboard?',
    options: [
      { key: 'A', text: '10 kΩ' },
      { key: 'B', text: '1 Ohm' },
      { key: 'C', text: '100 Mega Ohm' },
      { key: 'D', text: '0.001 Ohm' }
    ],
    correctAnswer: 'A',
    explanation: 'Resistor 10 kΩ memberikan rentang pembagian tegangan yang paling linear dan dinamis terhadap perubahan nilai resistansi LDR pada cahaya ruangan normal.'
  },
  {
    id: 'ldr-9',
    sensorId: 'ldr',
    sensorName: 'LDR (Light Dependent Resistor / Sensor Cahaya)',
    question: 'Faktor apa yang dapat memengaruhi akurasi sensor LDR di ruangan terbuka?',
    options: [
      { key: 'A', text: 'Bayangan objek, debu yang menutupi permukaan CdS, dan sudut datang cahaya matahari' },
      { key: 'B', text: 'Gelombang radio WiFi' },
      { key: 'C', text: 'Koneksi bluetooth ponsel' },
      { key: 'D', text: 'Suara musik berfrekuensi bass' }
    ],
    correctAnswer: 'A',
    explanation: 'Sebagai sensor optik pasif, kebersihan lensa permukaan CdS dan sudut jatuhnya bayangan sangat menentukan jumlah foton yang diserap LDR.'
  },
  {
    id: 'ldr-10',
    sensorId: 'ldr',
    sensorName: 'LDR (Light Dependent Resistor / Sensor Cahaya)',
    question: 'Untuk membuat sistem pelacak matahari (solar tracker), berapa jumlah minimal sensor LDR yang umumnya dipasang bersebelahan?',
    options: [
      { key: 'A', text: '2 atau 4 buah LDR dengan sekat pemisah bayangan' },
      { key: 'B', text: '100 buah LDR' },
      { key: 'C', text: 'Cukup 0 buah LDR' },
      { key: 'D', text: '1 buah LDR tanpa sekat' }
    ],
    correctAnswer: 'A',
    explanation: 'Dual-axis solar tracker menggunakan 4 sensor LDR (atas, bawah, kiri, kanan) yang dipisahkan sekat bayangan silang untuk membandingkan intensitas cahaya.'
  },

  // MQ-2 Gas & Smoke Questions (10 Soal)
  {
    id: 'mq2-1',
    sensorId: 'mq2',
    sensorName: 'MQ-2 / Sensor Gas & Asap',
    question: 'Material oksida logam apa yang menjadi bahan lapisan sensitif utama pada tabung sensor MQ-2?',
    options: [
      { key: 'A', text: 'Timah Dioksida (SnO2)' },
      { key: 'B', text: 'Tembaga Sulfat' },
      { key: 'C', text: 'Baja anti karat' },
      { key: 'D', text: 'Kalsium Karbonat' }
    ],
    correctAnswer: 'A',
    explanation: 'Lapisan SnO2 memiliki konduktivitas rendah di udara bersih, namun konduktivitasnya meningkat tajam saat terpapar gas pereduksi (LPG, propana, metana, asap).'
  },
  {
    id: 'mq2-2',
    sensorId: 'mq2',
    sensorName: 'MQ-2 / Sensor Gas & Asap',
    question: 'Mengapa bodi sensor MQ-2 terasa hangat atau panas saat sedang dihidupkan?',
    options: [
      { key: 'A', text: 'Karena di dalamnya terdapat kumparan pemanas mikro (micro-heater) yang memanaskan tabung ke suhu kerja 200-300°C' },
      { key: 'B', text: 'Karena sensor mengalami korsleting listrik' },
      { key: 'C', text: 'Karena kabel VCC terpasang terbalik' },
      { key: 'D', text: 'Karena sensor terbakar' }
    ],
    correctAnswer: 'A',
    explanation: 'Kumparan pemanas (heater) nikel-kromium diperlukan untuk mengaktifkan reaksi penyerapan oksigen pada permukaan SnO2.'
  },
  {
    id: 'mq2-3',
    sensorId: 'mq2',
    sensorName: 'MQ-2 / Sensor Gas & Asap',
    question: 'Jenis gas apa saja yang sensitif dan mampu dideteksi oleh sensor MQ-2?',
    options: [
      { key: 'A', text: 'LPG, Propana, Butana, Metana, Hidrogen, dan partikel asap pembakaran' },
      { key: 'B', text: 'Oksigen murni saja' },
      { key: 'C', text: 'Hanya gas nitrogen cair' },
      { key: 'D', text: 'Uap air tawar saja' }
    ],
    correctAnswer: 'A',
    explanation: 'MQ-2 adalah sensor gas serbaguna keluarga semikonduktor elektrokimia dengan sensitivitas tinggi terhadap gas hidrokarbon mudah terbakar dan asap rokok/kebakaran.'
  },
  {
    id: 'mq2-4',
    sensorId: 'mq2',
    sensorName: 'MQ-2 / Sensor Gas & Asap',
    question: 'Berapakah tegangan catu daya kerja yang dibutuhkan oleh pemanas (heater) internal MQ-2?',
    options: [
      { key: 'A', text: '5.0V DC (±0.1V)' },
      { key: 'B', text: '24V AC' },
      { key: 'C', text: '1.2V DC' },
      { key: 'D', text: '220V PLN' }
    ],
    correctAnswer: 'A',
    explanation: 'Heater MQ-2 memerlukan tegangan 5V DC dengan konsumsi daya sekitar 800-900 mW untuk mempertahankan suhu kerja yang optimal.'
  },
  {
    id: 'mq2-5',
    sensorId: 'mq2',
    sensorName: 'MQ-2 / Sensor Gas & Asap',
    question: 'Mengapa sensor MQ-2 baru yang pertama kali dinyalakan membutuhkan waktu pre-heating (pemanasan awal) hingga 24 jam?',
    options: [
      { key: 'A', text: 'Untuk membakar habis residu uap lembap dan kontaminan kimia yang menempel pada lapisan SnO2 selama penyimpanan di pabrik' },
      { key: 'B', text: 'Untuk mengisi baterai internal sensor' },
      { key: 'C', text: 'Untuk mengunduh firmware terbaru' },
      { key: 'D', text: 'Agar lampu LED modul berubah warna' }
    ],
    correctAnswer: 'A',
    explanation: 'Proses burn-in atau preheating membakar residu kelembapan sehingga kurva resistansi sensor kembali stabil sesuai karakteristik pabrik.'
  },
  {
    id: 'mq2-6',
    sensorId: 'mq2',
    sensorName: 'MQ-2 / Sensor Gas & Asap',
    question: 'Ketika terdeteksi kebocoran gas LPG yang semakin pekat di dekat sensor MQ-2, bagaimana respon tegangan pada pin Analog Output (AO)?',
    options: [
      { key: 'A', text: 'Tegangan pada pin AO akan meningkat naik mendekati 5V' },
      { key: 'B', text: 'Tegangan turun menjadi 0 Volt' },
      { key: 'C', text: 'Tegangan berubah menjadi arus bolak balik (AC)' },
      { key: 'D', text: 'Tegangan hilang sama sekali' }
    ],
    correctAnswer: 'A',
    explanation: 'Konduktivitas SnO2 naik saat ada gas, menurunkan hambatan Rs sensor sehingga tegangan output pada pin AO naik proporsional dengan konsentrasi gas.'
  },
  {
    id: 'mq2-7',
    sensorId: 'mq2',
    sensorName: 'MQ-2 / Sensor Gas & Asap',
    question: 'Fungsi jaring pelindung berbahan stainless steel rangkap ganda pada sensor MQ-2 adalah:',
    options: [
      { key: 'A', text: 'Mencegah terjadinya ledakan percikan api dari koil pemanas (anti-explosion flame arrestor)' },
      { key: 'B', text: 'Menghindari debu berukuran besar saja' },
      { key: 'C', text: 'Sebagai antena sinyal radio' },
      { key: 'D', text: 'Sebagai pendingin radiator' }
    ],
    correctAnswer: 'A',
    explanation: 'Jaring stainless steel ganda berfungsi sebagai flame arrestor untuk memastikan suhu tinggi heater di dalam tidak memicu ledakan saat berada di ruangan penuh gas bocor.'
  },
  {
    id: 'mq2-8',
    sensorId: 'mq2',
    sensorName: 'MQ-2 / Sensor Gas & Asap',
    question: 'Rentang konsentrasi gas LPG yang mampu dideteksi oleh sensor MQ-2 adalah sekitar:',
    options: [
      { key: 'A', text: '200 ppm hingga 10000 ppm (parts per million)' },
      { key: 'B', text: '0.001 ppm' },
      { key: 'C', text: '100% konsentrasi murni' },
      { key: 'D', text: '500000 ppm' }
    ],
    correctAnswer: 'A',
    explanation: 'Sensitivitas standar MQ-2 untuk LPG dan propana berada pada rentang 200 hingga 10.000 ppm.'
  },
  {
    id: 'mq2-9',
    sensorId: 'mq2',
    sensorName: 'MQ-2 / Sensor Gas & Asap',
    question: 'Bagaimana cara mengatur batas kepekaan alarm bunyi pada pin Digital Output (DO) modul MQ-2?',
    options: [
      { key: 'A', text: 'Memutar baut potensiometer trimmer yang terpasang di bagian belakang modul' },
      { key: 'B', text: 'Mengganti kabel USB komputer' },
      { key: 'C', text: 'Meniup lubang sensor dengan kencang' },
      { key: 'D', text: 'Menekan tombol reset pada Arduino' }
    ],
    correctAnswer: 'A',
    explanation: 'Potensiometer onboard mengatur tegangan pembanding komparator LM393 sehingga titik picu pin DO dapat diatur pada tingkat kepulan gas yang diinginkan.'
  },
  {
    id: 'mq2-10',
    sensorId: 'mq2',
    sensorName: 'MQ-2 / Sensor Gas & Asap',
    question: 'Aplikasi sistem keselamatan apa yang paling cocok memanfaatkan sensor MQ-2?',
    options: [
      { key: 'A', text: 'Detektor kebocoran tabung gas elpiji dapur dan pendeteksi dini asap kebakaran' },
      { key: 'B', text: 'Pengukur kecepatan angin' },
      { key: 'C', text: 'Pengukur ketinggian air waduk' },
      { key: 'D', text: 'Sensor pembaca sidik jari' }
    ],
    correctAnswer: 'A',
    explanation: 'MQ-2 sangat tepat untuk sistem Smart Home pencegah kebakaran dini dan detektor kebocoran gas LPG pada kompor dapur.'
  },

  // Flame Sensor Questions (10 Soal)
  {
    id: 'flame-1',
    sensorId: 'flame',
    sensorName: 'Sensor Api / Flame Sensor',
    question: 'Berapakah rentang panjang gelombang spektrum optik yang direspon secara spesifik oleh Flame Sensor?',
    options: [
      { key: 'A', text: '760 nm hingga 1100 nm (spektrum inframerah nyala api)' },
      { key: 'B', text: '10 nm hingga 100 nm (sinar ultraviolet vakum)' },
      { key: 'C', text: '1 meter hingga 10 meter (gelombang FM)' },
      { key: 'D', text: '300 nm hingga 400 nm' }
    ],
    correctAnswer: 'A',
    explanation: 'Panjang gelombang 760 nm s.d 1100 nm adalah spektrum inframerah khas emisi pembakaran hidrokarbon api lilin, korek api, maupun kompor gas.'
  },
  {
    id: 'flame-2',
    sensorId: 'flame',
    sensorName: 'Sensor Api / Flame Sensor',
    question: 'Komponen optik berwarna hitam berbentuk kubah di ujung modul Flame Sensor adalah:',
    options: [
      { key: 'A', text: 'Fotodioda Inframerah berfilter optik hitam' },
      { key: 'B', text: 'Lampu LED senter' },
      { key: 'C', text: 'Transistor daya' },
      { key: 'D', text: 'Baterai kancing' }
    ],
    correctAnswer: 'A',
    explanation: 'Epoksi hitam pada fotodioda berfungsi sebagai filter optik fisik untuk memblokir cahaya tampak dan hanya meneruskan spektrum inframerah api.'
  },
  {
    id: 'flame-3',
    sensorId: 'flame',
    sensorName: 'Sensor Api / Flame Sensor',
    question: 'Berapakah sudut jangkauan deteksi (angle of detection) efektif fotodioda sensor api?',
    options: [
      { key: 'A', text: 'Sekitar 60 derajat' },
      { key: 'B', text: '360 derajat bola penuh' },
      { key: 'C', text: '1 derajat sangat sempit' },
      { key: 'D', text: '180 derajat datar' }
    ],
    correctAnswer: 'A',
    explanation: 'Fotodioda memiliki konus penerimaan sudut efektif sekitar 60 derajat langsung menghadap ke depan.'
  },
  {
    id: 'flame-4',
    sensorId: 'flame',
    sensorName: 'Sensor Api / Flame Sensor',
    question: 'Berapa jarak aman pengujian nyala api langsung terhadap sensor agar tidak merusak fisik komponen sensor?',
    options: [
      { key: 'A', text: 'Minimal 20 cm s.d 80 cm (tidak boleh mengenai bodi plastik)' },
      { key: 'B', text: 'Menempelkan lidah api langsung ke kaki fotodioda' },
      { key: 'C', text: '10 meter' },
      { key: 'D', text: '1 milimeter' }
    ],
    correctAnswer: 'A',
    explanation: 'Panas konduksi langsung dapat melelehkan selubung resin epoksi fotodioda, sehingga pengujian harus menjaga jarak minimal 20-80 cm.'
  },
  {
    id: 'flame-5',
    sensorId: 'flame',
    sensorName: 'Sensor Api / Flame Sensor',
    question: 'Logika output pin Digital (DO) ketika sensor mendeteksi nyala api adalah:',
    options: [
      { key: 'A', text: 'Logika LOW (0V) dan lampu indikator LED sensor menyala' },
      { key: 'B', text: 'Logika 5V konstan tanpa perubahan LED' },
      { key: 'C', text: 'Tegangan bolak balik 220V' },
      { key: 'D', text: 'Logika mengambang tak terdefinisi' }
    ],
    correctAnswer: 'A',
    explanation: 'Sistem komparator LM393 pada modul mengaktifkan sinyal aktif LOW ketika resistansi fotodioda turun akibat paparan inframerah api.'
  },
  {
    id: 'flame-6',
    sensorId: 'flame',
    sensorName: 'Sensor Api / Flame Sensor',
    question: 'IC apa yang digunakan modul sensor api untuk mengkonversi sinyal fotodioda ke output digital?',
    options: [
      { key: 'A', text: 'LM393 Dual Comparator' },
      { key: 'B', text: 'ESP32 Wi-Fi SoC' },
      { key: 'C', text: 'L298N Motor Driver' },
      { key: 'D', text: '74HC595 Shift Register' }
    ],
    correctAnswer: 'A',
    explanation: 'Modul sensor api menggunakan IC komparator presisi ganda LM393 untuk menghasilkan transisi logika biner yang bersih.'
  },
  {
    id: 'flame-7',
    sensorId: 'flame',
    sensorName: 'Sensor Api / Flame Sensor',
    question: 'Ketika menggunakan pin Analog Output (AO), pembacaan ADC saat nyala api semakin mendekat akan bernilai:',
    options: [
      { key: 'A', text: 'Semakin kecil (menurun mendekati 0)' },
      { key: 'B', text: 'Semakin besar melebihi 1023' },
      { key: 'C', text: 'Konstan di angka 500' },
      { key: 'D', text: 'Menjadi bilangan imajiner' }
    ],
    correctAnswer: 'A',
    explanation: 'Semakin kuat radiasi api, arus bocor fotodioda meningkat dan tegangan drop mengecil, menghasilkan nilai analogRead yang menurun ke angka rendah.'
  },
  {
    id: 'flame-8',
    sensorId: 'flame',
    sensorName: 'Sensor Api / Flame Sensor',
    question: 'Mengapa sensor api terkadang dapat mendeteksi "api palsu" saat terkena sinar matahari langsung?',
    options: [
      { key: 'A', text: 'Karena radiasi sinar matahari mengandung spektrum inframerah dengan panjang gelombang 760-1100 nm' },
      { key: 'B', text: 'Karena panas matahari membuat baterai meleleh' },
      { key: 'C', text: 'Karena sinar ultraviolet membingungkan CPU Arduino' },
      { key: 'D', text: 'Karena kabel ground terlepas' }
    ],
    correctAnswer: 'A',
    explanation: 'Matahari adalah pemancar inframerah raksasa, sehingga fotodioda IR dapat merespons sinar matahari jika tidak diberi pelindung tabung tudung.'
  },
  {
    id: 'flame-9',
    sensorId: 'flame',
    sensorName: 'Sensor Api / Flame Sensor',
    question: 'Dalam proyek robotika pemadam api (Fire Fighting Robot), sensor api biasanya dipadukan dengan aktuator apa?',
    options: [
      { key: 'A', text: 'Kipas pendingin (DC Fan blower) atau pompa air mini (water pump)' },
      { key: 'B', text: 'Layar LCD proyektor bioskop' },
      { key: 'C', text: 'Antena pemancar GPS navigasi' },
      { key: 'D', text: 'Speaker pemutar kaset pita' }
    ],
    correctAnswer: 'A',
    explanation: 'Robot pemadam api menggunakan sensor api untuk melacak sumber api lalu mengarahkan kipas atau pompa air mini untuk memadamkannya.'
  },
  {
    id: 'flame-10',
    sensorId: 'flame',
    sensorName: 'Sensor Api / Flame Sensor',
    question: 'Berapakah waktu respon (response time) deteksi dari sensor Flame Sensor terhadap kemunculan nyala api?',
    options: [
      { key: 'A', text: 'Sangat cepat, kurang dari 15 mikrodetik (< 15 µs)' },
      { key: 'B', text: '10 menit' },
      { key: 'C', text: '1 jam penuh' },
      { key: 'D', text: '30 detik' }
    ],
    correctAnswer: 'A',
    explanation: 'Fotodioda adalah piranti semikonduktor berkecepatan tinggi dengan respon transien di bawah 15 mikrodetik.'
  },

  // HC-SR04 Ultrasonic Distance Sensor Questions (10 Soal)
  {
    id: 'hcsr-1',
    sensorId: 'hc-sr04',
    sensorName: 'HC-SR04 / Sensor Jarak Ultrasonik',
    question: 'Berapakah frekuensi gelombang ultrasonik yang dipancarkan oleh transducer transmitter HC-SR04?',
    options: [
      { key: 'A', text: '40 kHz (40.000 Hz)' },
      { key: 'B', text: '2.4 GHz' },
      { key: 'C', text: '50 Hz' },
      { key: 'D', text: '1 MHz' }
    ],
    correctAnswer: 'A',
    explanation: 'Transducer pemancar HC-SR04 memancarkan 8 siklus pulsa suara frekuensi tinggi pada gelombang ultrasonik 40 kHz yang tidak terdengar oleh telinga manusia.'
  },
  {
    id: 'hcsr-2',
    sensorId: 'hc-sr04',
    sensorName: 'HC-SR04 / Sensor Jarak Ultrasonik',
    question: 'Berapa durasi pulsa HIGH yang harus dikirimkan Arduino ke pin Trig untuk memicu pemancaran gelombang suara?',
    options: [
      { key: 'A', text: 'Minimal 10 mikrodetik (10 µs)' },
      { key: 'B', text: '5 menit' },
      { key: 'C', text: '1 jam' },
      { key: 'D', text: '10 detik' }
    ],
    correctAnswer: 'A',
    explanation: 'Mikrokontroler memberikan sinyal pulsa HIGH selama minimal 10 µs pada pin Trigger untuk memicu sensor memancarkan gelombang sonik.'
  },
  {
    id: 'hcsr-3',
    sensorId: 'hc-sr04',
    sensorName: 'HC-SR04 / Sensor Jarak Ultrasonik',
    question: 'Rumus matematika untuk menghitung jarak objek (cm) dari waktu tempuh pulsa pin Echo adalah:',
    options: [
      { key: 'A', text: 'Jarak (cm) = (Durasi Echo × 0.0343) / 2' },
      { key: 'B', text: 'Jarak = Durasi Echo × 100' },
      { key: 'C', text: 'Jarak = Durasi Echo / 340' },
      { key: 'D', text: 'Jarak = 5V × Durasi' }
    ],
    correctAnswer: 'A',
    explanation: 'Kecepatan suara di udara adalah 0.0343 cm/µs. Karena gelombang bergerak bolak-balik (pergi dan memantul pulang), hasilnya harus dibagi 2.'
  },
  {
    id: 'hcsr-4',
    sensorId: 'hc-sr04',
    sensorName: 'HC-SR04 / Sensor Jarak Ultrasonik',
    question: 'Berapakah rentang jarak pengukuran efektif dari sensor ultrasonik HC-SR04?',
    options: [
      { key: 'A', text: '2 cm hingga 400 cm (4 meter)' },
      { key: 'B', text: '10 meter hingga 500 meter' },
      { key: 'C', text: '0.1 mm hingga 1 mm' },
      { key: 'D', text: '10 kilometer' }
    ],
    correctAnswer: 'A',
    explanation: 'Spesifikasi standar HC-SR04 memiliki rentang ukur 2 cm sampai dengan 400 cm dengan resolusi akurasi sekitar 3 mm.'
  },
  {
    id: 'hcsr-5',
    sensorId: 'hc-sr04',
    sensorName: 'HC-SR04 / Sensor Jarak Ultrasonik',
    question: 'Fungsi bawaan Arduino yang digunakan untuk mengukur durasi pulsa HIGH pada pin Echo adalah:',
    options: [
      { key: 'A', text: 'pulseIn(echoPin, HIGH)' },
      { key: 'B', text: 'analogRead(echoPin)' },
      { key: 'C', text: 'delay(1000)' },
      { key: 'D', text: 'digitalWrite(echoPin, LOW)' }
    ],
    correctAnswer: 'A',
    explanation: 'Fungsi pulseIn() menghitung waktu (dalam satuan mikrodetik) pin Echo berada dalam kondisi logika HIGH saat menanti pantulan gelombang.'
  },
  {
    id: 'hcsr-6',
    sensorId: 'hc-sr04',
    sensorName: 'HC-SR04 / Sensor Jarak Ultrasonik',
    question: 'Berapakah sudut kerucut pengukuran (measuring angle) dari sensor HC-SR04?',
    options: [
      { key: 'A', text: 'Sekitar 15 derajat' },
      { key: 'B', text: '180 derajat' },
      { key: 'C', text: '90 derajat' },
      { key: 'D', text: '360 derajat' }
    ],
    correctAnswer: 'A',
    explanation: 'Sudut pemancaran gelombang sonik HC-SR04 terkonsentrasi pada sudut kerucut efektif sekitar 15 derajat.'
  },
  {
    id: 'hcsr-7',
    sensorId: 'hc-sr04',
    sensorName: 'HC-SR04 / Sensor Jarak Ultrasonik',
    question: 'Dua silinder logam di bagian depan HC-SR04 berlabel "T" dan "R" masing-masing menandakan:',
    options: [
      { key: 'A', text: 'Transmitter (Pemancar) dan Receiver (Penerima Pantulan)' },
      { key: 'B', text: 'Temperature dan Radiation' },
      { key: 'C', text: 'Time dan Reset' },
      { key: 'D', text: 'Transistor dan Resistor' }
    ],
    correctAnswer: 'A',
    explanation: 'Silinder bertuliskan "T" adalah Transmitter piezoelektrik yang memancarkan ultrasound, dan "R" adalah Receiver yang menerima gema pantulan suara.'
  },
  {
    id: 'hcsr-8',
    sensorId: 'hc-sr04',
    sensorName: 'HC-SR04 / Sensor Jarak Ultrasonik',
    question: 'Kondisi permukaan objek seperti apa yang dapat menyebabkan kegagalan pantulan pada HC-SR04?',
    options: [
      { key: 'A', text: 'Permukaan empuk penyerap suara seperti kain busa tebal atau permukaan miring lebih dari 45 derajat' },
      { key: 'B', text: 'Dinding tembok beton rata yang keras' },
      { key: 'C', text: 'Pintu kayu datar' },
      { key: 'D', text: 'Kaca jendela datar' }
    ],
    correctAnswer: 'A',
    explanation: 'Busa atau kain menyerap energi gelombang ultrasonik, sedangkan sudut kemiringan tajam memantulkan gelombang suara menjauh dari sensor.'
  },
  {
    id: 'hcsr-9',
    sensorId: 'hc-sr04',
    sensorName: 'HC-SR04 / Sensor Jarak Ultrasonik',
    question: 'Tegangan operasional standar untuk mencatu modul HC-SR04 adalah:',
    options: [
      { key: 'A', text: '5V DC' },
      { key: 'B', text: '1.5V DC' },
      { key: 'C', text: '48V DC' },
      { key: 'D', text: '220V AC' }
    ],
    correctAnswer: 'A',
    explanation: 'Modul HC-SR04 membutuhkan tegangan stabil 5V DC dengan konsumsi arus kerja sekitar 15 mA.'
  },
  {
    id: 'hcsr-10',
    sensorId: 'hc-sr04',
    sensorName: 'HC-SR04 / Sensor Jarak Ultrasonik',
    question: 'Penerapan populer sensor ultrasonik HC-SR04 dalam kehidupan sehari-hari adalah:',
    options: [
      { key: 'A', text: 'Sensor parkir mundur mobil dan pengukur level ketinggian air tangki toren otomatis' },
      { key: 'B', text: 'Mendeteksi suhu tubuh pasien demam' },
      { key: 'C', text: 'Mendeteksi kadar gula darah' },
      { key: 'D', text: 'Membaca barcode barang swalayan' }
    ],
    correctAnswer: 'A',
    explanation: 'HC-SR04 sangat ideal untuk mengukur jarak objek bebas kontak, seperti radar parkir mundur mobil dan level air tangki penampungan.'
  },

  // Soil Moisture Sensor Questions (10 Soal)
  {
    id: 'soil-1',
    sensorId: 'soil-moisture',
    sensorName: 'Sensor Kelembapan Tanah / Soil Moisture',
    question: 'Bagaimana prinsip dasar kerja probe cabang garpu tembaga pada sensor kelembapan tanah tipe resistif?',
    options: [
      { key: 'A', text: 'Mengukur konduktivitas listrik antara dua elektroda; tanah basah kaya air memiliki resistansi rendah' },
      { key: 'B', text: 'Memancarkan sinar laser menembus tanah' },
      { key: 'C', text: 'Menghitung getaran cacing tanah' },
      { key: 'D', text: 'Mengukur gravitasi bumi' }
    ],
    correctAnswer: 'A',
    explanation: 'Air dan mineral di dalam tanah berfungsi sebagai elektrolit penghantar listrik. Makin basah tanah, hambatan listrik antar elektroda makin kecil.'
  },
  {
    id: 'soil-2',
    sensorId: 'soil-moisture',
    sensorName: 'Sensor Kelembapan Tanah / Soil Moisture',
    question: 'Jika tanah tempat probe ditancapkan dalam kondisi sangat kering tandus, nilai pembacaan fungsi `analogRead(A0)` Arduino akan bernilai:',
    options: [
      { key: 'A', text: 'Tinggi mendekati 1023 (karena resistansi tanah sangat besar)' },
      { key: 'B', text: 'Mendekati 0' },
      { key: 'C', text: 'Menjadi nilai minus' },
      { key: 'D', text: 'Tepat 500 konstan' }
    ],
    correctAnswer: 'A',
    explanation: 'Pada rangkaian pembagi tegangan modul ini, tanah kering tidak menghantarkan arus (hambatan besar), sehingga tegangan jatuh pin analog melonjak ke ~1023.'
  },
  {
    id: 'soil-3',
    sensorId: 'soil-moisture',
    sensorName: 'Sensor Kelembapan Tanah / Soil Moisture',
    question: 'Kelemahan utama sensor kelembapan tanah tipe resistif biasa jika dicatu daya 5V secara terus menerus 24 jam adalah:',
    options: [
      { key: 'A', text: 'Terjadinya korosi elektrolisis cepat pada lapisan tembaga elektroda probe' },
      { key: 'B', text: 'Tanah menjadi panas dan hangus' },
      { key: 'C', text: 'Arduino akan meledak' },
      { key: 'D', text: 'Tanaman akan layu seketika' }
    ],
    correctAnswer: 'A',
    explanation: 'Aliran arus searah (DC) secara terus-menerus memicu proses oksidasi elektrolisis yang mengikis lapisan tembaga probe hingga rontok dalam beberapa minggu.'
  },
  {
    id: 'soil-4',
    sensorId: 'soil-moisture',
    sensorName: 'Sensor Kelembapan Tanah / Soil Moisture',
    question: 'Solusi cerdas untuk memperpanjang usia probe sensor resistif di perkebunan adalah:',
    options: [
      { key: 'A', text: 'Menyalakan VCC sensor melalui pin digital Arduino hanya beberapa milidetik sebelum pembacaan lalu mematikannya kembali' },
      { key: 'B', text: 'Menaikkan tegangan ke 24 Volt' },
      { key: 'C', text: 'Merendam probe dalam air garam pekat' },
      { key: 'D', text: 'Mengganti kabel dengan kawat paku' }
    ],
    correctAnswer: 'A',
    explanation: 'Dengan metode pulsed power (hanya memberi daya saat analogRead dilakukan), elektrolisis dapat ditekan hingga 99% sehingga probe bertahan bertahun-tahun.'
  },
  {
    id: 'soil-5',
    sensorId: 'soil-moisture',
    sensorName: 'Sensor Kelembapan Tanah / Soil Moisture',
    question: 'Tipe sensor tanah modern alternatif yang bebas dari masalah korosi elektrolisis adalah:',
    options: [
      { key: 'A', text: 'Capacitive Soil Moisture Sensor (Sensor Kapasitif berbahan solder mask terisolasi)' },
      { key: 'B', text: 'Sensor Suhu DHT11' },
      { key: 'C', text: 'Sensor Gas MQ-2' },
      { key: 'D', text: 'Sensor LDR CdS' }
    ],
    correctAnswer: 'A',
    explanation: 'Sensor tanah tipe kapasitif mengukur permitivitas dielektrik tanah tanpa kontak elektroda langsung, sehingga lapisan PCB tertutup rapat dan tahan korosi.'
  },
  {
    id: 'soil-6',
    sensorId: 'soil-moisture',
    sensorName: 'Sensor Kelembapan Tanah / Soil Moisture',
    question: 'Pinout pada modul antarmuka komparator sensor kelembapan tanah umumnya terdiri dari:',
    options: [
      { key: 'A', text: 'VCC, GND, DO (Digital Output), AO (Analog Output)' },
      { key: 'B', text: 'TX, RX, SCL, SDA' },
      { key: 'C', text: 'CLK, MISO, MOSI, SS' },
      { key: 'D', text: 'VCC dan GND saja' }
    ],
    correctAnswer: 'A',
    explanation: 'Modul antarmuka memiliki 4 pin: catu daya VCC, GND, pin Analog AO untuk nilai kontinu, dan pin Digital DO untuk indikasi biner via trimpot.'
  },
  {
    id: 'soil-7',
    sensorId: 'soil-moisture',
    sensorName: 'Sensor Kelembapan Tanah / Soil Moisture',
    question: 'Penyiraman tanaman otomatis (Smart Irrigation System) biasanya menggunakan aktuator apa bersama sensor tanah?',
    options: [
      { key: 'A', text: 'Relay modul yang mengontrol Solenoid Valve atau Pompa Air DC 12V' },
      { key: 'B', text: 'Motor stepper pemutar kamera' },
      { key: 'C', text: 'Speaker klakson' },
      { key: 'D', text: 'Lampu strobo ambulans' }
    ],
    correctAnswer: 'A',
    explanation: 'Mikrokontroler memicu modul relay untuk mengaktifkan solenoid valve air atau pompa celup mini ketika kelembapan tanah terbaca di bawah ambang batas minimal.'
  },
  {
    id: 'soil-8',
    sensorId: 'soil-moisture',
    sensorName: 'Sensor Kelembapan Tanah / Soil Moisture',
    question: 'Tegangan suplai yang direkomendasikan untuk modul sensor tanah ini adalah:',
    options: [
      { key: 'A', text: '3.3V hingga 5V DC' },
      { key: 'B', text: '12V hingga 36V AC' },
      { key: 'C', text: '220V AC PLN' },
      { key: 'D', text: '0.1V baterai jam' }
    ],
    correctAnswer: 'A',
    explanation: 'Sirkuit komparator LM393 dan probe bekerja optimal pada tegangan 3.3V sampai 5V DC.'
  },
  {
    id: 'soil-9',
    sensorId: 'soil-moisture',
    sensorName: 'Sensor Kelembapan Tanah / Soil Moisture',
    question: 'Fungsi instruksi Arduino `map(val, 1023, 300, 0, 100)` pada pembacaan sensor tanah adalah:',
    options: [
      { key: 'A', text: 'Mengonversi nilai mentah ADC (1023-300) menjadi persentase kelembapan (0% - 100%)' },
      { key: 'B', text: 'Menghapus memori program sketch' },
      { key: 'C', text: 'Membuat peta navigasi Google Maps' },
      { key: 'D', text: 'Menghitung koordinat satelit' }
    ],
    correctAnswer: 'A',
    explanation: 'Fungsi map memetakan nilai pembacaan analog ke satuan yang mudah dipahami manusia seperti persentase kelembapan 0% s.d 100%.'
  },
  {
    id: 'soil-10',
    sensorId: 'soil-moisture',
    sensorName: 'Sensor Kelembapan Tanah / Soil Moisture',
    question: 'Faktor apa yang dapat memengaruhi resistansi pembacaan selain kandungan air dalam tanah?',
    options: [
      { key: 'A', text: 'Kandungan garam dan pupuk mineral elektrolit di dalam tanah' },
      { key: 'B', text: 'Warna pot bunga' },
      { key: 'C', text: 'Suara kicauan burung di kebun' },
      { key: 'D', text: 'Jenis pot tanah liat atau plastik' }
    ],
    correctAnswer: 'A',
    explanation: 'Tingkat salinitas dan konsentrasi ion pupuk dalam air tanah meningkatkan daya hantar listrik, sehingga kalibrasi lokal sangat penting.'
  },

  // Raindrops Sensor Questions (10 Soal)
  {
    id: 'rain-1',
    sensorId: 'raindrops',
    sensorName: 'Sensor Tetesan Air Hujan / Raindrops',
    question: 'Bagaimana konstruksi fisik papan kolektor tetesan air hujan pada modul Raindrops Sensor?',
    options: [
      { key: 'A', text: 'Papan PCB dengan dua jalur jejak tembaga berlapis nikel yang saling berselang-seling (interdigital tracks)' },
      { key: 'B', text: 'Kain parasut kedap air' },
      { key: 'C', text: 'Tabung gas bertekanan' },
      { key: 'D', text: 'Bola kristal pemantul cahaya' }
    ],
    correctAnswer: 'A',
    explanation: 'Jejak tembaga interdigital dibuat berjarak dekat sehingga setetes air hujan yang jatuh di atasnya akan menjembatani sirkuit dan menurunkan resistansi.'
  },
  {
    id: 'rain-2',
    sensorId: 'raindrops',
    sensorName: 'Sensor Tetesan Air Hujan / Raindrops',
    question: 'Ketika permukaan papan kolektor terkena rintik air hujan lebat, nilai pembacaan analog (AO) akan:',
    options: [
      { key: 'A', text: 'Menurun tajam mendekati 0-200' },
      { key: 'B', text: 'Naik melebihi 2000' },
      { key: 'C', text: 'Tetap di 1023' },
      { key: 'D', text: 'Mati total' }
    ],
    correctAnswer: 'A',
    explanation: 'Air hujan menghantarkan listrik antar jalur tembaga, menurunkan resistansi sensor sehingga output tegangan analog turun drastis ke angka rendah.'
  },
  {
    id: 'rain-3',
    sensorId: 'raindrops',
    sensorName: 'Sensor Tetesan Air Hujan / Raindrops',
    question: 'Mengapa jalur tembaga pada papan kolektor tetesan hujan sering dilapisi nikel atau emas tipis (HASL/ENIG)?',
    options: [
      { key: 'A', text: 'Untuk mencegah oksidasi dan karat tembaga akibat kontak langsung dengan air hujan dan asam' },
      { key: 'B', text: 'Agar papan berkilau indah di malam hari' },
      { key: 'C', text: 'Untuk menambah berat fisik modul' },
      { key: 'D', text: 'Agar tahan terhadap sambaran petir' }
    ],
    correctAnswer: 'A',
    explanation: 'Lapisan nikel/emas melindungi tembaga dari korosi atmosferik dan air hujan yang bersifat sedikit asam.'
  },
  {
    id: 'rain-4',
    sensorId: 'rain-4',
    sensorName: 'Sensor Tetesan Air Hujan / Raindrops',
    question: 'Berapa jumlah pin pada papan pengolah sinyal (driver module) sensor hujan?',
    options: [
      { key: 'A', text: '4 pin (VCC, GND, DO, AO)' },
      { key: 'B', text: '10 pin' },
      { key: 'C', text: '1 pin' },
      { key: 'D', text: '12 pin' }
    ],
    correctAnswer: 'A',
    explanation: 'Modul komparator memiliki 4 pin: VCC, GND, Digital Output (DO), dan Analog Output (AO).'
  },
  {
    id: 'rain-5',
    sensorId: 'raindrops',
    sensorName: 'Sensor Tetesan Air Hujan / Raindrops',
    question: 'Aplikasi Smart Home apa yang paling ideal menggunakan Raindrops Sensor?',
    options: [
      { key: 'A', text: 'Jemuran pakaian otomatis menarik atap kanopi saat hujan dan wiper kaca mobil otomatis' },
      { key: 'B', text: 'Pengukur suhu ruangan AC' },
      { key: 'C', text: 'Sensor sidik jari pintu lemari' },
      { key: 'D', text: 'Kalkulator ilmiah' }
    ],
    correctAnswer: 'A',
    explanation: 'Sensor hujan lazim dipakai untuk sistem penutup jemuran otomatis berbasis motor stepper/servo serta wiper mobil pintar.'
  },
  {
    id: 'rain-6',
    sensorId: 'raindrops',
    sensorName: 'Sensor Tetesan Air Hujan / Raindrops',
    question: 'Mengapa papan kolektor hujan disarankan dipasang dengan sudut kemiringan sedikit miring (sekitar 15-30 derajat)?',
    options: [
      { key: 'A', text: 'Agar sisa air hujan mudah mengalir turun setelah hujan reda dan tidak menggenang terus menerus' },
      { key: 'B', text: 'Agar dapat menangkap sinyal WiFi' },
      { key: 'C', text: 'Menghindari jatuhnya daun kering' },
      { key: 'D', text: 'Agar terlihat rapi oleh mata' }
    ],
    correctAnswer: 'A',
    explanation: 'Pemasangan miring memastikan sisa tetesan air segera mengalir turun sehingga pembacaan sensor lekas kembali ke status "kering" saat hujan reda.'
  },
  {
    id: 'rain-7',
    sensorId: 'raindrops',
    sensorName: 'Sensor Tetesan Air Hujan / Raindrops',
    question: 'IC komparator yang terpasang pada modul pemroses sensor hujan adalah:',
    options: [
      { key: 'A', text: 'LM393' },
      { key: 'B', text: 'ATmega2560' },
      { key: 'C', text: 'NE555' },
      { key: 'D', text: 'ULN2003' }
    ],
    correctAnswer: 'A',
    explanation: 'IC komparator tegangan presisi LM393 membandingkan nilai resistansi papan hujan dengan tegangan referensi potensiometer onboard.'
  },
  {
    id: 'rain-8',
    sensorId: 'raindrops',
    sensorName: 'Sensor Tetesan Air Hujan / Raindrops',
    question: 'Tegangan suplai yang dibutuhkan untuk menyalakan sensor hujan adalah:',
    options: [
      { key: 'A', text: '3.3V hingga 5V DC' },
      { key: 'B', text: '24V AC' },
      { key: 'C', text: '220V AC PLN' },
      { key: 'D', text: '1.2V DC' }
    ],
    correctAnswer: 'A',
    explanation: 'Sensor beroperasi pada tegangan 3.3V hingga 5V DC langsung dari pin 5V atau 3.3V board Arduino.'
  },
  {
    id: 'rain-9',
    sensorId: 'raindrops',
    sensorName: 'Sensor Tetesan Air Hujan / Raindrops',
    question: 'Logika pada pin Digital Output (DO) ketika sensor mendeteksi tetesan air hujan adalah:',
    options: [
      { key: 'A', text: 'Logika LOW (0V) dan LED indikator aktif menyala' },
      { key: 'B', text: 'Logika 12V DC' },
      { key: 'C', text: 'Tegangan mati total' },
      { key: 'D', text: 'Logika mengambang' }
    ],
    correctAnswer: 'A',
    explanation: 'Pin DO aktif LOW: saat basah tegangan pin DO berubah menjadi LOW (0V) dan lampu indikator hijau/merah menyala terang.'
  },
  {
    id: 'rain-10',
    sensorId: 'raindrops',
    sensorName: 'Sensor Tetesan Air Hujan / Raindrops',
    question: 'Bagaimana cara membedakan kondisi "Gerimis Ringan" dan "Hujan Lebat" menggunakan sensor ini di sketch Arduino?',
    options: [
      { key: 'A', text: 'Membaca nilai pin Analog Output (AO): nilai 500-800 mengindikasikan gerimis, sedangkan nilai < 300 mengindikasikan hujan lebat' },
      { key: 'B', text: 'Menghitung jumlah kedipan LED komputer' },
      { key: 'C', text: 'Menggunakan pin Digital saja' },
      { key: 'D', text: 'Tidak bisa dibedakan sama sekali' }
    ],
    correctAnswer: 'A',
    explanation: 'Pin Analog memberikan resolusi rentang basah kontinu: makin banyak air hujan menutupi jejak PCB, nilai analogRead makin kecil mendekati 0.'
  },

  // SW-420 Vibration Sensor Questions (10 Soal)
  {
    id: 'sw-1',
    sensorId: 'sw-420',
    sensorName: 'SW-420 / Sensor Getaran',
    question: 'Apa jenis sakelar kontak mekanis di dalam tabung sensor getaran SW-420?',
    options: [
      { key: 'A', text: 'Tipe Normally Closed (NC) dengan kontak pegas konduktif internal' },
      { key: 'B', text: 'Tipe Normally Open optik laser' },
      { key: 'C', text: 'Transistor daya NPN' },
      { key: 'D', text: 'Saklar putar manual' }
    ],
    correctAnswer: 'A',
    explanation: 'SW-420 adalah sensor bertipe Normally Closed (NC): saat tenang kontak pegas menyentuh elektroda tengah, dan saat terguncang pegas memantul membuka sirkuit sesaat.'
  },
  {
    id: 'sw-2',
    sensorId: 'sw-420',
    sensorName: 'SW-420 / Sensor Getaran',
    question: 'Status logika pada pin Digital Output (DO) modul SW-420 ketika dalam keadaan tenang tanpa guncangan adalah:',
    options: [
      { key: 'A', text: 'Logika LOW (0V)' },
      { key: 'B', text: 'Logika HIGH 5V' },
      { key: 'C', text: '12V AC' },
      { key: 'D', text: '220V PLN' }
    ],
    correctAnswer: 'A',
    explanation: 'Dalam keadaan tenang tanpa guncangan, kontak berada pada posisi terhubung (konduktif) sehingga rangkaian komparator menghasilkan level logika LOW.'
  },
  {
    id: 'sw-3',
    sensorId: 'sw-420',
    sensorName: 'SW-420 / Sensor Getaran',
    question: 'Apa yang terjadi pada pin DO ketika modul SW-420 mengalami getaran, benturan, atau gempa?',
    options: [
      { key: 'A', text: 'Pegas terlepas sesaat menghasilkan pulsa logika HIGH (transisi LOW ke HIGH)' },
      { key: 'B', text: 'Tegangan turun menjadi minus 10 Volt' },
      { key: 'C', text: 'Sensor mengeluarkan suara sirine' },
      { key: 'D', text: 'Arduino langsung mati' }
    ],
    correctAnswer: 'A',
    explanation: 'Guncangan inersia membuat pegas terlepas sesaat dari kontak tengah, memicu komparator LM393 mengirimkan pulsa logika HIGH yang tajam.'
  },
  {
    id: 'sw-4',
    sensorId: 'sw-420',
    sensorName: 'SW-420 / Sensor Getaran',
    question: 'Fungsi potensiometer mini (trimpot) pada modul sensor SW-420 adalah:',
    options: [
      { key: 'A', text: 'Mengatur tingkat sensitivitas (kepekaan) terhadap intensitas getaran mekanis' },
      { key: 'B', text: 'Mengatur volume speaker' },
      { key: 'C', text: 'Mengatur warna lampu LED' },
      { key: 'D', text: 'Mengubah tegangan baterai' }
    ],
    correctAnswer: 'A',
    explanation: 'Trimpot digunakan untuk menyetel ambang sensitivitas deteksi guncangan agar tidak mudah terpicu oleh getaran halus yang tidak diinginkan.'
  },
  {
    id: 'sw-5',
    sensorId: 'sw-420',
    sensorName: 'SW-420 / Sensor Getaran',
    question: 'Fitur Arduino apa yang paling efektif digunakan untuk menangkap pulsa getaran kilat dari sensor SW-420 tanpa khawatir terlewat?',
    options: [
      { key: 'A', text: 'Interrupt Eksternal (`attachInterrupt(digitalPinToInterrupt(pin), ISR, RISING)`)' },
      { key: 'B', text: 'Fungsi delay(5000)' },
      { key: 'C', text: 'Perulangan while(true) tanpa jeda' },
      { key: 'D', text: 'Fungsi analogRead()' }
    ],
    correctAnswer: 'A',
    explanation: 'Pulsa getaran terjadi sangat cepat (<15 ms). Pemasangan Interrupt pada pin digital D2/D3 menjamin mikrokontroler segera merespons getaran tanpa tertahan delay.'
  },
  {
    id: 'sw-6',
    sensorId: 'sw-420',
    sensorName: 'SW-420 / Sensor Getaran',
    question: 'Berapakah waktu respon (response time) mekanis dari sakelar tabung getaran SW-420?',
    options: [
      { key: 'A', text: 'Kurang dari 15 milidetik (< 15 ms)' },
      { key: 'B', text: '1 menit' },
      { key: 'C', text: '10 detik' },
      { key: 'D', text: '2 jam' }
    ],
    correctAnswer: 'A',
    explanation: 'Pegas inersia memiliki massa yang sangat ringan dan responsif, merespons getaran dalam tempo kurang dari 15 milidetik.'
  },
  {
    id: 'sw-7',
    sensorId: 'sw-420',
    sensorName: 'SW-420 / Sensor Getaran',
    question: 'Arah deteksi getaran dari sensor SW-420 bersifat:',
    options: [
      { key: 'A', text: 'Omnidirectional (peka terhadap guncangan dari segala sudut arah 360 derajat)' },
      { key: 'B', text: 'Hanya searah vertikal ke atas saja' },
      { key: 'C', text: 'Hanya searah horizontal ke kiri' },
      { key: 'D', text: 'Hanya peka terhadap suara ultrasonik' }
    ],
    correctAnswer: 'A',
    explanation: 'Desain silinder pegas konsentris membuat sensor dapat mendeteksi getaran dan goyangan dari arah mana pun (omnidirectional).'
  },
  {
    id: 'sw-8',
    sensorId: 'sw-420',
    sensorName: 'SW-420 / Sensor Getaran',
    question: 'Tegangan operasional standar yang dibutuhkan modul SW-420 adalah:',
    options: [
      { key: 'A', text: '3.3V hingga 5V DC' },
      { key: 'B', text: '12V hingga 24V AC' },
      { key: 'C', text: '220V AC PLN' },
      { key: 'D', text: '0.5V DC' }
    ],
    correctAnswer: 'A',
    explanation: 'Sirkuit komparator LM393 pada modul bekerja pada catu daya 3.3V hingga 5V DC.'
  },
  {
    id: 'sw-9',
    sensorId: 'sw-420',
    sensorName: 'SW-420 / Sensor Getaran',
    question: 'Aplikasi nyata apa yang memanfaatkan keandalan modul sensor SW-420?',
    options: [
      { key: 'A', text: 'Alarm anti-maling sepeda motor/mobil, detektor gempa bumi mini, dan detektor sabotase kaca jendela' },
      { key: 'B', text: 'Pengukur suhu ruangan' },
      { key: 'C', text: 'Pengukur kadar oksigen udara' },
      { key: 'D', text: 'Sensor pemantau curah hujan' }
    ],
    correctAnswer: 'A',
    explanation: 'SW-420 banyak diaplikasikan pada sistem proteksi kendaraan (alarm benturan), pendeteksi getaran gempa bumi dini, dan alarm perusakan brankas/kaca.'
  },
  {
    id: 'sw-10',
    sensorId: 'sw-420',
    sensorName: 'SW-420 / Sensor Getaran',
    question: 'Jumlah pin fisik antarmuka pada modul sensor getaran SW-420 adalah:',
    options: [
      { key: 'A', text: '3 pin (VCC, GND, DO)' },
      { key: 'B', text: '16 pin' },
      { key: 'C', text: '1 pin' },
      { key: 'D', text: '8 pin DIP' }
    ],
    correctAnswer: 'A',
    explanation: 'Modul sensor getaran SW-420 memiliki 3 pin dasar: VCC (3.3V-5V), GND (Ground), dan DO (Digital Output).'
  }
];

export const INITIAL_SUBMISSIONS: QuizSubmission[] = [
  {
    id: 'sub-1',
    studentName: 'Rahma',
    sensorIds: ['ir-obstacle'],
    sensorNames: ['IR (Infrared Obstacle Sensor / Sensor Halangan)'],
    totalQuestions: 15,
    correctAnswersCount: 1,
    wrongAnswersCount: 14,
    score: 7,
    completedAt: '2026-10-06 21:05',
    duration: '4 menit 18 detik',
    answers: [
      {
        questionId: 'q9',
        questionText: 'Jika sensor IR Obstacle digunakan di luar ruangan di bawah terik sinar matahari langsung, apa kendala utamanya?',
        sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
        userChoice: 'C',
        correctAnswer: 'A',
        isCorrect: false,
        explanation: 'Sinar matahari kaya akan radiasi inframerah alami sehingga membuat fotodioda tersaturasi (kejenuhan optik).',
        options: [
          { key: 'A', text: 'Sensor akan kebanjiran radiasi inframerah matahari sehingga menghasilkan deteksi palsu terus-menerus' },
          { key: 'B', text: 'Sensor akan langsung pecah' },
          { key: 'C', text: 'Tidak ada pengaruh sama sekali' },
          { key: 'D', text: 'Baterai Arduino akan terisi ulang otomatis' }
        ]
      },
      {
        questionId: 'q8',
        questionText: 'Pinout standar pada modul sensor IR Obstacle umumnya terdiri dari berapa pin?',
        sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
        userChoice: 'C',
        correctAnswer: 'A',
        isCorrect: false,
        explanation: 'Pinout sensor IR Obstacle terdiri dari 3 pin standar: VCC, GND, dan OUT.',
        options: [
          { key: 'A', text: '3 pin (VCC, GND, OUT)' },
          { key: 'B', text: '4 pin (VCC, GND, TX, RX)' },
          { key: 'C', text: '1 pin saja' },
          { key: 'D', text: '12 pin' }
        ]
      },
      {
        questionId: 'q10',
        questionText: 'Apa fungsi potensiometer trimmer kecil pada modul sensor rintangan IR?',
        sensorName: 'IR (Infrared Obstacle Sensor / Sensor Halangan)',
        userChoice: 'A',
        correctAnswer: 'A',
        isCorrect: true,
        explanation: 'Potensiometer onboard digunakan untuk menyetel jarak sensitivitas deteksi rintangan.',
        options: [
          { key: 'A', text: 'Mengatur jarak ambang batas deteksi objek' },
          { key: 'B', text: 'Mengatur volume buzzer' },
          { key: 'C', text: 'Mengubah kecepatan clock Arduino' },
          { key: 'D', text: 'Mengubah warna radiasi infra merah' }
        ]
      }
    ]
  },
  {
    id: 'sub-2',
    studentName: 'Audi Pratama',
    sensorIds: ['dht11'],
    sensorNames: ['DHT11 / Sensor Suhu & Kelembapan'],
    totalQuestions: 15,
    correctAnswersCount: 14,
    wrongAnswersCount: 1,
    score: 93,
    completedAt: '2026-10-06 18:40',
    duration: '5 menit 12 detik',
    answers: []
  },
  {
    id: 'sub-3',
    studentName: 'Diah Lestari',
    sensorIds: ['dht11', 'hc-sr04', 'mq2'],
    sensorNames: ['DHT11', 'HC-SR04', 'MQ-2 Gas'],
    totalQuestions: 15,
    correctAnswersCount: 15,
    wrongAnswersCount: 0,
    score: 100,
    completedAt: '2026-10-06 16:12',
    duration: '3 menit 45 detik',
    answers: []
  },
  {
    id: 'sub-4',
    studentName: 'Rian Hidayat',
    sensorIds: ['pir', 'ldr'],
    sensorNames: ['PIR Motion', 'LDR Cahaya'],
    totalQuestions: 10,
    correctAnswersCount: 8,
    wrongAnswersCount: 2,
    score: 80,
    completedAt: '2026-10-06 14:05',
    duration: '2 menit 50 detik',
    answers: []
  },
  {
    id: 'sub-5',
    studentName: 'Siti Rahmawati',
    sensorIds: ['dht11', 'pir'],
    sensorNames: ['DHT11', 'PIR Motion'],
    totalQuestions: 15,
    correctAnswersCount: 12,
    wrongAnswersCount: 3,
    score: 80,
    completedAt: '2026-10-05 20:30',
    duration: '4 menit 05 detik',
    answers: []
  }
];
