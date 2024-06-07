import React, { useEffect, useState, useCallback, useRef } from 'react';
import SearchWindow from "./components/Search-bar/SearchWindow";
import Search from './assets/icons/search.svg';
import './App.css';
import classNames from 'classnames';

function App() {
  const [coins, setCoins] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setShowMenu(prevShowMenu => !prevShowMenu);
  };

  const getRandomColor = useCallback(() => {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      const response = await fetch('https://api-eu.okotoki.com/coins');
      const data = await response.json();

      setCoins(data);
      const initialColors = data.map(() => getRandomColor());
      setColors(initialColors);
    };

    fetchCoins();
  }, [getRandomColor]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setShowMenu(false);
    }
  }, []);

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, handleClickOutside]);

  return (
    <>
      <header className='header'>
        <div className='header-container'>
          <button 
            className={classNames('header__search', { 'header__search--active': showMenu === true })}
            onClick={toggleMenu}
            ref={buttonRef}
          >
            <img src={Search} alt="search" />
            <p className='header__search-text'>SEARCH</p>
          </button>

          {showMenu && <div ref={searchRef}><SearchWindow coins={coins} /></div>}
        </div>
      </header>
      <main className='body'>
        <ul className='body__list'>
          {coins.map((coin, index) => (
            <li className='body__item' style={{ color: colors[index] }} key={index}>{coin}</li>
          ))}
        </ul>
      </main>
    </>
  );
}

export default App;
