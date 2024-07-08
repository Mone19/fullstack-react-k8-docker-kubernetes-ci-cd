import { Alert, Button, Modal } from 'flowbite-react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Comment from './Comment'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function CommentSection({postId}) {
  const {currentUser} = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
  }
  try {
    const res = await fetch(`${baseUrl}/api/comment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        content: comment, 
        postId, 
        userId: currentUser._id,
      }),
  
    });
    const data = await res.json();
    if (res.ok) {
      setComment('');
      setCommentError(null);
      setComments([data, ...comments]);
    }
  } catch (error) {
    setCommentError(error.message);
  }
};

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    getComments();
  }, [postId])

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/signin');
        return;
      }
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        console.error('Auth-Token nicht gefunden');
        return;
      }


      const res = await fetch(`${baseUrl}/api/comment/likeComment/${commentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${authToken}`
        },

        });
      if (res.ok) {  
        const data = await res.json();
        setComments(comments.map((comment) => 
          comment._id === commentId ? {
            ...comment,
            likes: data.likes,
            numberOfLikes: data.likes.length,
          } : comment
        )
      );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) => 
        c._id === comment._id ? {...c, content: editedContent} : c
    )
  );
  };


  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/signin');
        return;
      }
      const authToken = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/api/comment/delete-comment/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${authToken}`
        },
      });
      if (res.ok) {
        const data = await res.json();
            setComments(
              comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };  
  return (
    <div className='mx-w-2xl mx-auto w-full p-3'>
      {currentUser?
      (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-md'>
          <p>Anmelden als:</p>
          <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt="" />
          <Link to={'/dashboard?tab=profile'} className='text-md text-[#2ca3c1] hover:underline'>
            @{currentUser.username}
          </Link>
        </div>
      ):
      (
        <div className='text-md dark:text-[#b3bccfb6] text-[#7b8cb0] my-5 flex gap-1'>
            Um kommentieren zu können, musst du angemeldet sein.
            <Link className='text-[#2ca3c1] text-md hover:underline' to={'/signin'}>
              Einloggen
            </Link>
        </div>
      )
    }
    {currentUser && (
      <form onSubmit={handleSubmit} className='border border-[#9bb0ddd3] rounded-md p-3'>
        <textarea
        placeholder='Schreibe einen Kommentar...'
        rows='3'
        maxLength='200'
        className='w-full bg-transparent outline-none'
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        />
        <div className='flex justify-between items-center mt-5'>
          <p className='text-gray-500 text-xs'>{200 - comment.length} verbleibende Zeichen</p>
          <Button outline gradientDuoTone='purpleToBlue'
          type='submit'>
            Erstellen
          </Button>
        </div>
        {commentError &&(
          <Alert color='failure' className='mt-5'>{commentError}</Alert>
        )}
      </form>
    )}
    {comments.length === 0 ?(
      <p className='dark:text-[#9bb0ddd3] text-[#7b8cb0] text-md my-5'>Noch keine Kommentare</p>
    ):(
      <>
      <div className='text-md my-5 flex items-center gap-1'>
        <p>Kommentare</p>
        
        <div className='border border-[#9bb0ddd3] flex items-center py-2 px-2 w-8 h-8 rounded-md'>
          <p>{comments.length}</p>
        </div>
      </div>
      {comments.map( comment => (
        <Comment
        key={comment._id}
        comment={comment}
        onLike={handleLike}
        onEdit={handleEdit}
        onDelete={(commentId)=>{
          setShowModal(true)
          setCommentToDelete(commentId)
        }}
        />
      )
      )}
      </>
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
            <HiOutlineExclamationCircle className='h-18 w-18 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
            Sicher, dass du diesen Kommentar löschen möchten?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={() => handleDelete(commentToDelete)}>
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
  )
}

