import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './PostPage.css';

function PostPage({ post, setPosts, posts }) {
  const navigate = useNavigate();

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', post.id);

    if (error) {
      console.error('Error updating upvotes:', error);
    } else {
      const updatedPosts = posts.map((p) =>
        p.id === post.id ? { ...p, upvotes: data[0].upvotes } : p
      );
      setPosts(updatedPosts);
    }
  };

  const handleDelete = async () => {
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
    const comment = e.target.comment.value;

    const updatedComments = [...post.comments, comment];
    const { data, error } = await supabase
      .from('posts')
      .update({ comments: updatedComments })
      .eq('id', post.id);

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      const updatedPosts = posts.map((p) =>
        p.id === post.id ? { ...p, comments: data[0].comments } : p
      );
      setPosts(updatedPosts);
      e.target.reset();
    }
  };

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