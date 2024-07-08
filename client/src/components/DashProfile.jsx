import { Alert, Button, Modal, ModalBody, ModalHeader} from "flowbite-react";
import {useSelector} from "react-redux";
import { useState, useRef, useEffect } from "react";
import { 
  getDownloadURL, 
  getStorage, 
  uploadBytesResumable,
  ref 
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { 
  updateStart, 
  updateSuccess, 
  updateFailure, 
  deleteUserStart, 
  deleteUserSuccess, 
  deleteUserFailure,
  signoutSuccess
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function DashProfile() {
  const {currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [updateUserSuccuss, setUpdateUserSuccuss] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef({});
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(e.target.files[0]);
    if (file) {
      setImageFileUrl(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
      const progress = 
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Bild konnte nicht hochgeladen werden (Datei muss kleiner als 2 MB sein)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageFileUrl(downloadURL);
        setFormData({ ...formData, profilePicture: downloadURL });
        setImageFileUploading(false);
        });
    }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccuss(null);
    if (Object.keys(formData).length === 0 ) {
      setUpdateUserError("Bitte füllen alle Felder aus");
      return;
  }
  if(imageFileUploading){
    setUpdateUserError("Bitte warten bis das Profilbild hochgeladen wird");
    return;
  }
  try {
    dispatch(updateStart());
    const res = await fetch(`${baseUrl}/api/user/update/${currentUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,  
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      dispatch(updateFailure(data.message));
      setUpdateUserError(data.message);
    }else {
      dispatch(updateSuccess(data));
      setUpdateUserSuccuss("Profil erfolgreich aktualisiert");
    }
  } catch (error) {
    dispatch(updateFailure(error.message));
    setUpdateUserError(error.message);
  }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${baseUrl}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      }else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignout = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/user/signout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }else {
        dispatch(signoutSuccess());
      };
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
      <div className="max-w-lg mx-auto p-3 w-full mt-[53px] mb-[53px]">
        <div className="flex flex-col gap-4 justify-center max-w-md w-full">
          <h1 className="my-7 text-center dark:text-[#9bb0ddd3] text-[#7b8cb0] font-semibold text-4xl">Dein Profil</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="file"
              accept="image/*"
              onChange={handleImageChange} 
              ref={filePickerRef} 
              hidden
            />
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={(e) => filePickerRef.current.click()}>
              {imageFileUploadProgress && (
                <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} 
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    },
                    path: {
                      stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                    },
                  }}
                />
              )}
              <img src={imageFileUrl || currentUser.profilePicture} 
                alt="user" 
                className={`rounded-full w-full h-full object-cover border-8 border-[#385cb6] ${
                  imageFileUploadProgress && 
                  imageFileUploadProgress < 100 && 
                  'opacity-60'}`} 
              />
            </div>
            {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}
            <input className='dark:bg-[#0b1020d4] bg-[#b8bfd71e] rounded-md'
              type="text" 
              id="username" 
              placeholder="Username"
              defaultValue={currentUser.username} onChange={handleChange}
            />
            <input className='dark:bg-[#0b1020d4] bg-[#b8bfd71e] rounded-md'
              type="email" 
              id="email" 
              placeholder="Email"
              defaultValue={currentUser.email} onChange={handleChange}
            />
            <input className='dark:bg-[#0b1020d4] bg-[#b8bfd71e] rounded-md'
              type="password" 
              id="password" 
              placeholder="passwort" onChange={handleChange}
            />
            <Button type='submit' gradientDuoTone='purpleToBlue' outline 
              disabled={loading || imageFileUploading}
            >
              {loading ? "Laden ..." : "Profil aktualisieren"}
            </Button>
            {
              currentUser.isAdmin && (
                <Link to={"/create-post"}>
                  <Button
                    type="button"
                    gradientDuoTone='purpleToBlue' outline
                    className="w-full"
                  >
                    Beitrag erstellen
                  </Button>
                </Link>
              )
            }
          </form>
          <div className="flex justify-between font-semibold mt-5">
            <span onClick={() =>setShowModal(true)} className="cursor-pointer text-[#8a52f3dd]">Konto löschen</span>
            <span onClick={handleSignout} className="cursor-pointer text-[#2ca3c1]">Ausloggen</span>
          </div>
          {updateUserSuccuss && (
            <Alert color="success" className="mt-5">
              {updateUserSuccuss}
            </Alert>
          )}
          {updateUserError && (
            <Alert color="failure" className="mt-5">
              {updateUserError}
            </Alert>
          )}
          <Modal show={showModal} onClose={() => setShowModal(false)} 
            popup 
            size='md'>
            <ModalHeader/>
            <ModalBody>
              <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 md-4 mx-auto"/>
                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Bist du sicher, dass du dein Konto löschen möchtest?</h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={handleDeleteUser}> Ja, ich bin mir sicher</Button>
                  <Button color="gray" onClick={() => setShowModal(false)}> Nein, abbrechen</Button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </div>
  );
}
