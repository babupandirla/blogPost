import About from "./About";
import EditPost from "./EditPost";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import Missing from "./Missing";
import Nav from "./Nav";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import { Route, Switch, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from './api/posts';

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const history = useHistory();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (err) {

      }
    }
    fetchPosts();
  }, [])
  useEffect(() => {
    const filteredPosts = posts.filter(post =>
      ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase())
    );
    setSearchResults(filteredPosts.reverse());
  }, [posts, search])
  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`)
      const postsList = posts.filter((post) => post.id !== id);
      setPosts(postsList);
      history.push('/')
    } catch (err) {
      console.log(err);
    }

  }
  const handleEdit= async (id)=>{
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try{
      const response= await api.put(`/posts/${id}`,updatedPost);
      setPosts(posts.map(post=>post.id===id?{...response.data}:post));
      setEditBody('');
      setEditTitle('');
      history.push('/')
    } catch(err){

    }

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(posts)
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    console.log(id);
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const response = await api.post('/posts', newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      history.push('/');
    } catch (err) {
      console.log(err);
    }


  }
  return (
    <div className="App">
      <Header title="React Js Blog" />
      <Nav search={search} setSearch={setSearch} />
      <Switch>
        <Route exact path="/">
          <Home posts={searchResults} setPosts={setPosts} />
        </Route>
        <Route exact path="/post">
          <NewPost
            handleSubmit={handleSubmit}
            postBody={postBody}
            postTitle={postTitle}
            setPostBody={setPostBody}
            setPostTitle={setPostTitle}
          />
        </Route>
        <Route path="/post/:id">
          <PostPage posts={posts} handleDelete={handleDelete} />
        </Route>
        <Route path="/edit/:id">
        <EditPost
            posts={posts}
            handleEdit={handleEdit}
            editBody={editBody}
            editTitle={editTitle}
            setEditBody={setEditBody}
            setEditTitle={setEditTitle}
          />
        </Route>
        <Route path="/about" component={About} />
        <Route path="*" component={Missing} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
