import React from 'react';

export default function Header(props) {
    const { searchTerm, onSearchChange, searchGif, handleDisplay, sortType, handleSort, displaying } = props;
    return (
        <div className="header">
            {/* search bar */}
            <form onSubmit={searchGif}>
                <input className="search-input" placeholder="Search Gifs..." value={searchTerm} onChange={onSearchChange} />
                <button className="search-button" type="submit">Search</button>
            </form>
            {/* buttons */}
            <div className="buttons">
                <div className="btn-title">Display:</div>
                <div className={`button ${displaying === 'trending' ? 'button-active' : null}`} onClick={() => { handleDisplay('trending') }}>
                    Trending
                </div>
                <div className={`button ${displaying === 'favorites' ? 'button-active' : null}`} onClick={() => { handleDisplay('favorites') }}>
                    Favorites
                </div>

                <div className="btn-title sort-title">Sort by:</div>
                <div className={`button ${sortType === 'newest' ? 'button-active' : null}`} onClick={() => { handleSort('newest') }}>
                    Newest
                </div>
                <div className={`button ${sortType === 'oldest' ? 'button-active' : null}`} onClick={() => { handleSort('oldest') }}>
                    Oldest
                </div>

            </div>
        </div>
    );
}