import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiClipboardList,
  HiLogout,
  HiChatAlt2,
  HiUserGroup,
  HiCog,
  HiChartBar,
  HiUser,
  HiShieldCheck,
} from 'react-icons/hi';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
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
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full md:w-56 h-full md:border-r border-[#aeaeae77] dark:border-[#aeaeae2f] dark:bg-[#090d1c] bg-[#f7f7fa] flex flex-col p-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center border-[#2ca3c1] border rounded p-2 mb-8 text-[#2ca3c1]">
          {currentUser && currentUser.isAdmin ? (
            <HiShieldCheck className="mr-2 text-3xl text-[#2ca3c1]" />
          ) : (
            <HiUser className="mr-2 text-3xl text-[#2ca3c1]" />
          )}
          <span>{currentUser.isAdmin ? 'Admin' : 'User'}</span>
        </div>
        {currentUser && currentUser.isAdmin && (
          <Link to="/dashboard?tab=dash">
            <div className={`flex items-center p-3 rounded text-[#979dc0] hover:text-white hover:bg-[#141c37] ${tab === 'dash' || !tab ? 'bg-[#2e406d] text-white' : ''}`}>
              <HiChartBar className="mr-2 text-2xl" />
              Dashboard
            </div>
          </Link>
        )}
        <Link to="/dashboard?tab=profile">
          <div className={`flex items-center p-3 rounded text-[#979dc0] hover:text-white hover:bg-[#141c37] ${tab === 'profile' ? 'bg-[#2e406d] text-white' : ''}`}>
            <HiCog className="mr-2 text-2xl" />
            Dein Profil
          </div>
        </Link>
        {currentUser.isAdmin && (
          <Link to="/dashboard?tab=posts">
            <div className={`flex items-center p-3 rounded text-[#979dc0] hover:text-white hover:bg-[#141c37] ${tab === 'posts' ? 'bg-[#2e406d] text-white' : ''}`}>
              <HiClipboardList className="mr-2 text-2xl" />
              Deine Beiträge
            </div>
          </Link>
        )}
        {currentUser.isAdmin && (
          <>
            <Link to="/dashboard?tab=users">
              <div className={`flex items-center p-3 rounded text-[#979dc0] hover:text-white hover:bg-[#141c37] ${tab === 'users' ? 'bg-[#2e406d] text-white' : ''}`}>
                <HiUserGroup className="mr-2 text-2xl" />
                Alle Benutzer
              </div>
            </Link>
            <Link to="/dashboard?tab=comments">
              <div className={`flex items-center p-3 rounded text-[#979dc0] hover:text-white hover:bg-[#141c37] ${tab === 'comments' ? 'bg-[#2e406d] text-white' : ''}`}>
                <HiChatAlt2 className="mr-2 text-2xl" />
                Alle Kommentare
              </div>
            </Link>
          </>
        )}
        <div className="flex items-center p-3 rounded text-[#979dc0] hover:text-white hover:bg-[#141c37] cursor-pointer" onClick={handleSignout}>
          <HiLogout className="mr-2 text-2xl" />
          Ausloggen
        </div>
      </div>
    </div>
  );
}
