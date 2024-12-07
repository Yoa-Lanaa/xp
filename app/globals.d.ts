declare global {
  interface Navigator {
    usb: USB;
  }

  interface USB {
    requestDevice(options: USBDeviceRequestOptions): Promise<USBDevice>;
  }

  interface USBDeviceRequestOptions {
    filters: USBDeviceFilter[];
  }

  interface USBDeviceFilter {
    vendorId?: number;
    productId?: number;
  }

  interface USBDevice {
    open(): Promise<void>;
    selectConfiguration(configurationValue: number): Promise<void>;
    claimInterface(interfaceNumber: number): Promise<void>;
    transferOut(
      endpointNumber: number,
      data: BufferSource
    ): Promise<USBOutTransferResult>;
  }

  interface USBOutTransferResult {
    status: string;
    bytesWritten: number;
  }
}

export {};
