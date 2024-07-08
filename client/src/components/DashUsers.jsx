import { Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle, HiOutlineTrash } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          console.error('Auth-Token nicht gefunden');
          return;
        }

        const res = await fetch(`${baseUrl}/api/user/getusers`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        console.error('Auth-Token nicht gefunden');
        return;
      }

      const res = await fetch(`${baseUrl}/api/user/getusers?startIndex=${startIndex}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        console.error('Auth-Token nicht gefunden');
        return;
      }

      const res = await fetch(`${baseUrl}/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='overflow-x-auto md:mx-auto p-3 mt-[80px]'>
      <h1 className='dark:text-[#9bb0ddd3] text-[#7b8cb0] font-semibold text-4xl mb-12 md:text-center'>Alle Benutzer</h1>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <div className="shadow-md rounded-lg overflow-hidden dark:border-2 border-gray-900">
            <table className='min-w-full w-full table-auto bg-[#b8bfd71e] dark:bg-[#0b10209a] shadow-md rounded-lg overflow-hidden'>
              <thead className="bg-[#b8bfd789] dark:bg-[#070914e4] dark:text-[#7b8cb0b6] text-[#40517c]">
                <tr>
                  <th className="py-2 text-left px-6 font-semibold hidden md:table-cell">Datum</th>
                  <th className="py-2 text-left px-6 font-semibold hidden md:table-cell">Profilbild</th>
                  <th className="py-2 text-left px-6 font-semibold ">Benutzername</th>
                  <th className="py-2 text-left px-6 font-semibold hidden md:table-cell">E-Mail</th>
                  <th className="py-2 text-left px-6 font-semibold">Admin</th>
                  <th className="py-2 text-left px-6 font-semibold">Löschen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-900">
                {users.map((user) => (
                  <tr key={user._id} className='bg-[#b8bfd71e] dark:border-gray-900 dark:bg-[#0b1020d4] hover:bg-[#b8bfd75f] dark:hover:bg-[#141c37]'>
                    <td className='py-3 px-6 hidden md:table-cell'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className='py-3 px-6 hidden md:table-cell'>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className='w-12 h-12 object-cover border border-[#8a52f37a] rounded-full'
                      />
                    </td>
                    <td className="py-3 px-6">{user.username}</td>
                    <td className='py-3 px-6 hidden md:table-cell'>{user.email}</td>
                    <td className='py-3 px-6'>
                      {user.isAdmin ? (
                        <FaCheck className='text-[#2ca3c1] w-5 h-5' />
                      ) : (
                        <FaTimes className='text-[#8a52f3dd] w-5 h-5' />
                      )}
                    </td>
                    <td className='py-3 px-6'>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setUserIdToDelete(user._id);
                        }}
                        className='text-[#8a52f3dd] font-medium hover:underline cursor-pointer'
                      >
                        <HiOutlineTrash className='inline w-6 h-6' />
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
        <p className='text-center text-gray-500'>Es gibt noch keine Benutzer!</p>
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
              Bist du sicher, dass du diesen Benutzer löschen möchtest?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
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
