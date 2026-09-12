# RemoveBG AI Web

Website background remover dengan tampilan modern seperti halaman upload remove.bg.

## 1. Install Node.js
Gunakan Node.js 18+.

## 2. Install dependency
```bash
npm install
```

## 3. Buat file .env
Salin `.env.example` menjadi `.env`, lalu isi:

REMOVEBG_API_KEY=API_KEY_KAMU

API key JANGAN dimasukkan ke `index.html`.

## 4. Jalankan
```bash
npm start
```

Buka:
http://localhost:3000

## Catatan
Website ini memakai endpoint remove.bg API untuk pemrosesan background.
API key disimpan di server agar tidak terlihat oleh pengunjung.
