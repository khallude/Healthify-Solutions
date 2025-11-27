const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const Ddoctor = require("../models/DdoctorModel");
const User = require("../models/Newuser");
const cloudinary = require("cloudinary").v2; // ✅ Correct import

// ✅ Create a Blog Post (Doctor Only)
const createPost = async (req, res) => {
    try {
      const { title, summary, details } = req.body;
      const doctorId = req.user.id; // ✅ Extract from token
      let thumbnailUrl = "";
  
      if (!title || !summary || !details) {
        return res.status(400).json({ error: "Title, summary, and details are required." });
      }
  
      if (!req.file) {
        return res.status(400).json({ error: "Thumbnail is required." });
      }
  
      // ✅ Upload image to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_thumbnails",
      });
  
      thumbnailUrl = uploadedImage.secure_url;
  
      const newPost = new Blog({
        title,
        summary,
        details,
        doctor: doctorId,
        thumbnail: thumbnailUrl,
      });
  
      await newPost.save();
      res.status(201).json({ message: "Blog post created successfully", newPost });
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  const getAllPosts = async (req, res) => {
    try {
      const posts = await Blog.find()
        .populate("doctor", "fullName specialty profilePictureUrl") // Include profilePic if needed
        .sort({ createdAt: -1 }) // Newest posts first
        .select("title summary thumbnail likes comments createdAt doctor"); // Exclude `details` for efficiency
  
      res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts. Please try again later." });
    }
  };
  

// ✅ Like/Unlike a Post (Authenticated Users)
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id; // ✅ Authenticated user

    console.log("🔹 Received postId:", postId);
    console.log("🔹 Received userId:", userId);

    // Ensure postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID format" });
    }

    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let isLiked = false; // Track like status

    // ✅ Toggle Like
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      isLiked = true; // User liked the post
    } else {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    }

    await post.save();
    
    console.log("🔹 Updated likes:", post.likes.length);
    console.log("🔹 Like status:", isLiked ? "Liked" : "Unliked");

    res.status(200).json({ 
      message: isLiked ? "Post liked successfully" : "Post unliked successfully", 
      likes: post.likes.length, 
      isLiked 
    });

  } catch (error) {
    console.error("❌ Error liking post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Comment on a Post (Authenticated Users)
const commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // ✅ Authenticated user

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // ✅ Ensure comment is not empty
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ✅ Fetch User's Full Name
    const user = await User.findById(userId).select("fullName");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Add Comment with fullName
    const newComment = {
      user: userId,
      fullName: user.fullName, // Include fullName
      text: text.trim(), // Trim spaces
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ message: "Comment added", comments: post.comments });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// ✅ Delete a Comment (Doctor Only)
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id; // ✅ Authenticated user

    const post = await Blog.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // ✅ Find comment and check authorization
    const commentIndex = post.comments.findIndex((c) => c._id.toString() === commentId);
    if (commentIndex === -1) return res.status(404).json({ message: "Comment not found" });

    if (post.comments[commentIndex].user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    // ✅ Remove comment and save
    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({ message: "Comment deleted", comments: post.comments });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Blog.findById(postId).populate("comments.user", "fullName profileImage");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ comments: post.comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPostLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Blog.findById(postId).populate("likes", "fullName profilepictureUrl");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ likes: post.likes });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.postId).populate("doctor"); // Use Blog.findById

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error); // Log error details
    res.status(500).json({ message: "Server error" });
  }
};

const removeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id; // Get the logged-in user's ID from middleware

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment in the post
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Ensure that only the comment's author can delete it
    if (post.comments[commentIndex].user.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    // Remove the comment
    post.comments.splice(commentIndex, 1);
    await post.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error removing comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { createPost, getAllPosts, likePost, commentOnPost, deleteComment, getPostComments, getPostLikes, getPostById, removeComment };
