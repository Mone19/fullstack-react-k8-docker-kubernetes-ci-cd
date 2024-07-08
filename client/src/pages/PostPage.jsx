import { Spinner} from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`${baseUrl}/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-0">
      <div className="relative w-full max-w-6xl min-h-screen mx-auto p-6 bg-[#f7f7fa] dark:bg-[#090d1c] border-r border-l border-[#aeaeae77] dark:border-[#aeaeae2f]">
        <h1 className="text-5xl dark:text-[#9bb0ddd3] text-[#7b8cb0] mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {post && post.title}
        </h1>
        <div className="flex justify-center mt-5">
          <Link to={`/search?category=${post && post.category}`} className="">
            <button className="font-semibold py-2 px-4 rounded-lg border border-[#385cb6] text-[#385cb6]  dark:bg-[#0a0f1e]">
              {post && post.category}
            </button>
          </Link>
        </div>
        <img
          src={post && post.image}
          alt={post && post.title}
          className="mt-10 p-3 max-h-[600px] w-full object-cover"
        />
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-6xl text-xs">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="italic">
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <div
          className="p-3 max-w-[2300px] mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>
        <CommentSection postId={post._id} />
        <div className="flex flex-col justify-center items-center mb-5 mt-10">
          <h1 className="dark:text-[#9bb0ddd3] text-[#7b8cb0] font-semibold text-4xl mt-5 mb-5 p-3">
            Aktuelle Beiträge
          </h1>
          <div className="flex flex-wrap gap-5 mt-5 justify-center mb-[50px]">
            {recentPosts && recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
