import React from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Content({ gifs, loading, toggleFav, handleScroll, handleGifDetail }) {
    return (
        <div className="content" onScroll={handleScroll}>
            {gifs.map(gif => {
                // apply this to heart icon to get regular or solid heart
                const fav = gif.fav ? 'fas' : 'far';
                return (
                    <div className={`gif ${!loading ? 'show-gif' : null}`} key={gif.id}>
                        <img src={gif.images.fixed_width.url} alt='gif' onClick={() => { handleGifDetail(gif) }} />
                        <FontAwesomeIcon className="icon" icon={[fav, 'heart']} onClick={() => { toggleFav(gif) }} />
                    </div>
                );
            })}
        </div>
    );
}