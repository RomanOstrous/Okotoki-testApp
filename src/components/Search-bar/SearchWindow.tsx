import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Search from '../../assets/icons/search.svg';
import StarActive from '../../assets/icons/codicon--star-full.svg';
import Star from '../../assets/icons/codicon--star-empty.svg';
import Remove from '../../assets/icons/ic--baseline-clear.svg';
import './SearchWindow.css';

type Props = {
  coins: string[];
}

const SearchWindow: React.FC<Props> = ({ coins }) => {
  const [search, setSearch] = useState('');
  const [favoriteCoins, setFavoriteCoins] = useState<boolean[]>(() => {
    const storedFavorites = localStorage.getItem('favoriteCoins');
    return storedFavorites ? JSON.parse(storedFavorites) : new Array(coins.length).fill(false);
  });
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    localStorage.setItem('favoriteCoins', JSON.stringify(favoriteCoins));
  }, [favoriteCoins]);

  const handleStar = useCallback((index: number) => {
    setFavoriteCoins(prevFavoriteCoins => {
      const updatedFavorites = [...prevFavoriteCoins];
      updatedFavorites[index] = !updatedFavorites[index];
      return updatedFavorites;
    });
  }, []);

  const toggleShowFavorites = useCallback(() => {
    setShowFavorites(prevShowFavorites => !prevShowFavorites);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const searchCoinFind = useMemo(() => {
    return search.length > 0 
      ? coins.filter(coin => coin.toLowerCase().startsWith(search.toLowerCase())) 
      : coins;
  }, [search, coins]);

  return (
    <div className="search">
      <div className="search__header">
        <img src={Search} alt="search" />
        <input 
          className="search__header-input"
          type="text" 
          placeholder='Search...'
          value={search}
          onChange={handleSearchChange}
        />

        {search.length > 0 && (
          <button 
          className="search__header-remove"
          onClick={() => setSearch('')}
          >
            <img src={Remove} alt="remove" />
          </button>
        )}
      </div>

      <div className="search__filters">
        <button
          className="search__filters-button"
          onClick={toggleShowFavorites}
        >
          <img src={StarActive} alt="favorite" />
          <p>
            FAVORITES
          </p>
        </button>

        <button
          className="search__filters-button"
          onClick={() => setShowFavorites(false)}
        >
          ALL COINS
        </button>
      </div>

      <ul className="search__list">
        {searchCoinFind.map((coin, index) => {
          if (showFavorites && !favoriteCoins[index]) {
            return null;
          }

          return (
            <li className="search__list-item" key={coin}>
              <button
                className="search__list-button"
                onClick={() => handleStar(index)}
              >
                <img src={favoriteCoins[index] ? StarActive : Star} alt="star" />
              </button>

              <p className="search__list-text">{coin}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchWindow;
