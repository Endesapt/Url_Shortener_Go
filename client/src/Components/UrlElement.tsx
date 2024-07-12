import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UrlInfo } from "../Models/UrlInfo";
import { faCaretDown, faCross, faDeleteLeft, faEdit, faGear, faInfo, faInfoCircle, faQrcode, faSave, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { UserInfo } from "../Models/UserInfo";
import { link } from "fs";
import Popup from "reactjs-popup";
import { useState } from "react";
import { axiosApi } from "../axiosInstance";



export default function UrlElement({ shortUrl, userInfo, setUserInfo }: {
    shortUrl: string,
    userInfo: UserInfo,
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>
}) {
    const [openInfo, setOpenInfo] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [originalUrlEdit, setOriginalUrl] = useState("")
    const [shortUrlEdit, setShortUrl] = useState("")
    const [info, setInfo] = useState({} as UrlInfo)
    const [errorText,setErrorText]=useState("")
    function openGetInfo() {
        axiosApi.get(`getInfo/${shortUrl}`)
            .then(data => {
                setInfo(data.data)
                setOpenInfo(true)
            })
    }
    function openEditInfo() {
        axiosApi.get(`getInfo/${shortUrl}`)
            .then((res) => {
                const data: UrlInfo=res.data
                setOriginalUrl(data.originalUrl)
                setShortUrl(shortUrl)
                setOpenEdit(true)
            })
    }
    function editUrl() {
        const url = new URL(`/api/`,`https://${window.location.hostname}`)
        if (originalUrlEdit == "" || shortUrl == "") return
        axiosApi.patch(`editURL/${shortUrl}`, {
            id_token: userInfo.id_token,
            originalUrl: originalUrlEdit,
            shortUrl: shortUrlEdit
        }).then(response => {
                if(response.status!=200){
                    return Promise.reject(response.data);
                }
                
                setUserInfo((userInfo) => {
                    const links = [...userInfo.links]
                    links[links.findIndex((l) => l == shortUrl)] = shortUrlEdit
                    localStorage.setItem("userLinks", JSON.stringify(links))
                    const newUserInfo = {
                        email: userInfo.email,
                        photo_url: userInfo.photo_url,
                        id_token: userInfo.id_token,
                        links: links
                    } as UserInfo
                    return newUserInfo
                })
                setOpenEdit(false)
            }).catch(async (response)=>{
                const message=await response;
                setErrorText(message.message)
            })
    }
    function deleteLink() {
        axiosApi.delete(`deleteURL/${shortUrl}`,{
            params:{
                id_token:userInfo.id_token,
            }
        }).then(response => {
            if(response.status!=200){
                return Promise.reject(response.data);
            }
                setUserInfo((userInfo) => {
                    const links = [...userInfo.links]
                    links.splice(links.findIndex((l) => l == shortUrl), 1)
                    localStorage.setItem("userLinks", JSON.stringify(links))
                    const newUserInfo = {
                        email: userInfo.email,
                        photo_url: userInfo.photo_url,
                        id_token: userInfo.id_token,
                        links: links
                    } as UserInfo
                    return newUserInfo
                })
            })
    }
    return (<div className="p-2 border-b border-b-gray-400 flex items-center w-full">
        <div className="flex flex-col gap-3">
            <div className="flex gap-2">
                <FontAwesomeIcon icon={faQrcode} className="h-5" />
                <a href={`https://${window.location.hostname}/api/${shortUrl}`} className="text-orange-500">
                    {shortUrl}
                </a>
            </div>
            <p className="text-gray-400 text-sm">
            </p>
        </div>
        <div className="ml-auto flex gap-2">


            <div className="text-sm rounded-md bg-stone-500 text-white hover:bg-stone-600 hover:cursor-pointer p-2 flex items-center gap-1" onClick={() => openGetInfo()}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Info
            </div>
            <div className="text-sm rounded-md bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer p-2 flex items-center gap-1" onClick={() => deleteLink()}>
                <FontAwesomeIcon icon={faTrash} />
                Delete
            </div>
            <div className="text-sm rounded-md bg-orange-500 text-white hover:bg-orange-600 hover:cursor-pointer p-2 flex items-center gap-1" onClick={() => openEditInfo()}>
                <FontAwesomeIcon icon={faEdit} />
                Edit
            </div>
        </div>
        <Popup open={openInfo} onClose={() => { setOpenInfo(false) }} modal nested>
            <div className='modal '>
                <div className=" h-10 p-2 text-center bg-[#284243] text-white">
                    Info {shortUrl}
                </div>
                <div className="p-2">
                    Short URL: https://{window.location.hostname}/{shortUrl}
                </div>
                <div className="p-2">
                    Original URL: <a href={info.originalUrl} className="text-orange-500">{info.originalUrl}</a>
                </div>
                <div className="p-2">
                    Click Count: {info.count}
                </div>
            </div>
        </Popup>
        <Popup open={openEdit} onClose={() => { setOpenEdit(false) }} modal nested>
            <div className='modal '>
                <div className='content'>
                    <div className=" p-4 h-10  flex items-center bg-[#284243] text-white">
                        Edit https://{window.location.hostname}/{shortUrl}
                        <FontAwesomeIcon className="ml-auto hover:cursor-pointer" icon={faXmark} onClick={() => setOpenEdit(false)} />
                    </div>
                    <div className=" flex flex-col gap-5 p-4">
                        <div className=" flex flex-col gap-1">
                            <p>Short URL</p>
                            <input className=' w-full p-2 border rounded-md placeholder:text-slate-400 '
                                value={shortUrlEdit} onChange={(e) => setShortUrl(e.target.value)} >
                            </input>
                        </div>
                        <div className=" flex flex-col gap-1">
                            <p>Original URL</p>
                            <input className=' w-full p-2 border rounded-md placeholder:text-slate-400 '
                                value={originalUrlEdit} onChange={(e) => setOriginalUrl(e.target.value)} >
                            </input>
                        </div>
                        <div className=" bg-[#284243] p-2 w-fit flex text-white font-semibold gap-2 items-center rounded-md hover:cursor-pointer"
                            onClick={() => { editUrl() }}>
                            <FontAwesomeIcon icon={faSave} />
                            Save
                        </div>
                        {errorText == "" ? null :
                            <div className=' drop-shadow-lg flex w-full justify-center  max-w-4xl' >
                                <div className='bg-slate-100 w-full border rounded-md py-4 px-8'>
                                    <ul className='list-disc text-red-500'>
                                        <li>{errorText}</li>
                                    </ul>
                                </div>
                            </div>
                        }
                    </div>

                </div>
            </div>
        </Popup>
    </div>
    )
}





