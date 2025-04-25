import { useState } from 'react';
import './App.css';
import Home from './components/Home';
import PostPage from './components/PostPage';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div>
      {selectedPost ? (
        <PostPage
          post={selectedPost}
          setSelectedPost={setSelectedPost}
          setPosts={setPosts}
          posts={posts}
        />
      ) : (
        <Home posts={posts} setPosts={setPosts} setSelectedPost={setSelectedPost} />
      )}
    </div>
  );
}

export default App;
