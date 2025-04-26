import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import './PostPage.css';

function PostPage({ setPosts, posts }) {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null); // Local state for the current post
  const [error, setError] = useState(null); // Error state
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [editTitle, setEditTitle] = useState(''); // State for editing title
  const [editContent, setEditContent] = useState(''); // State for editing content

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching post:', error || 'No post found');
        setError('Post not found.');
        setPost(null);
      } else {
        const postWithComments = { ...data, comments: data.comments || [] };
        setPost(postWithComments);
        setError(null);
      }
    };

    fetchPost();
  }, [id]);

  const formatTimeNYC = (time) => {
    const options = {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(time));
  };

  const handleUpvote = async () => {
    if (!post) return;

    const updatedPost = { ...post, upvotes: post.upvotes + 1 };
    setPost(updatedPost);

    const updatedPosts = posts.map((p) =>
      p.id === post.id ? updatedPost : p
    );
    setPosts(updatedPosts);

    const { error } = await supabase
      .from('posts')
      .update({ upvotes: updatedPost.upvotes })
      .eq('id', post.id);

    if (error) {
      console.error('Error updating upvotes:', error);
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', post.id);

    if (error) {
      console.error('Error deleting post:', error);
    } else {
      setPosts(posts.filter((p) => p.id !== post.id));
      navigate('/'); // Redirect to home after deletion
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!post) return;

    const comment = e.target.comment.value;

    const updatedComments = [...post.comments, comment];
    const updatedPost = { ...post, comments: updatedComments };
    setPost(updatedPost);

    const updatedPosts = posts.map((p) =>
      p.id === post.id ? updatedPost : p
    );
    setPosts(updatedPosts);

    const { error } = await supabase
      .from('posts')
      .update({ comments: updatedComments })
      .eq('id', post.id);

    if (error) {
      console.error('Error adding comment:', error);
    }

    e.target.reset();
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`); // Redirect to the edit page
  };

  if (error) return <p>{error}</p>;

  if (!post) return null; // Return nothing if the post is not yet loaded

  return (
    <div className="post-page">
      <button className="back-button" onClick={() => navigate('/')}>
        Back
      </button>
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Edit title"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Edit content"
          />
          <button className="save-button" onClick={handleSaveEdit}>
            Save
          </button>
        </div>
      ) : (
        <>
          <h1 className="post-title">{post.title}</h1>
          {post.image && (
            <img src={post.image} alt={post.title} className="post-image" />
          )}
          <p className="post-content">{post.content}</p>
          <p className="post-time">Posted on: {formatTimeNYC(post.time)}</p>
        </>
      )}
      <div className="post-actions">
        <div className="action-buttons">
          <p className="upvotes">Upvotes: {post.upvotes}</p>
          <button className="upvote-button" onClick={handleUpvote}>
            Upvote
          </button>
          <button className="edit-button" onClick={handleEdit}>
            Edit Post
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete Post
          </button>
        </div>
      </div>
      <form onSubmit={handleComment} className="comment-form">
        <input name="comment" placeholder="Add a comment" required />
        <button type="submit" className="comment-button">
          Comment
        </button>
      </form>
      <ul className="comments-list">
        {post.comments.map((comment, index) => (
          <li key={index} className="comment-item">
            {comment}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostPage;
