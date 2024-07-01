import React, {  useState } from 'react';
import logo from './bitly_logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCode,  faLink, faQrcode, faRss } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate, Route, Router, Routes } from 'react-router-dom';
import UrlShortener from './Pages/UrlShortener';
import QrCodeGenerator from './Pages/QrCodeCreator';
import SignIn from './Components/SignIn';
import { UserInfo } from './Models/UserInfo';
import UserProfile from './Components/UserProfile';



function App() {

  const [userInfo,setUserInfo]=useState({
    access_token:"ya29.a0AXooCgtw8t4jhgthIVQQSMW7uDmo-CrMsf0zVwbdfcb8M1KnuMH_WiJImYQZRPEtTSSQKbuitkBGX56ZlnC073jM5DByIVu5q_zZKEa-FsqAmqtVnRr7TCwk9aCfSNJ99jpsP3J0F4mbkUfI2SR7OuEDAloqdTj4p6CvaCgYKAWwSARISFQHGX2MiDr_hX_g8YsVQA2lkmPxEwA0171",
    email:"matveykaplay1234@gmail.com",
    photo_url:"https://lh3.googleusercontent.com/a/ACg8ocIKl5q-nfJ2ddNb5KBt-Ao-lSytRQFk7EIdrjJ32QcOI0bzG-E=s96-c"
  } as UserInfo)

  window.addEventListener("click",function(event) {
    if(!event.target)return
    if(!(event.target instanceof Element))return 
    if (!(event.target as Element).classList.contains("dropdown")) {
      if((event.target as Element).getElementsByClassName("dropdown").length>0)return
      const allDropDowns=Array.from(document.getElementsByClassName("dropdown"))
      for(var el of allDropDowns){
          el.classList.add("hidden")
      }
    }
  })
  function showDropDown( e: React.MouseEvent<HTMLDivElement, MouseEvent>){
      const allDropDowns=Array.from(document.getElementsByClassName("dropdown"))
      for(var el of allDropDowns){
          el.classList.add("hidden")
      }
      const dropDown=(e.currentTarget as HTMLElement).getElementsByClassName("dropdown")[0]
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
          {Object.keys(userInfo).length === 0?<SignIn setUserInfo={setUserInfo}/>:<UserProfile userInfo={userInfo} setUserInfo={setUserInfo} />}
          
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
