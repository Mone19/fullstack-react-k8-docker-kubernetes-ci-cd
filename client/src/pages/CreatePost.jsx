import { FileInput, Button, Alert } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getStorage} from "firebase/storage";
import {app} from "../firebase";
import { useState } from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {useNavigate} from "react-router-dom"; 
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Bitte wähle ein Bild aus");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        }, 
        (error) => {
          setImageUploadError("Hochladen des Bildes ist fehlgeschlagen");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Hochladen des Bildes ist fehlgeschlagen");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message)
        return;
      }
      if (res.ok) {
        setPublishError(null)
        navigate(`/post/${data.slug}`);
      }
    }catch (error) {
      setPublishError("Etwas ist schief gelaufen");
    }
  };

  return <div className="p-3 max-w-3xl mx-auto min-h-screen mt-[80px]">
      <h1 className="text-center my-7 dark:text-[#9bb0ddd3] text-[#7b8cb0] p-2 font-semibold text-4xl ">Beitrag erstellen</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input 
          type="text" 
          id="title" 
          placeholder="Titel" 
          required
          className='w-full sm:w-[520px] p-2 border dark:bg-[#0b1020d4] bg-[#b8bfd71e] rounded-md mr-10'
          onChange={(e) => 
            setFormData({ ...formData, title: e.target.value })}
          />
          <select className='lg:inline p-2 border dark:bg-[#0b1020d4] bg-[#b8bfd71e] rounded-md mr-0 text-ml'
          onChange={(e) => 
            setFormData({ ...formData, category: e.target.value })}
          >
            <option value="uncategorized">Wählen Sie eine Kategorie</option>
            <option value="Midjourney">Midjourney</option>
            <option value="Pika">Pika</option>
            <option value="Canva">Canva</option>
            <option value='Chatgpt'>ChatGPT</option>
            <option value='Colormind'>Colormind</option>
            <option value='Brainfm'>Brain.fm</option>
            <option value='Beautifulai'>Beautiful.ai</option>
            <option value='LanguageTool'>LanguageTool</option>
            <option value='Dalle2'>DALL-E2</option>
          </select>
        </div>
        <div className="flex gap-4 items-center justify-between border-2 border-[#9bb0ddd3] dark:border-[#9bb0ddd3] rounded-md p-3">
          <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
          <Button 
          type="button" 
          gradientDuoTone="purpleToBlue" 
          size="sm" outline 
          onClick={handleUploadImage}
          disabled={imageUploadProgress}
          >
            {
              imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar 
                value={imageUploadProgress} 
                text={`${imageUploadProgress || 0 }%`}
                />
              </div>
            ):( "Bild hochladen"
            )}
          </Button>
        </div>
        {imageUploadError && 
        <Alert color="failure">
          {imageUploadError}
        </Alert>
        }
        {formData.image && (
        <img src={formData.image} 
        alt="upload" 
        className="w-full h-72 object-cover"/>
        )}
        <ReactQuill 
        theme="snow" 
        placeholder="Schreibe etwas..." 
        className="h-72 mb-12 rounded-md"
        required
        onChange={(value) => setFormData({ ...formData, content: value })
        }
        />
      
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>Beitrag Veröffentlichen</Button>
        {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
      </form>
    </div>;
}

