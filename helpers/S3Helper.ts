const S3FileUpload = require("react-s3");
const { v4: uuidv4 } = require("uuid");

export default class S3Helper {
  private static getConfig = (dirName: string) => {
    return {
      bucketName: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      dirName,
      region: process.env.NEXT_PUBLIC_S3_REGION,
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    };
  };

  static uploadProfilePicture = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const config = this.getConfig("profile");
      const newFile = S3Helper.generateUploadable(file);
      S3FileUpload.uploadFile(newFile, config)
        .then((data: any) => {
          resolve(data.location);
        })
        .catch((err: any) => reject(err));
    });
  };

  static generateUploadable = (file: File) => {
    let filePostFix = "";
    const fileNameParts = file.name.split(".");
    if (fileNameParts.length > 0) {
      filePostFix = fileNameParts[fileNameParts.length - 1];
    }
    const newFile = new File([file], `${uuidv4()}.${filePostFix}`, {
      type: file.type,
    });
    return newFile;
  };

  static uploadLogo = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const config = this.getConfig("logo");
      const newFile = S3Helper.generateUploadable(file);
      S3FileUpload.uploadFile(newFile, config)
        .then((data: any) => {
          resolve(data.location);
        })
        .catch((err: any) => reject(err));
    });
  };
  static uploadFile = (file: File) => {
    return new Promise<any>((resolve, reject) => {
      if (!file) resolve(undefined);
      const config = this.getConfig("material");
      const newFile = S3Helper.generateUploadable(file);
      S3FileUpload.uploadFile(newFile, config)
        .then((data: any) => {
          resolve(data.location);
        })
        .catch((err: any) => reject(err));
    });
  };
}
