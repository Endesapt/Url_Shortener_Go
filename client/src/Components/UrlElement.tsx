import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UrlInfo } from "../Models/UrlInfo";
import { faCaretDown, faCross, faDeleteLeft, faEdit, faGear, faInfo, faInfoCircle, faQrcode, faSave, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { UserInfo } from "../Models/UserInfo";
import { link } from "fs";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { useState } from "react";



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
    function openGetInfo() {
        const url = new URL(`http://localhost/api/v1/getInfo/${shortUrl}`)
        fetch(url, {
            method: "GET"
        })
            .then((response) => {
                return response.json()
            }).then(data => {
                setInfo(data)
                setOpenInfo(true)
            })
    }
    function openEditInfo() {
        const url = new URL(`http://localhost/api/v1/getInfo/${shortUrl}`)
        fetch(url, {
            method: "GET"
        })
            .then((response) => {
                return response.json()
            }).then((data: UrlInfo) => {
                setOriginalUrl(data.originalUrl)
                setShortUrl(shortUrl)
                setOpenEdit(true)
            })
    }
    function editUrl(){
        const url = new URL(`http://localhost/api/v1/editURL/${shortUrl}`)
        if(originalUrlEdit == "" || shortUrl=="")return
        const body = {
            id_token: userInfo.id_token,
            originalUrl:originalUrlEdit,
            shortUrl:shortUrlEdit
        }
        fetch(url, {
            method: "PATCH",
            body: JSON.stringify(body)
        })
            .then((response) => {
                return response.json()
            }).then(_ => {
                setUserInfo((userInfo) => {
                    const links = [...userInfo.links]
                    links[links.findIndex((l) => l == shortUrl)]=shortUrlEdit
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
    function deleteLink() {
        const url = new URL(`http://localhost/api/v1/deleteURL/${shortUrl}`)
        const body = {
            id_token: userInfo.id_token
        }
        fetch(url, {
            method: "DELETE",
            body: JSON.stringify(body)
        })
            .then((response) => {
                if(!response.ok)return
                return response.json()
            }).then(_ => {
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
                <a href={`http://localhost/link/${shortUrl}`} className="text-orange-500">
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
            <div className='modal m-[-7px] '>
                <div className=" h-10 p-2 text-center bg-[#284243] text-white">
                    Info http://localhost/{shortUrl}
                </div>
                <div className="p-2">
                    Short URL: http://localhost/{shortUrl}
                </div>
                <div className="p-2">
                    Original URL: <a href={info.originalUrl} className="text-orange-500">{info.originalUrl}</a>
                </div>
                <div className="p-2">
                    Click Count: {info.count}
                </div>
            </div>
        </Popup>
        <Popup  open={openEdit} onClose={() => { setOpenEdit(false) }} modal nested>
            <div className='modal m-[-7px]'>
                <div className='content'>
                    <div className=" p-4 h-10  flex items-center bg-[#284243] text-white">
                        Edit http://localhost/{shortUrl}
                        <FontAwesomeIcon className="ml-auto hover:cursor-pointer" icon={faXmark} onClick={()=>setOpenEdit(false)}/>
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
                            onClick={()=>{editUrl()}}>
                            <FontAwesomeIcon icon={faSave}/>
                            Save
                        </div>
                    </div>
                    
                </div>
            </div>
        </Popup>
    </div>
    )
}





