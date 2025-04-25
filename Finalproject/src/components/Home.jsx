import { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

function Home({ posts, setPosts, setSelectedPost }) {
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('time', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, [setPosts]);

  return (
    <div className="home-page">
      <ul className="thread-list">
        {posts.map((post) => (
          <li key={post.id} className="thread-item">
            <Link
              to={`/post/${post.id}`}
              onClick={() => setSelectedPost(post)}
              className="thread-link"
            >
              <h2>{post.title}</h2>
              <p>Upvotes: {post.upvotes}</p>
              <p>{new Date(post.time).toLocaleString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;