const Comment = require('../models/Comment');
const Candidate = require('../models/Candidate');

// @desc    Get comments for a candidate
// @route   GET /api/candidates/:id/comments
// @access  Private
const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if candidate exists
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const comments = await Comment.find({ candidateId: id })
      .populate('authorId', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments: comments.map(comment => ({
        id: comment._id,
        author: comment.author,
        content: comment.content,
        timestamp: comment.createdAt,
        authorId: comment.authorId._id
      }))
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error while fetching comments' });
  }
};

// @desc    Add a comment to a candidate
// @route   POST /api/candidates/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Validate input
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Check if candidate exists
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Create comment
    const comment = new Comment({
      candidateId: id,
      author: req.user.username,
      content: content.trim(),
      authorId: req.user._id
    });

    await comment.save();

    // Populate author info
    await comment.populate('authorId', 'username');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: {
        id: comment._id,
        author: comment.author,
        content: comment.content,
        timestamp: comment.createdAt,
        authorId: comment.authorId._id
      }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/candidates/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    // Check if candidate exists
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Find and check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if comment belongs to the candidate
    if (comment.candidateId.toString() !== id) {
      return res.status(400).json({ message: 'Comment does not belong to this candidate' });
    }

    // Check if user is the author or has admin privileges
    if (comment.authorId.toString() !== req.user._id.toString() && 
        req.user.role !== 'MASTER' && 
        req.user.role !== 'HR Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error while deleting comment' });
  }
};

module.exports = {
  getComments,
  addComment,
  deleteComment
};
