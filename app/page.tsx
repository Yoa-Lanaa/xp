"use client"
import { useState } from "react";

const PrintLabel = () => {
  const [status, setStatus] = useState("");

  // Template ZPL untuk QR Code dan Price Tag
  const zplData = `
    ^XA
    ^FO100,100
    ^BQN,2,10
    ^FDMM,A123456789^FS
    ^FO100,250
    ^A0N,50,50
    ^FDPrice: $19.99^FS
    ^XZ
  `;

  const printLabel = async () => {
    try {
      setStatus("Mencari printer...");
      // Akses printer via WebUSB API
      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x2d37 }], // Gantilah vendorId sesuai dengan printer Anda
      });
      setStatus("Printer ditemukan!");

      // Membuka koneksi dengan printer
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      // Kirim data ZPL ke printer
      const writer = new TextEncoder();
      const zplArray = writer.encode(zplData);
      await device.transferOut(2, zplArray);
      setStatus("Perintah cetak terkirim!");

      // Menutup koneksi setelah selesai
      await device.close();
    } catch (error) {
      console.error("Error mencetak label:", error);
      setStatus(
        "Gagal menghubungkan ke printer. Pastikan Anda memberikan izin akses ke perangkat."
      );
    }
  };

  return (
    <div>
      <h1>Print QR Code & Price Tag</h1>
      <button onClick={printLabel}>Cetak Label</button>
      <p>{status}</p>
    </div>
  );
};

export default PrintLabel;
