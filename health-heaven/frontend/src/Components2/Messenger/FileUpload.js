import React, { useState, useRef } from "react";
import { Paperclip, X, Image, FileText, File } from "lucide-react";

const FileUpload = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    onFileSelect(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <File />;
    if (selectedFile.type.startsWith("image/")) return <Image />;
    return <FileText />;
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Attach file"
      >
        <Paperclip className="h-5 w-5 text-gray-500" />
      </button>

      {selectedFile && (
        <div className="absolute bottom-full left-0 mb-2 bg-white p-2 rounded-lg shadow-md border border-gray-200 min-w-[200px]">
          <div className="flex items-center gap-2">
            {getFileIcon()}
            <span className="text-sm truncate">{selectedFile.name}</span>
            <button
              type="button"
              onClick={clearSelection}
              className="ml-auto p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="max-w-[200px] max-h-[200px] rounded-lg"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
