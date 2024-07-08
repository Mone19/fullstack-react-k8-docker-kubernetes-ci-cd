import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from '../components/PostCard';
import videoVariant1 from '../video/animation1.mp4';
import videoVariant2 from '../video/animation2.mp4';
import fallbackImage from '../images/fallback.png';

const useVariant1 = true;

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const currentVideo = useVariant1 ? videoVariant1 : videoVariant2;

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${baseUrl}/api/post/getposts`);
      const data = await res.json();
      setPosts(data.posts);
    }
    fetchPosts();
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 dark:bg-[#000000] bg-[#f7f7fa] z-0"></div>
      <div className="relative flex flex-col gap-4 lg:p-15 mx-auto">
        <div className="relative mx-auto bg-black w-full border-b-2 border-[#385cb6] dark:border-hidden">
          <div className="relative mx-auto max-w-[1500px]">
            <video loop autoPlay muted className="w-full h-auto object-cover">
            <source src={currentVideo} type="video/mp4" />
              <img src={fallbackImage} alt="Fallback" className="w-full h-auto object-cover" />
              Ihr Browser unterstützt das Video-Tag nicht.
            </video>
            <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
              <h1 className="text-3xl p-3 font-bold overflow-hidden lg:text-6xl text-center [text-shadow:_2px__2px_1px_rgb(10_10_10_/_80%)]">
                Dein Guide für die AI-Revolution.
              </h1>
              <p className="text-white [text-shadow:_2px__2px_1px_rgb(10_10_10_/_80%)] overflow-hidden text-center text-2xl hidden sm:block">
                Tauche ein in die faszinierende Welt der AI - Schritt für Schritt!
              </p>
              <Link to="/search" className="text-xl sm:text-xl p-6 text-[#ffffff] font-bold hover:underline"> 
                Alle Beiträge anzeigen
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="relative max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7 z-10">
        {posts && posts.length > 0 && (
          <div className="gap-8 flex flex-col">
            <h2 className="text-4xl font-semibold text-center dark:text-[#9bb0ddd3] text-[#7b8cb0]">Neuste Beiträge</h2>
            <div className="flex flex-wrap gap-4">
              {posts.slice(0, 6).map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to="/search" className="text-lg text-[#2ca3c1] hover:underline text-center font-bold mt-3 mb-10">
              Alle Beiträge anzeigen
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
