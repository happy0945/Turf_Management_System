import fs from "fs";
import cloudinary from "../config/cloudinary.js";

export interface CloudinaryImage {
  url: string;
  public_id: string;
}

/**
 * Uploads a single locally-stored file (from multer diskStorage) to Cloudinary
 * and removes the local temp file afterwards, regardless of success/failure.
 */
export const uploadOnCloudinary = async (
  localFilePath: string
): Promise<CloudinaryImage> => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "turfs",
      resource_type: "image",
    });

    return { url: result.secure_url, public_id: result.public_id };
  } finally {
    // Always clean up the temp file, whether upload succeeded or threw
    fs.promises.unlink(localFilePath).catch(() => {
      // ignore - file may already be gone
    });
  }
};

export const uploadManyOnCloudinary = async (
  localFilePaths: string[]
): Promise<CloudinaryImage[]> => {
  return Promise.all(localFilePaths.map((filePath) => uploadOnCloudinary(filePath)));
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};

export const deleteManyFromCloudinary = async (publicIds: string[]): Promise<void> => {
  if (publicIds.length === 0) return;
  await cloudinary.api.delete_resources(publicIds, { resource_type: "image" });
};