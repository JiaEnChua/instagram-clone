import React from 'react';

function Posts({ user, image }) {
  return (
    <div>
      <p>{user}</p>
      <img src={image} alt='post_img' />
    </div>
  );
}

export default Posts;
