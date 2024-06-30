import React, {  useState } from 'react';
import logo from './bitly_logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCode,  faLink, faQrcode, faRss } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate, Route, Router, Routes } from 'react-router-dom';
import UrlShortener from './Pages/UrlShortener';
import QrCodeGenerator from './Pages/QrCodeCreator';

function App() {
  
  window.onclick = function(event) {
    if(!event.target)return
    if(!(event.target instanceof Element))return 
    if (!(event.target as Element).classList.contains("dropdown")) {
      if((event.target as Element).parentElement!.getElementsByClassName("dropdown").length>0)return
      const allDropDowns=Array.from(document.getElementsByClassName("dropdown"))
      for(var el of allDropDowns){
          el.classList.add("hidden")
      }
    }
  }
  function showDropDown( e: React.MouseEvent<HTMLDivElement, MouseEvent>){
      const allDropDowns=Array.from(document.getElementsByClassName("dropdown"))
      for(var el of allDropDowns){
          el.classList.add("hidden")
      }
      const dropDown=(e.target as HTMLElement).getElementsByClassName("dropdown")[0]
      dropDown?.classList?.remove("hidden")
  }
  return (
    <>
      <div className=' bg-[#284243] px-20 py-4 flex gap-10 items-center mb-6'>
        <img className=' h-12 ' src={logo}></img>
        <div className=' flex gap-2 items-center text-white text-lg font-medium relative hover:cursor-pointer' onClick={(e)=>showDropDown(e)}>
          Products<FontAwesomeIcon icon={faAngleDown}/>
          <div className='dropdown absolute hidden rounded-md border py-2 top-9 bg-white text-black text-sm w-48'>
            <Link to="/" className='flex flex-row gap-1 items-center hover:bg-[#dbdfdf] hover:cursor-pointer p-3'>
              <FontAwesomeIcon icon={faLink}/>
              Link Managment 
            </Link>
            <Link to="/qr-code-generator" className='flex flex-row gap-1 items-center hover:bg-[#dbdfdf] hover:cursor-pointer p-3'>
              <FontAwesomeIcon icon={faQrcode}/>
              QR Code Generator
            </Link>
          </div>
        </div>
        <div className=' flex items-center gap-2 text-white text-lg font-medium relative hover:cursor-pointer ' onClick={(e)=>showDropDown(e)}>
          Resources<FontAwesomeIcon icon={faAngleDown}/>
          <div className='dropdown absolute hidden rounded-md border py-2 top-9 bg-white text-black text-sm w-48'>
            <div className='flex flex-row gap-1 items-center hover:bg-[#dbdfdf] hover:cursor-pointer p-3'>
              <FontAwesomeIcon icon={faRss}/>
              Blog 
            </div>
            <div className='flex flex-row gap-1 items-center hover:bg-[#dbdfdf] hover:cursor-pointer p-3'>
              <FontAwesomeIcon icon={faCode}/>
              API Documentation
            </div>
          </div>
        </div>
        <div className=' ml-auto flex items-center gap-3'>
          <div className='bg-[#EE6123] px-4 py-2 rounded-md text-white text-lg font-medium hover:cursor-pointer'>
            Sing up
          </div>
        </div>
      </div>
      <div className=' px-6 flex items-center flex-col gap-10'>
        <Routes>
          <Route path="/qr-code-generator" element={<QrCodeGenerator/>}/>
          <Route path="/" element={<UrlShortener/>}/>
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
