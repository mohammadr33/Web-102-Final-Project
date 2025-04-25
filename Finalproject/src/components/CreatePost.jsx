import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function CreatePost() {
  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    const image = e.target.image.value;

    // Insert the new post into the Supabase database
    const { error } = await supabase
      .from('posts')
      .insert([{ title, content, image, upvotes: 0, comments: [] }]);

    if (error) {
      console.error('Error creating post:', error.message);
      alert('Failed to create post. Please try again.');
    } else {
      e.target.reset();
      navigate('/'); // Redirect to the home page
    }
  };

  return (
    <div>
      <h1>Create a New Post</h1>
      <form onSubmit={handleCreatePost}>
        <input name="title" placeholder="Post Title" required />
        <textarea name="content" placeholder="Content" />
        <input name="image" placeholder="Image URL" />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;