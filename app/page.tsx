"use client";

import React, { useState } from "react";

const PrintPriceTag: React.FC = () => {
  const [product] = useState<{
    name: string;
    price: string;
    code: string;
  }>({
    name: "Plant Pot",
    price: "25.00",
    code: "PP001",
  });

  const printViaUSB = async () => {
    try {
      // Request device with appropriate filters
      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x2d37, productId: 0x83d7 }],
      });

      console.log("Device selected: ", device);

      // Open and claim interface on the device
      // await device.open();
      // await device.selectConfiguration(1);
      // await device.claimInterface(0);

      await device
        .open()
        .then(() => console.log("Device opened"))
        .catch(console.error);

      await device
        .selectConfiguration(1)
        .then(() => console.log("Configuration selected"))
        .catch(console.error);

      await device
        .claimInterface(0)
        .then(() => console.log("Interface claimed"))
        .catch(console.error);

      const zpl = `
        ^XA
        ^FO50,50^A0N,50,50^FDPrice Tag^FS
        ^FO50,120^A0N,40,40^FDName: ${product.name}^FS
        ^FO50,170^A0N,40,40^FDPrice: $${product.price}^FS
        ^FO50,220^A0N,40,40^FDCode: ${product.code}^FS
        ^XZ
      `;

      // Prepare data for transfer
      const encoder = new TextEncoder();
      const data = encoder.encode(zpl);

      // Send the ZPL data to the USB device
      // await device.transferOut(2, data);
      await device
        .transferOut(2, data)
        .then(() => console.log("Data sent"))
        .catch(console.error);

      alert("Printed successfully!");
    } catch (error) {
      console.error("Error printing:", error);
      if (error instanceof DOMException && error.name === "SecurityError") {
        alert(
          "Access to the USB device was denied. Ensure you're on HTTPS and check browser permissions."
        );
      } else {
        alert("Failed to print. Check the console for more details.");
      }
    }
  };

  return (
    <div>
      <h1>Print Price Tag</h1>
      <div>
        <p>Name: {product.name}</p>
        <p>Price: ${product.price}</p>
        <p>Code: {product.code}</p>
      </div>
      <button onClick={printViaUSB}>Print Price Tag</button>
    </div>
  );
};

export default PrintPriceTag;
