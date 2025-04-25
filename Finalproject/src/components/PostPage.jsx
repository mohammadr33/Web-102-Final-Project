import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import './PostPage.css';

function PostPage({ setPosts, posts }) {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null); // Local state for the current post

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
      } else {
        const postWithComments = { ...data, comments: data.comments || [] };
        setPost(postWithComments); // Set the fetched post in local state
      }
    };

    fetchPost();
  }, [id]);

  const handleUpvote = async () => {
    if (!post) return;

    // Optimistically update the UI
    const updatedPost = { ...post, upvotes: post.upvotes + 1 };
    setPost(updatedPost);

    const updatedPosts = posts.map((p) =>
      p.id === post.id ? updatedPost : p
    );
    setPosts(updatedPosts);

    // Update in Supabase
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

    // Optimistically update the UI
    const updatedComments = [...post.comments, comment];
    const updatedPost = { ...post, comments: updatedComments };
    setPost(updatedPost);

    const updatedPosts = posts.map((p) =>
      p.id === post.id ? updatedPost : p
    );
    setPosts(updatedPosts);

    // Update in Supabase
    const { error } = await supabase
      .from('posts')
      .update({ comments: updatedComments })
      .eq('id', post.id);

    if (error) {
      console.error('Error adding comment:', error);
    }

    e.target.reset(); // Clear the input field
  };

  if (!post) {
    return <p>Loading...</p>; // Show a loading message while fetching the post
  }

  return (
    <div className="post-page">
      <button className="back-button" onClick={() => navigate('/')}>
        Back
      </button>
      <h1 className="post-title">{post.title}</h1>
      {post.image && <img src={post.image} alt={post.title} className="post-image" />}
      <p className="post-content">{post.content}</p>
      <div className="post-actions">
        <div className="action-buttons">
          <p className="upvotes">Upvotes: {post.upvotes}</p>
          <button className="upvote-button" onClick={handleUpvote}>
            Upvote
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