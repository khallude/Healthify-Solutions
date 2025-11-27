import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, Heart, Share2, Bookmark, ArrowLeft, Trash2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blog/get-posts/${postId}`);
        const likesResponse = await axios.get(`http://localhost:5000/api/blog/${postId}/likes`);
        setPost({ ...response.data, likes: likesResponse.data.likes });
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to like posts.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/blog/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const likesResponse = await axios.get(`http://localhost:5000/api/blog/${postId}/likes`);
      setPost(prev => ({
        ...prev,
        liked: !prev.liked,
        likes: likesResponse.data.likes
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to comment.");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/blog/${postId}/comment`,
        { text: commentInput },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const response = await axios.get(`http://localhost:5000/api/blog/get-posts/${postId}`);
      setPost(prev => ({
        ...prev,
        comments: response.data.comments
      }));
      setCommentInput('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete comments.");
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/blog/${postId}/delete/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const response = await axios.get(`http://localhost:5000/api/blog/get-posts/${postId}`);
      setPost(prev => ({
        ...prev,
        comments: response.data.comments
      }));
      setCommentToDelete(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Post not found</h2>
          <p className="text-gray-600 mb-6">The post you're looking for might have been removed or is temporarily unavailable.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="group mb-8 inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to posts</span>
        </button>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
          <div className="relative">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <img
                  src={post.doctor?.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.doctor?.fullName || 'Unknown')}&background=random`}
                  alt={post.doctor?.fullName || 'Unknown'}
                  className="w-14 h-14 rounded-full border-4 border-white shadow-lg"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{post.doctor?.fullName || "Unknown"}</h3>
                  <p className="text-gray-500">{post.doctor?.specialty || "Medical Professional"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {post.category || 'Medical'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
            {/* <p className="text-xl text-gray-600 mb-8 leading-relaxed">{post.summary}</p> */}

            <div className="text-xl text-gray-600 mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.details }} />

            <div className="flex items-center justify-between py-6 border-t border-gray-100">
              <div className="flex items-center space-x-8">
                <button
                  onClick={handleLikeToggle}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors group"
                >
                  <Heart className={`w-6 h-6 transform group-hover:scale-110 transition-transform ${post.likes?.length > 0 ? 'fill-current text-red-500' : ''}`} />
                  <span className="font-medium">{post.likes?.length || 0} likes</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 group">
                  <MessageSquare className="w-6 h-6 group-hover:text-blue-500 transition-colors" />
                  <span className="font-medium">{post.comments?.length || 0} comments</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors group">
                  <Share2 className="w-6 h-6 transform group-hover:rotate-12 transition-transform" />
                  <span className="font-medium">Share</span>
                </button>
              </div>
              <button className="p-2 text-gray-600 hover:text-yellow-500 transition-colors transform hover:scale-110">
                <Bookmark className="w-6 h-6" />
              </button>
            </div>
          </div>
        </article>

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Comments</h2>
          
          <form onSubmit={handleCommentSubmit} className="mb-10">
            <div className="flex space-x-4">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 border-2 border-gray-200 rounded-xl px-6 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all transform hover:scale-105 focus:ring-4 focus:ring-blue-200"
              >
                Post Comment
              </button>
            </div>
          </form>

          <div className="space-y-6">
            {post.comments?.map((comment) => (
              <div key={comment._id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.fullName || 'Anonymous')}`}
                      alt={comment.user?.fullName || 'Anonymous'}
                      className="w-10 h-10 rounded-full border-2 border-white shadow"
                    />
                    <div>
                      <span className="font-semibold text-gray-900">{comment.user?.fullName || 'Anonymous'}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  {comment.user === localStorage.getItem('userId') && (
                    <button
                      onClick={() => setCommentToDelete(comment)}
                      className="flex items-center px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      <span className="font-medium">Delete</span>
                    </button>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Comment Confirmation Modal */}
      {commentToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Delete Comment</h3>
              <button
                onClick={() => setCommentToDelete(null)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setCommentToDelete(null)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteComment(commentToDelete._id)}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all transform hover:scale-105 focus:ring-4 focus:ring-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;