import { useSelector } from 'react-redux';
import backgroundImage from "../images/background.jpg";
import backgroundImageLight from "../images/background_light.jpg";

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className={theme} style={{ position: 'relative', minHeight: '100vh' }}>
        <div className='relative bg-white text-gray-600 dark:text-gray-400 dark:bg-[rgb(0,0,0)] min-h-screen z-0'>
      <div
        className='absolute inset-0'
        style={{
          backgroundImage: `url(${theme === 'dark' ? backgroundImage : backgroundImageLight})`,
          backgroundSize: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
          opacity: 0.2,
          zIndex: -1,
        }}
      ></div>
          {children}
        </div>
    </div>
  );
}
