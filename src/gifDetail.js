import React from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function GifDetail({ gif }) {
    console.log(gif);
    return (
        <div className="detail">
            <img className="img-detail" src={gif.images.original.url} alt='gif' />
            <div>{gif.title}</div>
            <div>Rated: {gif.rating}</div>
        </div>
    );
}