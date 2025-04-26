import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';

function EditPost({ setPosts, posts }) {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the post ID from the URL
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // State for the image URL
  const [error, setError] = useState(null);

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
      } else {
        setTitle(data.title);
        setContent(data.content);
        setImageUrl(data.image || ''); // Set the existing image URL if available
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from('posts')
      .update({ title, content, image: imageUrl })
      .eq('id', id);

    if (error) {
      console.error('Error updating post:', error);
    } else {
      const updatedPosts = posts.map((p) =>
        p.id === id ? { ...p, title, content, image: imageUrl } : p
      );
      setPosts(updatedPosts);
      navigate(`/post/${id}`); // Redirect back to the post page
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="edit-post-page">
      <h1>Edit Post</h1>
      <form onSubmit={handleUpdatePost}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
          {imageUrl && (
            <img src={imageUrl} alt="Preview" className="image-preview" />
          )}
        </div>
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}

export default EditPost;