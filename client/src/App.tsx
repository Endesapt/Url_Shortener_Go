import React, {  useEffect, useState } from 'react';
import logo from './bitly_logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCode,  faLink, faQrcode, faRss } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate, Route, Router, Routes } from 'react-router-dom';
import UrlShortener from './Pages/UrlShortener';
import QrCodeGenerator from './Pages/QrCodeCreator';
import SignIn from './Components/SignIn';
import { UserInfo } from './Models/UserInfo';
import UserProfile from './Components/UserProfile';
import LinkManagment from './Pages/LinkManagment';
import { UrlInfo } from './Models/UrlInfo';



function App() {

  const [userInfo,setUserInfo]=useState({} as UserInfo)
  const [localLinks,setLinksInfo]=useState(Array<{shortUrl:string,originalUrl:string}>())

  
  useEffect(()=>{
    const email=localStorage.getItem("email")
    const photo_url=localStorage.getItem("photo_url")
    const id_token=localStorage.getItem("id_token")
    if(email==null){
      return
    }
    let links:Array<string>=[]
    const jsonLinks=localStorage.getItem("userLinks")
    if(jsonLinks){
      links=JSON.parse(jsonLinks);
    }
    setUserInfo({
      email:email,
      photo_url:photo_url,
      id_token:id_token,
      links:links
    } as UserInfo)
  },[])

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
      <div className=' bg-[#284243] px-20 py-4 flex gap-10 items-center mb-6 '>
        <Link to="/"><img className='w-20' src="https://cdn.freebiesupply.com/images/large/2x/bitly-logo-black-transparent.png"></img></Link>
        <div className=' flex gap-2 items-center text-white text-lg font-medium relative hover:cursor-pointer' onClick={(e)=>showDropDown(e)}>
          Products<FontAwesomeIcon icon={faAngleDown}/>
          <div className='dropdown absolute hidden rounded-md border py-2 top-9 bg-white text-black text-sm w-48 z-[100]'>
            <Link to="/link-managment" className='flex flex-row gap-1 items-center hover:bg-[#dbdfdf] hover:cursor-pointer p-3'>
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
          <div className='dropdown absolute hidden rounded-md border py-2 top-9 bg-white text-black text-sm w-48 z-[100]'>
            <div className='flex flex-row gap-1 items-center hover:bg-[#dbdfdf] hover:cursor-pointer p-3'>
              <FontAwesomeIcon icon={faRss}/>
              Blog 
            </div>
            <Link to={`http://${window.location.hostname}/api/swagger/index.html`} className='flex flex-row gap-1 items-center hover:bg-[#dbdfdf] hover:cursor-pointer p-3'>
              <FontAwesomeIcon icon={faCode}/>
              API Documentation
            </Link>
          </div>
        </div>
        <div className=' ml-auto flex items-center gap-3'>
          {userInfo.email==null?<SignIn setUserInfo={setUserInfo}/>:<UserProfile userInfo={userInfo} setUserInfo={setUserInfo} />}
          
        </div>
      </div>
      <div className=' px-6 flex items-center flex-col gap-10'>
        <Routes>
          <Route path="/qr-code-generator" element={<QrCodeGenerator/>}/>
          <Route path="/link-managment" element={<LinkManagment userInfo={userInfo} setUserInfo={setUserInfo} />} />
          <Route path="/" element={<UrlShortener userInfo={userInfo} setLinksInfo={setLinksInfo} localLinks={localLinks} />}/>
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
