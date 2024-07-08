import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiArrowNarrowUp, HiClipboardList, HiUserGroup, HiChatAlt2 } from 'react-icons/hi';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { TinyBarChart, TinyAreaChart, TinyLineChart } from './TinyCharts';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          console.error('Auth-Token nicht gefunden');
          return;
        }

        const res = await fetch(`${baseUrl}/api/user/getusers?limit=5`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          console.error('Auth-Token nicht gefunden');
          return;
        }

        const res = await fetch(`${baseUrl}/api/post/getposts?limit=5`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          console.error('Auth-Token nicht gefunden');
          return;
        }

        const res = await fetch(`${baseUrl}/api/comment/getcomments?limit=5`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className='p-6 mx-auto mt-[50px] mb-[80px] max-w-7xl w-full'>
      <h1 className='dark:text-[#9bb0ddd3] text-[#7b8cb0] font-semibold text-4xl mb-12'>Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='p-6 dark:bg-[#0a0f1e] bg-[#b8bfd71e] border-[#385cb6] border-2 rounded-lg shadow-lg'>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='dark:text-[#7b8cb0b6] text-[#40517c] text-lg uppercase'>Alle Benutzer</h3>
              <p className='text-3xl font-bold text-[#8a52f3dd]'>{totalUsers}</p>
            </div>
            <HiUserGroup className='text-6xl text-[#2ca3c1]' />
          </div>
          <div className='mt-4 flex items-center text-sm'>
            <HiArrowNarrowUp className='text-[#2ca3c1] text-lg mr-2' />
            <span className='text-[#2ca3c1] text-lg'>{lastMonthUsers}</span>
            <span className='text-gray-500 ml-2'>im letzten Monat</span>
          </div>
          <div className='mt-4'>
            <TinyBarChart /> 
          </div>
        </div>
        <div className='p-6 dark:bg-[#0a0f1e] bg-[#b8bfd71e] border-[#385cb6] border-2 rounded-lg shadow-lg'>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='dark:text-[#7b8cb0b6] text-[#40517c] text-lg uppercase'>Alle Kommentare</h3>
              <p className='text-3xl font-bold text-[#8a52f3dd]'>{totalComments}</p>
            </div>
            <HiChatAlt2 className='text-6xl text-[#2ca3c1]' />
          </div>
          <div className='mt-4 flex items-center text-sm'>
            <HiArrowNarrowUp className='text-[#2ca3c1] text-lg mr-2' />
            <span className='text-[#2ca3c1] text-lg'>{lastMonthComments}</span>
            <span className='text-gray-500 ml-2'>im letzten Monat</span>
          </div>
          <div className='mt-4'>
            <TinyAreaChart /> 
          </div>
        </div>
        <div className='p-6 dark:bg-[#0a0f1e] bg-[#b8bfd71e] border-[#385cb6] border-2 rounded-lg shadow-lg'>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='dark:text-[#7b8cb0b6] text-[#40517c] text-lg uppercase'>Alle Beiträge</h3>
              <p className='text-3xl font-bold text-[#8a52f3dd]'>{totalPosts}</p>
            </div>
            <HiClipboardList className='text-6xl text-[#2ca3c1]' />
          </div>
          <div className='mt-4 flex items-center text-sm'>
            <HiArrowNarrowUp className='text-[#2ca3c1] text-lg mr-2' />
            <span className='text-[#2ca3c1] text-lg'>{lastMonthPosts}</span>
            <span className='text-gray-500 ml-2'>im letzten Monat</span>
          </div>
          <div className='relative' style={{ top: '70px' }}>
            <TinyLineChart/>
          </div>
        </div>
      </div>
      <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='p-6 dark:bg-[#0a0f1e] bg-[#b8bfd71e] border-[#385cb6] border-2 rounded-lg shadow-lg'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
            <h1 className='text-lg font-semibold dark:text-[#7b8cb0b6] text-[#40517c]'>Die neuesten Benutzer</h1>
            <Button outline gradientDuoTone="purpleToBlue" className='mt-2 md:mt-0'>
              <Link to={"/dashboard?tab=users"}>Alle ansehen</Link>
            </Button>
          </div>
          <div className="overflow-x-auto mt-4 border border-1 rounded-lg border-[#385cb674]">
            <table className="min-w-full bg-[#b8bfd71e] dark:bg-[#0b10209a] shadow-md rounded-lg overflow-hidden">
              <thead className="bg-[#b8bfd789] dark:bg-[#070914e4] dark:text-[#7b8cb0b6] text-[#40517c]">
                <tr>
                  <th className="py-2 text-left px-4 font-semibold">Profilbild</th>
                  <th className="py-2 text-left px-4 font-semibold">Benutzername</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className={`bg-[#b8bfd71e] dark:bg-[#0b1020d4] ${index !== users.length - 1 ? 'border-b border-gray-200 dark:border-gray-400' : ''}`}>
                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-900 w-96">
                      <img src={user.profilePicture} alt="user" className="w-10 h-10 rounded-full bg-gray-500" />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-900">{user.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='p-6 dark:bg-[#0a0f1e] bg-[#b8bfd71e] border-[#385cb6] border-2 rounded-lg shadow-lg'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
            <h1 className='text-lg font-semibold dark:text-[#7b8cb0b6] text-[#40517c]'>Die neuesten Kommentare</h1>
            <Button outline gradientDuoTone="purpleToBlue" className='mt-2 md:mt-0'>
              <Link to={"/dashboard?tab=comments"}>Alle ansehen</Link>
            </Button>
          </div>
          <div className="overflow-x-auto mt-4 border border-1 rounded-lg border-[#385cb674]">
            <table className="min-w-full bg-[#b8bfd71e] dark:bg-[#0b10209a] shadow-md rounded-lg overflow-hidden">
              <thead className="bg-[#b8bfd789] dark:bg-[#070914e4] dark:text-[#7b8cb0b6] text-[#40517c]">
                <tr>
                  <th className="py-2 text-left px-4 font-semibold">Kommentare</th>
                  <th className="py-2 text-left px-4 font-semibold">Likes</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, index) => (
                  <tr key={comment._id} className={`bg-[#b8bfd71e] dark:border-gray-900 dark:bg-[#0b1020d4] ${index !== comments.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                    <td className="py-2 px-4 w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </td>
                    <td className="py-2 px-4">{comment.numberOfLikes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='mt-12'>
        <div className='p-6 dark:bg-[#0a0f1e] bg-[#b8bfd71e] border-[#385cb6] border-2 rounded-lg shadow-lg'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
            <h1 className='text-lg font-semibold dark:text-[#7b8cb0b6] text-[#40517c] mb-2 md:mb-0'>Deine zuletzt erstellten Beiträge</h1>
            <div className='flex flex-wrap gap-2'>
              <Button outline gradientDuoTone="purpleToBlue">
                <Link to={"/dashboard?tab=posts"}>Deine Beiträge</Link>
              </Button>
              <Button outline gradientDuoTone="purpleToBlue">
                <Link to={"/search"}>Alle Beiträge</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto mt-4 border border-1 rounded-lg border-[#385cb674]">
            <table className="min-w-full bg-[#b8bfd71e] dark:bg-[#0b10209a] shadow-md rounded-lg overflow-hidden">
              <thead className="bg-[#b8bfd789] dark:bg-[#070914e4] dark:text-[#7b8cb0b6] text-[#40517c]">
                <tr>
                  <th className="py-2 text-left px-4 font-semibold">Beitragsbild</th>
                  <th className="py-2 text-left px-4 font-semibold">Beitragstitel</th>
                  <th className="py-2 text-left px-4 font-semibold hidden md:table-cell">Kategorie</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr key={post._id} className={`bg-[#b8bfd71e] dark:border-gray-900 dark:bg-[#0b1020d4] ${index !== posts.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                    <td className="py-2 px-4 w-60">
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt="post" className="w-30 h-25 rounded-md md:w-40 md:h-20 bg-black" />
                    </Link>
                    </td>
                    <td className="py-2 px-4 w-96 text-[#2ca3c1] hover:underline">{post.title}</td>
                    <td className="py-2 px-4 w-5 hidden md:table-cell">{post.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
