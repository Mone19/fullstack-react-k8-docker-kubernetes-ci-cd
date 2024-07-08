import React from 'react';
import { useSelector } from "react-redux";

export default function About() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className='relative min-h-screen flex justify-center items-center'>
      <div className='relative max-w-3xl mx-auto p-6 text-center bg-[#f7f7fa]  dark:bg-[#090d1c] border-r border-l border-[#aeaeae77] dark:border-[#aeaeae2f] '>

        <h1 className='text-4xl font-medium dark:text-[#9bb0ddd3] text-[#7b8cb0] text-center mt-[80px] my-7'>
          About
        </h1>

        <div className='text-md text-[#7b8cb0b6] dark:text-gray-300 leading-relaxed flex flex-col gap-6'>
          
          <p className='mb-3 mt-0 dark:text-[#b3bccfb6] text-[#7b8cb0]'>
            Bei AI Quantum sind wir leidenschaftlich daran interessiert, die Grenzen der Künstlichen Intelligenz zu erforschen und innovative Lösungen für die Herausforderungen von morgen zu entwickeln. Unsere Mission ist es, die Möglichkeiten der AI zu nutzen, um eine nachhaltige und intelligente Zukunft zu gestalten.
          </p>

          <div className="flex justify-center my-6">
            <div className="h-px w-[350px] bg-[#7b8cb0] dark:bg-[#7b8cb0]"></div>
          </div>

          <h2 className="dark:text-[#9bb0ddd3] text-[#7b8cb0] font-semibold text-2xl">Unsere Vision</h2>

          <p className='mb-3 mt-0 dark:text-[#b3bccfb6] text-[#7b8cb0]'>
            Unsere Vision ist es, die Welt durch Künstliche Intelligenz zu transformieren und dabei ethische Prinzipien und soziale Verantwortung zu berücksichtigen. Wir glauben fest daran, dass AI das Potenzial hat, das menschliche Leben zu verbessern, und wir streben danach, diese Vision in die Realität umzusetzen.
          </p>

          <div className="flex justify-center my-6">
            <div className="h-px w-[350px] bg-[#7b8cb0] dark:bg-[#7b8cb0]"></div>
          </div>

          <h2 className="dark:text-[#9bb0ddd3] text-[#7b8cb0] font-semibold text-2xl">Unser Team</h2>

          <p className='mb-3 mt-0 dark:text-[#b3bccfb6] text-[#7b8cb0]'>
            Unser Team besteht aus hochqualifizierten Experten auf dem Gebiet der Künstlichen Intelligenz, darunter Softwareentwickler, Datenwissenschaftler, Ingenieure und Designer. Gemeinsam arbeiten wir an der Entwicklung innovativer AI-Lösungen, die das Potenzial haben, Branchen zu revolutionieren und die Welt zu verändern.
          </p>

          <div className="flex justify-center my-6">
            <div className="h-px w-[350px] bg-[#7b8cb0] dark:bg-[#7b8cb0]"></div>
          </div>

          <h2 className="dark:text-[#9bb0ddd3] text-[#7b8cb0] font-semibold text-2xl">Unsere Projekte</h2>

          <p className='mb-3 mt-0 dark:text-[#b3bccfb6] text-[#7b8cb0]'>
            Bei AI Quantum haben wir bereits an einer Vielzahl von spannenden Projekten gearbeitet, von der Entwicklung von AI-gestützten Anwendungen für Unternehmen bis hin zur Forschung an neuen AI-Algorithmen und -Technologien. Wir sind stolz darauf, an der Spitze der AI-Innovation zu stehen und freuen uns darauf, auch in Zukunft wegweisende Projekte umzusetzen.
          </p>

          <div className="flex justify-center my-6">
            <div className="h-px w-[350px] bg-[#7b8cb0] dark:bg-[#7b8cb0]"></div>
          </div>
          
          <h2 className="text-[#7b8cb0] dark:text-[#9bb0ddd3] font-semibold text-2xl">Kontaktieren Sie uns</h2>

          <p className='mb-3 mt-0 text-[#7b8cb0] dark:text-[#b3bccfb6]'>
            Wenn Sie mehr über uns erfahren möchten oder an einer Zusammenarbeit interessiert sind, zögern Sie nicht, uns zu kontaktieren. Wir sind immer offen für neue Ideen und Partnerschaften und freuen uns darauf, von Ihnen zu hören.
          </p>

          <p className='mb-8 font-semibold text-[#7b8cb0]
          dark:text-[#9bb0ddd3]'>
            Vielen Dank für Ihr Interesse an AI Quantum!
          </p>
        </div>
      </div>
    </div>
  );
}
