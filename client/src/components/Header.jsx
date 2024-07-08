import React, { useEffect, useState } from 'react';
import { Avatar, Button, Dropdown } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsFillSunFill, BsMoonStarsFill } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import logo from "../images/logo_gross.svg";
import "../index.css";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const linkClass = theme === 'dark' ? 'navbar-link-dark' : 'navbar-link';
  const linkClassDesktop = theme === 'dark' ? 'navbar-link-dark-desktop' : 'navbar-link-desktop';

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm('');
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/user/signout`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setSearchTerm('');
  };

  const getLinkClass = (path) => {
    return location.pathname === path ? `link-active ${linkClassDesktop}` : linkClassDesktop;
  };

  return (
    <nav className="bg-[#f7f7fa] border-[#9bb0ddd3] dark:bg-[#090d1c] border-b-2">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className={`h-11 ${theme === 'dark' ? 'filter invert' : ''}`} />
          </Link>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-grow justify-center">
          <form onSubmit={handleSubmit}>
            <input 
              type='text'
              placeholder='Suche...'
              className='hidden lg:inline p-2 border dark:bg-[#0b1020d4] bg-[#f7f7fa] rounded-md mr-10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <button className=''></button>
          <ul className="font-medium flex space-x-8 mt-[8px]">
            <li>
              <Link
                to="/"
                className={`py-1 px-3 hover:text-[#377fb6] ${linkClass} ${getLinkClass('/')}`}
                aria-current={location.pathname === '/' ? 'page' : undefined}
              >
                Start
              </Link>
            </li>
            <div className="hidden lg:inline" style={{ borderLeft: '1px solid grey', height: '25px', paddingRight: '8px' }}></div>
            <li>
              <Link
                to="/about"
                className={`py-1 px-3 hover:text-[#377fb6] ${linkClass} ${getLinkClass('/about')}`}
                aria-current={location.pathname === '/about' ? 'page' : undefined}
              >
                Über uns
              </Link>
            </li>
            <div className="hidden lg:inline" style={{ borderLeft: '1px solid grey', height: '25px', paddingRight: '8px' }}></div>
            <li>
              <Link
                to="/search"
                className={`py-1 px-3 hover:text-[#377fb6] ${linkClass} ${getLinkClass('/search')}`}
                aria-current={location.pathname === '/search' ? 'page' : undefined}
              >
                Alle Beiträge
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <Dropdown className='dark:bg-[#2b3456]'
              arrowIcon={false}
              inline
              label={<Avatar alt='user' img={currentUser.profilePicture} rounded style={{ border: '2px solid #385cb6', borderRadius: '50%' }}/>}
            >
              <Dropdown.Header>
                <span className='block text-sm'>@{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profil</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Ausloggen</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to='/signin'>
              <Button gradientDuoTone='purpleToBlue' outline>
                Einloggen
              </Button>
            </Link>
          )}
          <Button onClick={() => dispatch(toggleTheme())} className="gap-2" pill color={"blue"}>
            {theme === 'dark' ? <BsFillSunFill /> : <BsMoonStarsFill />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <button 
          data-collapse-toggle="navbar-default" 
          type="button" 
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-600" 
          aria-controls="navbar-default" 
          aria-expanded={isNavbarOpen} 
          onClick={() => setIsNavbarOpen(!isNavbarOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        <div className={`w-full md:hidden ${isNavbarOpen ? 'block' : 'hidden'}`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 dark:  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 ">
            <li>
              <Link to="/" className={`py-1 px-3 text-gray-900 hover:text-[#296593] active:text-[#377fb6] md:p-0 ${linkClass}`}>Start</Link>
            </li>
            <hr className="my-4 border-gray-300 md:hidden"/>
            <li>
              <Link to="/about" className={`py-1 px-3 text-gray-900 hover:text-[#377fb6] active:text-[#377fb6] md:p-0 ${linkClass}`}>Über uns</Link>
            </li>
            <hr className="my-4 border-gray-300 md:hidden"/>
            <li>
              <Link to="/search" className={`py-1 px-3 text-gray-900 hover:text-[#377fb6] active:text-[#377fb6] md:p-0 ${linkClass}`}>Alle Beiträge</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
