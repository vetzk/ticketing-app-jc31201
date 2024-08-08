import multer from 'multer';
import path from 'path';
import { Request } from 'express';

export const uploader = (dirName: string | null, prefixName?: string) => {
  const mainDir = path.join(__dirname, '../../public');

  const configFileStore = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void,
    ) => {
      const fileDest = dirName ? mainDir + dirName : mainDir;
      callback(null, fileDest);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void,
    ) => {
      const existName = file.originalname.split('.');
      const extension = existName[existName.length - 1];
      callback(null, `${prefixName || 'MEDIA'}${Date.now()}.${extension}`);
    },
  });
  return multer({ storage: configFileStore });
};
