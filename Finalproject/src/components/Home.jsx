import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

function Home({ posts, setPosts, setSelectedPost }) {
  const [sortOption, setSortOption] = useState('newest'); // State to track the selected sort option

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase.from('posts').select('*');

      // Apply sorting based on the selected option
      if (sortOption === 'newest') {
        query = query.order('time', { ascending: false });
      } else if (sortOption === 'popular') {
        query = query.order('upvotes', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, [setPosts, sortOption]); // Re-fetch posts when the sort option changes

  return (
    <div className="home-page">
      <div className="sort-options">
        <button
          className={`sort-button ${sortOption === 'newest' ? 'active' : ''}`}
          onClick={() => setSortOption('newest')}
        >
          Newest
        </button>
        <button
          className={`sort-button ${sortOption === 'popular' ? 'active' : ''}`}
          onClick={() => setSortOption('popular')}
        >
          Most Popular
        </button>
      </div>
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