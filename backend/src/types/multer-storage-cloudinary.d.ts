declare module 'multer-storage-cloudinary' {
  import { v2 as cloudinary } from 'cloudinary';
  import { StorageEngine } from 'multer';

  interface Options {
    cloudinary: typeof cloudinary;
    params?: any;
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: Options);
    _handleFile(req: any, file: any, cb: any): void;
    _removeFile(req: any, file: any, cb: any): void;
  }
}
