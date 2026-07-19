import fs from "fs";
import cloudinary from "../config/cloudinary.js";

export interface CloudinaryImage {
  url: string;
  public_id: string;
}

/**
 * Uploads a single locally-stored file (from multer diskStorage) to Cloudinary
 * and removes the local temp file afterwards.
 */
export const uploadOnCloudinary = async (
  localFilePath: string
): Promise<CloudinaryImage> => {
  try {
    console.log("Uploading file:", localFilePath);

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "turfs",
      resource_type: "image",
    });

    console.log("✅ Upload Successful");
    console.log(result);

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error: any) {
    console.error("\n========== CLOUDINARY ERROR ==========");

    console.error("Full Error:", error);

    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("HTTP Code:", error.http_code);

    if (error.error) {
      console.error("Cloudinary Response:", error.error);
    }

    console.error("======================================\n");

    throw error;
  } finally {
    try {
      await fs.promises.unlink(localFilePath);
      console.log("🗑 Temp file deleted:", localFilePath);
    } catch (err) {
      console.warn("Failed to delete temp file:", err);
    }
  }
};

export const uploadManyOnCloudinary = async (
  localFilePaths: string[]
): Promise<CloudinaryImage[]> => {
  return Promise.all(
    localFilePaths.map((filePath) => uploadOnCloudinary(filePath))
  );
};

export const deleteFromCloudinary = async (
  publicId: string
): Promise<void> => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};

export const deleteManyFromCloudinary = async (
  publicIds: string[]
): Promise<void> => {
  if (publicIds.length === 0) return;

  await cloudinary.api.delete_resources(publicIds, {
    resource_type: "image",
  });
};