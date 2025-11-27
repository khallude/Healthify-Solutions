import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, Heart, Share2, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [visibleComments, setVisibleComments] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blog/get-posts');
        
        // Fetch like counts for each post
        const postsWithLikes = await Promise.all(
          response.data.map(async (post) => {
            const likesResponse = await axios.get(`http://localhost:5000/api/blog/${post._id}/likes`);
            return { ...post, likes: likesResponse.data.likes };
          })
        );
        
        setPosts(postsWithLikes);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLikeToggle = async (postId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to like posts.");
        return;
      }

      // Toggle like
      await axios.put(
        `http://localhost:5000/api/blog/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Get updated like count
      const likesResponse = await axios.get(`http://localhost:5000/api/blog/${postId}/likes`);
      
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { 
            ...post, 
            liked: !post.liked, 
            likes: likesResponse.data.likes 
          } : post
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleComments = (postId, e) => {
    e.stopPropagation();
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const deleteComment = async (postId, commentId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete comments.");
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/blog/${postId}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Get the updated post data
      const postResponse = await axios.get(`http://localhost:5000/api/blog/get-posts/${postId}`)

      ;
      
      // Update the posts state with the new data
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: postResponse.data.comments } : post
        )
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const submitComment = async (postId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to comment.");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/blog/${postId}/comment`,
        { text: commentInputs[postId] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Get the updated post data
      const postResponse = await axios.get(`http://localhost:5000/api/blog/posts/${postId}`);
      
      // Update the posts state with the new data
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: postResponse.data.comments } : post
        )
      );
      
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Latest Health Insights</h1>
        <div className="flex gap-4">
          <select className="px-4 py-2 border rounded-md text-gray-600">
            <option>All Categories</option>
            <option>Cardiology</option>
            <option>Neurology</option>
            <option>Pediatrics</option>
          </select>
          <select className="px-4 py-2 border rounded-md text-gray-600">
            <option>Most Recent</option>
            <option>Most Popular</option>
            <option>Most Discussed</option>
          </select>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post._id}
            onClick={() => navigate(`/posts/${post._id}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden group"
          >
            <div className="relative">
              <img 
                src={post.thumbnail} 
                alt={post.title} 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute top-4 right-4">
                <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <Bookmark className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {post.category || 'Medical'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {post.summary}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <img 
                    src={post.doctor?.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.doctor?.fullName || 'Unknown')}&background=random`} 
                    alt={post.doctor?.fullName || 'Unknown'} 
                    className="w-10 h-10 rounded-full border-2 border-white" 
                  />
                  <div>
                    <p className="font-medium text-gray-900">{post.doctor?.fullName || "Unknown"}</p>
                    <p className="text-sm text-gray-500">{post.doctor?.specialty || "Medical Professional"}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button 
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                    onClick={(e) => handleLikeToggle(post._id, e)}
                  >
                    <Heart className={`w-5 h-5 ${post.liked ? 'fill-current text-red-500' : ''}`} />
                    <span>{post.likes?.length || 0}</span>
                  </button>
                  
                  <button 
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                    onClick={(e) => toggleComments(post._id, e)}
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {visibleComments[post._id] && (
                <div className="mt-4 space-y-4" onClick={e => e.stopPropagation()}>
                  {post.comments?.map((comment) => (
                    <div key={comment._id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author || 'Anonymous')}`}
                            alt={comment.author}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium text-sm">{comment.author || 'Anonymous'}</span>
                        </div>
                        {comment.isAuthor && (
                          <button
                            onClick={(e) => deleteComment(post._id, comment._id, e)}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{comment.text}</p>
                    </div>
                  ))}
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={commentInputs[post._id] || ""}
                      onChange={(e) => handleCommentChange(post._id, e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      onClick={(e) => submitComment(post._id, e)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default PostList;