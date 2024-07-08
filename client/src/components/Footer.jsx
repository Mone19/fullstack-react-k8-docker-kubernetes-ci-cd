import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsGithub } from 'react-icons/bs';
import logo from "../images/logo_gross.svg";
import { useSelector } from "react-redux";

export default function FooterCom() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <Footer container className='border-t-2 border-[#9bb0ddd3] rounded-none dark:bg-[#090d1c] bg-[#f7f7fa]'>
      <div className='w-full max-w-7xl mx-auto p-4'>
        <div className='flex flex-col md:flex-row justify-between items-center py-5'>
          <div className='flex items-center mb-4 md:mb-0'>
            <Link to="/" className='flex items-center'>
              <img src={logo} alt="Logo" className={`h-11 ${theme === 'dark' ? 'filter invert' : ''}`} />
            </Link>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-lg font-semibold'>Lerne uns kennen:</span>
              <Link to='/about' className='text-lg text-[#377fb6] hover:underline'>
                Über uns
              </Link>
            </div>
            <div className='ml-6'>
              <a href='https://github.com/Ki-Blog/BlogMitDashboard/' target='_blank' rel='noopener noreferrer'>
                <BsGithub className='text-2xl text-black dark:text-white' />
              </a>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full flex justify-between items-center py-4'>
          <Footer.Copyright href='#' by="AI Quantum " year={new Date().getFullYear()} />
        </div>
      </div>
    </Footer>
  );
}
