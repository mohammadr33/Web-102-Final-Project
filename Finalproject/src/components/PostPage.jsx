import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './PostPage.css';

function PostPage({ setPosts, posts }) {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null); // Local state for the current post
  const [referencedPost, setReferencedPost] = useState(null); // State for the referenced post
  const [error, setError] = useState(null); // Error state

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
        setReferencedPost(null); // Clear the referenced post if the main post is not found
      } else {
        setPost(data);
        setError(null);

        // Fetch the referenced post if it exists
        if (data.referenced_post_id) {
          const { data: refData, error: refError } = await supabase
            .from('posts')
            .select('*')
            .eq('id', data.referenced_post_id)
            .single();

          if (refError) {
            console.error('Error fetching referenced post:', refError);
            setReferencedPost(null); // Clear the referenced post if there's an error
          } else {
            setReferencedPost(refData);
          }
        } else {
          setReferencedPost(null); // Clear the referenced post if none exists
        }
      }
    };

    fetchPost();
  }, [id]); // Re-run the effect whenever the `id` changes

  const handleComment = async (e) => {
    e.preventDefault();
    const comment = e.target.comment.value;

    const updatedComments = [...(post.comments || []), comment];

    const { error } = await supabase
      .from('posts')
      .update({ comments: updatedComments })
      .eq('id', id);

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setPost({ ...post, comments: updatedComments });
      e.target.reset();
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
    } else {
      setPosts(posts.filter((post) => post.id !== id));
      navigate('/'); // Redirect to the home page
    }
  };

  const handleUpvote = async () => {
    const updatedUpvotes = post.upvotes + 1;

    const { error } = await supabase
      .from('posts')
      .update({ upvotes: updatedUpvotes })
      .eq('id', id);

    if (error) {
      console.error('Error upvoting post:', error);
    } else {
      setPost({ ...post, upvotes: updatedUpvotes });
    }
  };

  if (error) return <p>{error}</p>;

  if (!post) return null; // Return nothing if the post is not yet loaded

  return (
    <div className="post-page">
      <div className="post-header">
        <button className="back-button" onClick={() => navigate('/')}>
          Back
        </button>
        <p className="post-id">Post ID: {id}</p>
      </div>
      <h1 className="post-title">{post.title}</h1>
      {post.image && (
        <img src={post.image} alt={post.title} className="post-image" />
      )}
      <p className="post-content">{post.content}</p>
      <p className="post-time">Posted on: {new Date(post.time).toLocaleString()}</p>

      <div className="post-actions">
        <div className="action-buttons">
          <p className="upvotes">Upvotes: {post.upvotes}</p>
          <button className="upvote-button" onClick={handleUpvote}>
            Upvote
          </button>
          <button className="edit-button" onClick={() => navigate(`/edit/${id}`)}>
            Edit Post
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete Post
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <form onSubmit={handleComment} className="comment-form">
        <input name="comment" placeholder="Add a comment" required />
        <button type="submit" className="comment-button">
          Comment
        </button>
      </form>

      {/* Referenced Post Section */}
      {referencedPost && (
        <div className="referenced-post">
          <h3>Referenced Post:</h3>
          <Link
            to={`/post/${referencedPost.id}`}
            className="referenced-post-link"
            onClick={() => navigate(`/post/${referencedPost.id}`)}
          >
            <h4>{referencedPost.title}</h4>
            <p>{referencedPost.content}</p>
          </Link>
        </div>
      )}

      {/* Comments List */}
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
