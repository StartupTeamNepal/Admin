import React, { useEffect, useState } from "react";
import { uploadMenuItemImage } from "../api/MenuItems";

interface ImageUploadProps {
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
  disabled?: boolean;
  maxSizeMB?: number;
}

export default function ImageUpload({
  imageUrl,
  onImageUrlChange,
  disabled = false,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target;
    const file = input.files?.[0];

    // Allow selecting the same file again.
    input.value = "";

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a PNG, JPG, or WEBP image.");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMB} MB.`);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreview((previous) => {
      if (previous?.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }
      return previewUrl;
    });

    setError(null);
    setUploading(true);

    try {
      const response = await uploadMenuItemImage(file);

      if (!response.success || !response.data?.imageUrl) {
        throw new Error(response.message || "Image upload failed.");
      }

      onImageUrlChange(response.data.imageUrl);
    } catch (err) {
      console.error("Image upload failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload image. Please try again."
      );

      setImagePreview(null);
      onImageUrlChange(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setError(null);
    onImageUrlChange(null);
  };

  const isDisabled = disabled || uploading;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Dish Image
        <span className="ml-1 text-slate-400">(Optional)</span>
      </label>

      {imagePreview || imageUrl ? (
        <div className="w-full max-w-sm">
          <img
            src={imagePreview ?? imageUrl ?? ""}
            alt="Dish preview"
            className="h-48 w-full rounded-lg border object-cover"
          />

          {uploading && (
            <p className="mt-2 text-sm text-blue-600">
              Uploading image...
            </p>
          )}

          {!uploading && (
            <button
              type="button"
              onClick={removeImage}
              disabled={isDisabled}
              className="mt-2 text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              Remove image
            </button>
          )}
        </div>
      ) : (
        <label
          className={`flex min-h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-5 text-center ${
            isDisabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-slate-50"
          }`}
        >
          <span className="text-sm font-medium">
            Click to select an image
          </span>

          <span className="mt-1 text-xs text-slate-500">
            PNG, JPG or WEBP · Max {maxSizeMB} MB
          </span>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            disabled={isDisabled}
            onChange={handleImageChange}
          />
        </label>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}