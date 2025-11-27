import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Blog {
  _id: string;
  title: string;
  summary: string;
  thumbnail?: string;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/blog/get-posts");
      if (!response.ok) throw new Error("Failed to fetch blogs");

      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete blog
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/blog/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      // Remove the deleted blog from the UI
      setBlogs(blogs.filter((blog) => blog._id !== id));
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting blog. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-lg">Loading blogs...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">All Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-600">No blogs available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              {blog.thumbnail && (
                <img src={blog.thumbnail} alt={blog.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold">{blog.title}</h3>
                <p className="text-gray-600">{blog.summary}</p>

                <div className="flex justify-between items-center mt-3">
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-blue-600 font-medium inline-block"
                  >
                    Read More →
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
