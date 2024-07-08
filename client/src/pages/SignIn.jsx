import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import logo from "../images/logo_gross.svg";
import backgroundImage from "../images/background.jpg";
import backgroundImageLight from "../images/background_light.jpg";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    return () => {
      dispatch(signInFailure(null));
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Bitte alle Felder ausfüllen"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch(`${baseUrl}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data));
        localStorage.setItem('token', data.token);
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const formContent = (idSuffix) => (
    <>
      <div>
        <Label htmlFor={`email-${idSuffix}`} value="E-Mail:" />
        <TextInput 
          type="email" 
          placeholder="name@company.com" 
          id={`email-${idSuffix}`} 
          name="email"
          onChange={handleChange}
          value={formData.email}
          style={{
            backgroundColor: theme === 'dark' ? 'black' : 'white',
            color: theme === 'dark' ? 'white' : 'black'
          }}
        />
      </div>
      <div>
        <Label htmlFor={`password-${idSuffix}`} value="Passwort:" />
        <TextInput 
          type="password" 
          placeholder="*********" 
          id={`password-${idSuffix}`} 
          name="password"
          onChange={handleChange}
          value={formData.password}
          style={{
            backgroundColor: theme === 'dark' ? 'black' : 'white',
            color: theme === 'dark' ? 'white' : 'black'
          }}
        />
      </div>
      <Button gradientDuoTone="purpleToBlue" outline type="submit" disabled={loading}>
        {loading ? (
          <>
            <Spinner size="sm"/>
            <span className="pl-3">Laden...</span>
          </>
        ) : (
          "Einloggen"
        )}
      </Button>
      <OAuth/>
    </>
  );

  return (
    <div className="min-h-screen flex justify-center items-center">
      {/* Desktop Ansicht */}
      <div className="relative bg-cover h-[600px] w-[880px] bg-center border border-[#385cb6] hidden md:flex mb-[200px]">
        <div className="absolute right-0 top-0 w-1/2 dark:bg-[#090d1c] bg-[#f7f7fa] h-full"></div>
        <div className="absolute left-0 top-0 w-1/2 h-full bg-center bg-cover" style={{ backgroundImage: `url(${theme === 'dark' ? backgroundImage : backgroundImageLight})` }}></div>
        <div className="absolute top-0 right-0 flex p-3 max-w-3xl mt-14 mr-14 flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1 mt-16 mr-16">
            <h1 className="text-4xl font font-semibold text-[#385cb6] text-center my-3">Willkommen bei</h1>
            <Link to="/" className="font-bold dark:text-white text-4xl">
              <img src={logo} alt="Logo" className={`h-15 mx-auto ${theme === 'dark' ? 'filter invert' : ''}`} />
            </Link>
            <p className="text-center p-5 text-lg">
            Melde dich jetzt mit deinem Konto oder über Google an.
            </p>
          </div>
          <div className="flex-1 mt-12 mb-2 ml-12">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {formContent('desktop')}
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Noch keinen Account?</span>
              <Link to="/signup" className="text-[#5356ff] font-semibold">
                Registrieren
              </Link>
            </div>
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Ansicht */}
      <div className="relative md:hidden w-full bg-center bg-cover flex justify-center items-start" style={{ backgroundImage: `url(${theme === 'dark' ? backgroundImage : backgroundImageLight})`, height: '100vh' }}>
        <div className="absolute inset-0 bg-white dark:bg-[#000000a0] opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-start p-4 mt-10">
          <div className="text-center mb-8 flex flex-col items-center">
            <h1 className="text-4xl font font-semibold text-[#385cb6] mb-3">Willkommen bei</h1>
            <Link to="/" className="font-bold dark:text-white text-4xl">
              <img src={logo} alt="Logo" className={`h-15 mx-auto ${theme === 'dark' ? 'filter invert' : ''}`} />
            </Link>
            <p className="text-sm p-5">
            Melde dich jetzt mit deinem Konto oder über Google an.
            </p>
          </div>
          
          <div className="w-full px-4">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {formContent('mobile')}
            </form>
            <div className="flex gap-2 text-sm mt-5 justify-center">
              <span>Noch keinen Account?</span>
              <Link to="/signup" className="text-[#5356ff] font-semibold">
                Registrieren
              </Link>
            </div>
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
