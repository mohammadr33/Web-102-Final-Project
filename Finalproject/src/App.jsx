import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import PostPage from './components/PostPage';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <Router>
      <div>
        <nav className="navbar">
          <Link to="/" className="logo">Soccer Forum</Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/create-post">Create Post</Link>
          </div>
        </nav>
        <Routes>
          <Route
            path="/"
            element={<Home posts={posts} setPosts={setPosts} setSelectedPost={setSelectedPost} />}
          />
          <Route
            path="/create-post"
            element={<CreatePost />}
          />
          <Route
            path="/post/:id"
            element={
              selectedPost && (
                <PostPage
                  post={selectedPost}
                  setSelectedPost={setSelectedPost}
                  setPosts={setPosts}
                  posts={posts}
                />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
