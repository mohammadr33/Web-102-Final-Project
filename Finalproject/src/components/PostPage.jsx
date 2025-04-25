import './PostPage.css';

function PostPage({ post, setSelectedPost, setPosts, posts }) {
  const handleUpvote = () => {
    const updatedPosts = posts.map((p) =>
      p.id === post.id ? { ...p, upvotes: p.upvotes + 1 } : p
    );
    setPosts(updatedPosts);
  };

  const handleDelete = () => {
    setPosts(posts.filter((p) => p.id !== post.id));
    setSelectedPost(null);
  };

  const handleComment = (e) => {
    e.preventDefault();
    const comment = e.target.comment.value;
    const updatedPosts = posts.map((p) =>
      p.id === post.id ? { ...p, comments: [...p.comments, comment] } : p
    );
    setPosts(updatedPosts);
    e.target.reset();
  };

  return (
    <div className="post-page">
      <button onClick={() => setSelectedPost(null)}>Back</button>
      <h1>{post.title}</h1>
      <img src={post.image} alt={post.title} />
      <p>{post.content}</p>
      <p>Upvotes: {post.upvotes}</p>
      <button onClick={handleUpvote}>Upvote</button>
      <button onClick={handleDelete}>Delete Post</button>

      <form onSubmit={handleComment}>
        <input name="comment" placeholder="Add a comment" required />
        <button type="submit">Comment</button>
      </form>

      <ul>
        {post.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  );
}

export default PostPage;