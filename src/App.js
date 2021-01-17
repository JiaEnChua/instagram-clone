import React, { useState, useEffect } from 'react';
import './App.css';
import axios from './axios';
import Pusher from 'pusher-js';
import Posts from './Posts';

function App() {
  const [posts, setPosts] = useState(null);
  const [pusherData, setPusherData] = useState(null);
  const image =
    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.insidehook.com%2Fdaily_brief%2Ftech%2Felon-musk-experimental-school-astra-nova&psig=AOvVaw1qjFJYB40pHBtPCBaYDh8z&ust=1611002160561000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMjSwu7oo-4CFQAAAAAdAAAAABAD';
  const user = 'elon';
  const caption = 'Hello world first post in InstaClone';
  const submitPost = () => {
    console.log('submitting post');
    axios.post('./upload', {
      caption: caption,
      image: image,
      user: user,
    });
  };
  const fetchPosts = async () => {
    await axios
      .get('sync')
      .then((res) => {
        console.log('data >>', res);
        setPosts(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchPosts();
    return () => {};
  }, []);

  useEffect(() => {
    const pusher = new Pusher('fc06f27031d8e2061c9c', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe('posts');
    channel.bind('inserted', (data) => {
      console.log('pusher >> ', data);
      setPusherData(data);
      // console.log(posts); // posts is null here
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (posts) {
      setPosts([...posts, pusherData]);
    }
    return () => {};
  }, [pusherData]);

  return (
    <div className='App'>
      <h1>Hello world</h1>
      <button onClick={submitPost}>Submit</button>
      {posts?.map((doc) => (
        <Posts image={doc.image} user={doc.user} key={doc._id} />
      ))}
    </div>
  );
}

export default App;
