import React from 'react'
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
const EditPost = ({
  posts, handleEdit, editBody, editTitle, setEditTitle, setEditBody
}) => {
  const { id } = useParams();
  const post = posts.find(post =>(post.id).toString() === id);
  useEffect(() => {
    if (post) {
      setEditBody(post.body);
      setEditTitle(post.title);

    }
  }, [post, setEditTitle, setEditBody])
  return (
    <main className='NewPost'>
      {editTitle &&
        <> <h2>EditPost</h2>
          <form className='newPostForm' onSubmit={(e) => e.preventDefault()}>
            <label htmlFor='postTitle'>Title:</label>
            <input
              id="postTitle"
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <label htmlFor='postBody'>PostBody:</label>
            <textarea
              id='postBody'
              type="text"
              required
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            />
            <button type='submit' onClick={() => handleEdit(post.id)}>Submit</button>
          </form>
        </>
      }
      {!editTitle &&
        <>
          <h2>Post not found</h2>
          <p>Well, that's disappointing</p>
          <p>
            <Link to='/'>Visit Home Page</Link>
          </p>

        </>
      }

    </main>
  )
}

export default EditPost