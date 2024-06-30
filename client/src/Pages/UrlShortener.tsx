import { faAngleRight, faArrowsToCircle, faChartLine, faCopy, faQrcode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

export default function UrlShortener(){
  const [linkText,setlinkText]=useState("")
  const [errorText,setErrorText]=useState("")
  const [linkInfo,setLinkInfo]=useState(Array<{shortUrl:string,originalUrl:string}>())
  function shortenLink(){
    setErrorText("")
      if(linkText==null || linkText==""){
          setErrorText("No link provided!")
          return
      }
      const regex=new RegExp(/^https?:\/\/[\w\/.?=%-&]*$/);
      if(!regex.test(linkText)){
        setErrorText("This is not a link!")
        return
      }
      const url=new URL("http://localhost/api/v1/shortenURL")
      url.searchParams.append("url",linkText)
      fetch(url,{
        method:"POST"
      })
        .then((response)=>{
          if (!response.ok){
            setErrorText("Error while creating short URL!")
            return
          }
          return response.json()
        }).then(data=>{
          setLinkInfo((linkInfo)=>{
            const newLink={
              shortUrl:data.shortUrl,
              originalUrl:linkText
            }
            return [...linkInfo,newLink]
          })
          setlinkText("")
        })
      
      
  }
  function copyUrlToClipboard(url:string){
    navigator.clipboard.writeText(url)
  }
    return(<>
        <div className='flex items-center flex-col gap-8 max-w-xl'>
          <div className=' text-[#284243] text-6xl font-semibold text-center'>
              Create Short URLs
            </div>
            <div className='font-light font-serif text-xl text-center'>
              <strong>Bitly</strong> is the World's Shortest Link Shortener service to track, brand, and share short URLs.
            </div>
        </div>
        <div className=' drop-shadow-lg flex w-full justify-center px-24 max-w-4xl'>
          <input className=' w-full p-4 border rounded-l-md placeholder:text-slate-400 placeholder:text-lg'
                placeholder='Enter a link to shorten it'
                value={linkText} onChange={(e)=>setlinkText(e.target.value)} >
          </input>
          <div className=' px-4 py-4 text-white text-lg font-bold flex items-center gap-2 bg-[#284243] rounded-r-md hover:cursor-pointer '
            onClick={()=>{shortenLink()}}>
            ShortenURL <FontAwesomeIcon icon={faAngleRight}/>
          </div>
        </div>
        {errorText==""?null:
          <div className=' drop-shadow-lg flex w-full justify-center px-24 max-w-4xl' >
            <div className='bg-slate-100 w-full border rounded-md py-4 px-8'>
              <ul className='list-disc text-red-500'>
                <li>{errorText}</li>
              </ul>
            </div>
          </div>
        }
       {linkInfo.length>0?
        linkInfo.map(link=>
          <div key={link.shortUrl} className=' drop-shadow-lg flex w-full justify-center px-24 max-w-4xl' >
            <div className='bg-[#D1ECF1] w-full border rounded-md py-4 px-8 flex min-w-[500px]'>
              <div className='flex flex-col gap-3 w-full'>
                <div className=' text-[#284243] font-semibold flex'>
                  {link.shortUrl}
                  <div className=' ml-auto text-white font-semibold flex gap-2'>
                      <div className='py-1 px-2 bg-[#284243] flex gap-1 rounded-lg items-center hover:cursor-pointer'
                        onClick={()=>{copyUrlToClipboard(link.shortUrl)}}>
                          <FontAwesomeIcon icon={faCopy}/>
                          Copy URL
                      </div>
                  </div>
                </div>
                <p className=' text-[#5d8b92] text-sm'>{link.originalUrl}</p>
              </div>
            </div>
          </div>)
        :null}
        <div className=' grid grid-cols-3 gap-3 px-10 max-w-5xl'>
            <div className=' text-center flex flex-col items-center gap-3'>
              <FontAwesomeIcon icon={faArrowsToCircle} className=' text-6xl text-[#333]'/>
              <p className=' text-3xl font-bold text-[#333]'>
                Shorten URLs
              </p>
              URL Shortener makes long links look cleaner and easier to share! 
            </div>
            <div className=' text-center flex flex-col items-center gap-3'>
              <FontAwesomeIcon icon={faChartLine} className=' text-6xl text-[#333]'/>
              <p className=' text-3xl font-bold text-[#333]'>
                Track Link Clicks
              </p>
              URL Shortener can track your link clicks and even IPs of those, who clicked! 
            </div>
            <div className=' text-center flex flex-col items-center gap-3'>
              <FontAwesomeIcon icon={faQrcode} className=' text-6xl text-[#333]'/>
              <p className=' text-3xl font-bold text-[#333]'>
                Create QR Code
              </p>
              Easily create trackable QR Codes to share with your friends and other people!
            </div>
          </div>
      </>)
}