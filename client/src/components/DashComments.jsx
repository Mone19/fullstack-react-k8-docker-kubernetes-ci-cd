import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiOutlineTrash } from 'react-icons/hi';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          console.error('Auth-Token nicht gefunden');
          return;
        }

        const res = await fetch(`${baseUrl}/api/comment/getcomments`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        console.error('Auth-Token nicht gefunden');
        return;
      }

      const res = await fetch(`${baseUrl}/api/comment/getcomments?startIndex=${startIndex}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        console.error('Auth-Token nicht gefunden');
        return;
      }

      const res = await fetch(
        `${baseUrl}/api/comment/delete-comment/${commentIdToDelete}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
        });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='overflow-x-auto md:mx-auto p-3 mt-[80px]'>
      <h1 className='dark:text-[#9bb0ddd3] text-[#7b8cb0] font-semibold text-4xl mb-12 md: text-center'>Alle Kommentare</h1>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <div className="shadow-md rounded-lg overflow-hidden dark:border-2 border-gray-900">
            <table className='min-w-full w-full table-auto bg-[#b8bfd71e] dark:bg-[#0b10209a] shadow-md rounded-lg overflow-hidden'>
              <thead className="bg-[#b8bfd789] dark:bg-[#070914e4] dark:text-[#7b8cb0b6] text-[#40517c]">
                <tr>
                  <th className="py-2 text-left px-4 font-semibold hidden md:table-cell">Datum</th>
                  <th className="py-2 text-left px-4 font-semibold">Kommentare</th>
                  <th className="py-2 text-left px-4 font-semibold hidden md:table-cell">User</th>
                  <th className="py-2 text-left px-4 font-semibold">Likes</th>
                  <th className="py-2 text-left px-4 font-semibold">Post</th>
                  <th className="py-2 text-left px-4 font-semibold">Lösch.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-900">
                {comments.map((comment) => (
                  <tr key={comment._id} className='bg-[#b8bfd71e] dark:border-gray-900 dark:bg-[#0b1020d4] hover:bg-[#b8bfd75f] dark:hover:bg-[#141c37]'>
                    <td className='py-3 px-4 hidden md:table-cell '>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </td>
                    <td className='py-3 px-4 text-m'>{comment.content}</td>
                    <td className='py-3 px-4 hidden md:table-cell '>{comment.userId}</td>
                    <td className='py-3 px-4 '>{comment.numberOfLikes}</td>
                    <td className='py-3 px-4 '>
                      {comment.postId && (
                      <a href={`/post/${comment.postId.slug}`} className='text-[#2ca3c1] hover:underline'>
                        {comment.postId.title}
                      </a>
                    )}
                    </td>
                    <td className='py-3 px-4 '>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
                        }}
                        className='font-medium text-[#8a52f3dd] hover:underline cursor-pointer'
                      >
                        <HiOutlineTrash className='inline w-6 h-6'/>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-lg text-[#2ca3c1] hover:underline font-bold mt-8 mb-10'
            >
              Mehr anzeigen
            </button>
          )}
        </>
      ) : (
        <p>Du hast noch keine Kommentare erstellt!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Bist du sicher, dass du deinen Kommentar löschen möchtest?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>
                Ja, ich bin mir sicher
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                Nein, abbrechen
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
