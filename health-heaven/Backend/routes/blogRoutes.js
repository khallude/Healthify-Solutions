const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/multer");
const doctorMiddleware = require("../middlewares/DoctorMiddleware");
const NewauthMiddleware = require("../middlewares/NewauthMiddleware");

const {
  createPost,
  getAllPosts,
  likePost,
  commentOnPost,
  deleteComment, 
  getPostComments,
  getPostLikes,
  getPostById,
  removeComment
  
} = require("../Controller/blogController");


// ✅ Doctor can create a blog post (Supports Image Upload)
router.post(
  "/create",
  doctorMiddleware,
  upload.single("thumbnail"),
  createPost
);

// ✅ Get all blog posts (Public)
router.get("/get-posts", getAllPosts);

// ✅ Like/unlike a post (Authenticated Users)
router.put("/:postId/like", NewauthMiddleware, likePost);

// ✅ Comment on a post (Authenticated Users)
router.post("/:postId/comment", NewauthMiddleware, commentOnPost);

router.delete("/:postId/comment/:commentId", NewauthMiddleware, deleteComment);
router.get("/:postId/comments", getPostComments);

router.get("/:postId/likes", getPostLikes);
router.get("/get-posts/:postId", getPostById);

router.delete("/:postId/comment/:commentId", NewauthMiddleware, removeComment);
// ✅ Delete a comment (Doctor Only)
router.delete("/:postId/comment/:commentId", doctorMiddleware, deleteComment);

module.exports = router;

