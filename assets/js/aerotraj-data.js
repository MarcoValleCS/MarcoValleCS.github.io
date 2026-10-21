/* Snapshot dei risultati pubblicati in MarcoValleCS/AeroTraj-Ultra.
   Generato da tools/fetch_aerotraj_data.py — non modificare a mano. */
window.AEROTRAJ = {
  "source": "https://github.com/MarcoValleCS/AeroTraj-Ultra",
  "fetched": "2026-10-21",
  "horizons_s": [
    5,
    10,
    15,
    20,
    30,
    45,
    60,
    90,
    120,
    150,
    180,
    240,
    300
  ],
  "series": {
    "AeroTraj-Ultra": [
      61.2,
      67.0,
      74.6,
      86.7,
      122.3,
      200.2,
      308.0,
      593.9,
      952.2,
      1374.7,
      1852.9,
      2953.2,
      4243.8
    ],
    "FlightBERT++": [
      68.0,
      84.0,
      103.2,
      127.0,
      179.1,
      283.3,
      420.9,
      773.5,
      1210.0,
      1718.9,
      2287.6,
      3577.4,
      5025.6
    ],
    "CV con Doppler": [
      64.2,
      76.1,
      91.7,
      113.3,
      171.5,
      291.7,
      450.7,
      868.8,
      1406.3,
      2054.8,
      2802.7,
      4565.0,
      6643.0
    ],
    "DDPM": [
      146.4,
      223.9,
      300.7,
      399.8,
      631.2,
      1050.8,
      1600.7,
      2786.6,
      4233.4,
      5954.7,
      8128.6,
      12577.5,
      17871.6
    ]
  },
  "benchmark": [
    {
      "model": "AeroTraj-Ultra",
      "mde": 991.6,
      "fde": 4243.8,
      "ours": true
    },
    {
      "model": "FlightBERT++",
      "mde": 1219.9,
      "fde": 5025.6,
      "ours": false
    },
    {
      "model": "LSTM",
      "mde": 1296.4,
      "fde": 5264.8,
      "ours": false
    },
    {
      "model": "CV con Doppler",
      "mde": 1507.7,
      "fde": 6643.0,
      "ours": false
    },
    {
      "model": "CFM",
      "mde": 1704.3,
      "fde": 7125.8,
      "ours": false
    },
    {
      "model": "CV minimi quadrati",
      "mde": 1802.5,
      "fde": 7391.8,
      "ours": false
    },
    {
      "model": "IMM",
      "mde": 2019.2,
      "fde": 7721.2,
      "ours": false
    },
    {
      "model": "ASCENT",
      "mde": 2348.9,
      "fde": 8426.0,
      "ours": false
    },
    {
      "model": "Attention-LSTM",
      "mde": 3170.0,
      "fde": 14694.6,
      "ours": false
    },
    {
      "model": "DDPM",
      "mde": 4300.5,
      "fde": 17871.6,
      "ours": false
    }
  ],
  "windows": 60000,
  "facts": {
    "mde_m": 991.6,
    "fde_m": 4243.8,
    "params": 1276839,
    "latency_ms": 19.6,
    "latency_13h_ms": 22.4,
    "epochs": 80,
    "train_minutes": 25,
    "days": 180,
    "flights": 208000,
    "rows_streamed": 827261829,
    "windows_train": 36392302,
    "hypotheses": 8,
    "coverage": 90,
    "band_reduction": 56
  }
};
