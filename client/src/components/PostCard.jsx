import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="group relative w-full border border-[#385cb6] rounded-lg h-[400px] overflow-hidden sm:w-[350px] transition-all duration-500 dark:bg-[#070914e4] bg-[#ffffff] ease-in-out">
      <Link to={`/post/${post.slug}`}>
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt="post cover"
            className="h-[260px] w-full object-cover transition-transform duration-400 ease-in-out transform scale-100 group-hover:scale-110"
          />
          <div className="absolute inset-0 opacity-20 pointer-events-none"></div>
        </div>
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-1">{post.title}</p>
        <span className="text-sm italic">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:-translate-y-2 absolute bottom-0 left-0 right-0 transition-transform duration-300 text-center py-2 rounded-md m-2 border border-[#385cb6] text-[#385cb6] hover:bg-[#3f5292] hover:text-white hover:border-[#5f86db] dark:hover:bg-[#162035] dark:hover:text-white  dark:bg-[#0a0f1e]"
        >
          Zum Beitrag
        </Link>
      </div>
    </div>
  );
}
