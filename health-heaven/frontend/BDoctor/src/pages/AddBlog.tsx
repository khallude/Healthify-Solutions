import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBlog: React.FC = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState(""); // ✅ Renamed 'details' to 'content'
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // ✅ Set loading state when submitting

    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("details", content); // ✅ 'details' replaced with 'content'
    if (image) {
      formData.append("thumbnail", image); // ✅ 'thumbnail' replaced with 'image'
    }

    try {
      const response = await fetch("http://localhost:5000/api/blog/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Include token
        },
        body: formData, // ✅ No need to set "Content-Type" (handled by FormData)
      });

      const data = await response.json();
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4">Add New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter blog title"
            required
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block font-medium">Summary:</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={2}
            placeholder="Enter blog summary"
            required
          ></textarea>
        </div>

        {/* Content */}
        <div>
          <label className="block font-medium">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="Enter blog content"
            required
          ></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium">Upload Photo:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-lg" />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg" />}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
