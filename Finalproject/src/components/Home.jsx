import { useState } from 'react';

function Home({ posts, setPosts, setSelectedPost }) {
  const [sortBy, setSortBy] = useState('time');
  const [search, setSearch] = useState('');

  const sortedPosts = [...posts]
    .filter((post) => post.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sortBy === 'time' ? b.time - a.time : b.upvotes - a.upvotes));

  const handleCreatePost = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    const image = e.target.image.value;

    const newPost = {
      id: Date.now(),
      title,
      content,
      image,
      time: Date.now(),
      upvotes: 0,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    e.target.reset();
  };

  return (
    <div>
      <h1>Soccer Forum</h1>
      <form onSubmit={handleCreatePost}>
        <input name="title" placeholder="Post Title" required />
        <textarea name="content" placeholder="Content" />
        <input name="image" placeholder="Image URL" />
        <button type="submit">Create Post</button>
      </form>

      <div>
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="time">Sort by Time</option>
          <option value="upvotes">Sort by Upvotes</option>
        </select>
      </div>

      <ul>
        {sortedPosts.map((post) => (
          <li key={post.id} onClick={() => setSelectedPost(post)}>
            <h2>{post.title}</h2>
            <p>Upvotes: {post.upvotes}</p>
            <p>{new Date(post.time).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;