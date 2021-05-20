import React from 'react';
import stl from './post.module.css';
import Avatar from './img/someava.jpg'

type PostProps_Type = { wallPosts: { id: number, likesCount: number, date: string, time: string, message: string }[] }

let Post: React.FC<PostProps_Type> = ({ wallPosts }) => {
    return <>
        {wallPosts.map(msg =>
            <div className={stl.post} key={msg.id}>
                <div className={stl.avatar}> <img src={Avatar} alt="err" /> </div>
                <div className={stl.message} >
                    <p className={stl.dateIndexer}>WAS WRITTEN {msg.date} AT {msg.time}</p>
                    <p className={stl.messageText}>{msg.message}</p>
                    <p className={stl.likesCounter}> {msg.likesCount}  ♥ Likes</p>
                </div>
            </div>)}
    </>
};

export default Post;

