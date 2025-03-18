import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ScreenshotUploadProps {
  onFileSelect: (file: File | null) => void;
}

export const ScreenshotUpload: React.FC<ScreenshotUploadProps> = ({ onFileSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {!preview ? (
          <label className="flex flex-col items-center cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Click to upload payment screenshot</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Payment Screenshot"
              className="max-h-64 mx-auto rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};