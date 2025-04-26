import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function CreatePost() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(''); // State for the image URL

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const content = e.target.content.value;

    const { data, error } = await supabase.from('posts').insert([
      {
        title,
        content,
        image: imageUrl, // Add the image URL to the post
        time: new Date().toISOString(), // Store the current time in UTC
        upvotes: 0,
        comments: [],
      },
    ]);

    if (error) {
      console.error('Error creating post:', error);
    } else {
      console.log('Post created:', data);
      navigate('/'); // Redirect to the home page after creating the post
    }
  };

  return (
    <div>
      <h1>Create a New Post</h1>
      <form onSubmit={handleCreatePost}>
        <input name="title" placeholder="Post Title" required />
        <textarea name="content" placeholder="Content" />
        <input
          name="image"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)} // Update the image URL state
        />
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="image-preview" />
        )}
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;