import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Header from './header';
import Content from './content';
import GifDetial from './gifDetail';
import { library } from '@fortawesome/fontawesome-svg-core'
// heart icon solid and regular
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
library.add(faHeartRegular, faHeartSolid)
// giphy api key
const API_KEY = 'YvUVytkIs6KeM6KGtQ0bXfGBvsdrDsKZ';

class App extends Component {
  // decided not to use redux and have app.js component manage the state since there is not much data moving around.
  state = {
    loading: true,
    gifs: [],
    displaying: 'trending',
    sortType: 'newest',
    searchTerm: '',
    favs: [],
    gifDetail: null
  }

  componentDidMount() {
    // fetch user's favorite gifs from local storage and set to state
    const favs = this.fetchFavsFromStorage();
    if (favs) {
      this.setState({ favs });
    }

    // fetch trending gifs and set to state
    this.fetchTrendingGifs().then(res => {
      this.setState({ gifs: res.data.data }, () => {
        // once gifs is set and after 50 mil sec.. change state.loading to false to get animation affect in the content component
        setTimeout(() => {
          this.setState({
            loading: false
          });
        }, 50);

      });
    });

    // on window scroll, when it reaches the bottom trigger an event and fetch more gifs
    window.onscroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1) {
        // fetch more gifs
        axios.get(`http://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${this.state.gifs.length + 15}`).then(res => {
          // slice the last 15 gifs and combine them with the current gifs in state
          const nextGifs = res.data.data.slice(this.state.gifs.length);
          const combineGifs = this.state.gifs.concat(nextGifs);
          this.setState({ gifs: combineGifs });
        });
      }
    };
  }

  // get request to get trending gifs
  fetchTrendingGifs = () => {
    return axios.get(`http://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=35`);
  }

  // fetch user's favorite gifs from local storage 
  // decided not to use database since it's a small app
  // should be ok for the requirements if data in storage is less than 5mb
  fetchFavsFromStorage = () => {
    return (JSON.parse(localStorage.getItem('favs')));
  }

  // handle switching display view between trending and favorites
  handleDisplay = (type) => {
    // display trending gifs
    if (type === 'trending') {
      this.fetchTrendingGifs().then(res => {
        this.setState({
          gifs: res.data.data,
          loading: true,
          displaying: 'trending',
          sortType: 'newest',
          gifDetail: null
        }, () => {
          setTimeout(() => {
            this.setState({
              loading: false
            });
          }, 10);
        });
      });
    }
    // display favorite gifs
    if (type === 'favorites') {
      this.setState({
        gifs: this.fetchFavsFromStorage(),
        loading: true, displaying: 'favorites',
        sortType: 'newest',
        gifDetail: null
      }, () => {
        setTimeout(() => {
          this.setState({
            loading: false
          });
        }, 50);
      });
    }
  }

  // add the heart icon to each gif - solid or regular
  applyHeartToGif = (gifs, favs) => {
    gifs.map(gif => {
      gif.fav = false;
      favs.forEach(fav => {
        if (gif.id === fav.id) {
          gif.fav = true
        }
      });
    });
  }

  // toggle between solid heart and regular heart when user clicks on it
  toggleFav = (gif) => {
    let favs = this.fetchFavsFromStorage();
    let foundIndex = false;
    let index = null;

    if (favs) {
      // check to see if the gif user clicked is in the storage
      favs.forEach((fav, i) => {
        if (fav.id === gif.id) {
          // if it is then capture the index
          foundIndex = true;
          index = i;
        }
      });

      if (foundIndex) {
        // if fav is found then remove it
        favs.splice(index, 1);
      } else {
        // otherwise add it
        favs.push(gif);
      }
    }

    // set updated favs to storage
    localStorage.setItem('favs', JSON.stringify(favs))
    // get updated favs from storage and set it to state
    this.setState({ favs: this.fetchFavsFromStorage() }, () => {
      if (this.state.displaying === 'favorites') {
        this.setState({ gifs: this.fetchFavsFromStorage() });
      }
    });

  }

  // handle user search gifs
  searchGifs = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    axios.get(`http://api.giphy.com/v1/gifs/search?q=${this.state.searchTerm}&api_key=${API_KEY}`).then(res => {
      console.log('got gifs', res.data.data);
      this.setState({ gifs: res.data.data, displaying: 'search', searchTerm: '' }, () => {
        // apply opacity animation
        setTimeout(() => {
          this.setState({
            loading: false
          });
        }, 50);
      });
    });
  }

  // handle search term on change
  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value })
  }

  // when user clicks on a gif, set state to render the gif details
  handleGifDetail = (gif) => {
    this.setState({ gifDetail: gif, displaying: null, sortType: null });
  }

  // sort gif by newest or oldest uploaded time
  handleSort = (type) => {
    const sorted = this.state.gifs.sort(function (a, b) {
      var timeA = a.import_datetime;
      var timeB = b.import_datetime;
      if (timeA > timeB) {
        return type === 'newest' ? -1 : 1;
      }
      if (timeA < timeB) {
        return type === 'newest' ? 1 : -1;
      }
      return 0;
    });
    this.setState({ gifs: sorted, sortType: type });
  }

  render() {
    const { gifs, loading, searchTerm, favs, sortType, displaying } = this.state;
    this.applyHeartToGif(gifs, favs);

    return (
      <div className="App" onScroll={this.handleScroll}>
        <Header
          searchTerm={searchTerm}
          searchGif={this.searchGifs}
          onSearchChange={this.onSearchChange}
          handleDisplay={this.handleDisplay}
          sortType={sortType}
          displaying={displaying}
          handleSort={this.handleSort} />

        {/* decided not to use routing since there's only 2 views. Not scallable but this should work with the requirements */}
        {this.state.gifDetail ?
          <GifDetial gif={this.state.gifDetail} /> :
          <Content
            gifs={gifs}
            loading={loading}
            toggleFav={this.toggleFav}
            handleScroll={this.handleScroll}
            handleGifDetail={this.handleGifDetail}
          />
        }
      </div>
    );
  }
}

export default App;
