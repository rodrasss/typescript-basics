declare module "qrcode-terminal" {
  const qr: { generate(text: string, opts?: { small?: boolean }, cb?: (qr: string) => void): void };
  export default qr;
}
