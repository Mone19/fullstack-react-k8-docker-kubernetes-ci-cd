import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import PostCard from '../components/PostCard';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Search() {
  const { theme } = useSelector((state) => state.theme);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('limit', 8);
        const searchQuery = urlParams.toString();
        const res = await fetch(`${baseUrl}/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        setShowMore(data.posts.length === 8);
      } catch (error) {
        setLoading(false);
        console.error("Fehler beim Abrufen der Posts:", error);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    try {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('startIndex', startIndex);
      urlParams.set('limit', 8);
      urlParams.set('cacheBuster', Date.now());
      const searchQuery = urlParams.toString();
      const res = await fetch(`${baseUrl}/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      setShowMore(data.posts.length === 8);
    } catch (error) {
      console.error("Fehler beim Abrufen der weiteren Posts:", error);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className='relative flex flex-col md:flex-row'>
        <div className='p-7 md:min-h-screen'>
        </div>
        <div className='w-full flex flex-col items-center mt-[50px]'>
          <h1 className='text-4xl font-semibold p-3 mt-5 dark:text-[#9bb0ddd3] text-[#7b8cb0]'>
            Ergebnisse
          </h1>
          <div className='p-7 flex flex-wrap gap-4 justify-center'>
            {!loading && posts.length === 0 && (
              <p className='text-xl p dark:text-[#b3bccfb6] text-[#7b8cb0]'>Keine Einträge gefunden.</p>
            )}
            {loading && <p className='text-xl text-[#2ca3c1]'>Laden...</p>}
            {!loading && posts && posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          {showMore && (
            <div className='w-full flex justify-center mt-3 mb-10'>
              <button
                onClick={handleShowMore}
                className='text-lg text-[#2ca3c1] hover:underline text-center font-bold'
              >
                Weitere Beiträge anzeigen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
