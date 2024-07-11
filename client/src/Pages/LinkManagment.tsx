import { Navigate } from "react-router-dom"
import UrlElement from "../Components/UrlElement"
import { UserInfo } from "../Models/UserInfo"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"

export default function LinkManagment({ userInfo, setUserInfo }: {
    userInfo: UserInfo,
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>
}) {
    const [linkText, setlinkText] = useState("")
    const [errorText, setErrorText] = useState("")
    function shortenLink() {
        setErrorText("")
        if (linkText == null || linkText == "") {
            setErrorText("No link provided!")
            return
        }
        const regex = new RegExp(/^https?:\/\/[\w\/.:?=%-\+&-]*$/);
        if (!regex.test(linkText)) {
            setErrorText("This is not a link!")
            return
        }
        const url = new URL("/api/shortenURL",`${location.protocol}//${window.location.hostname}`)
        url.searchParams.append("url", linkText)
        const body = {
            id_token: userInfo.id_token
        }
        fetch(url, {
            method: "POST",
            body: JSON.stringify(body)
        })
            .then((response) => {
                if (!response.ok) {
                    setErrorText("Error while creating short URL!")
                    return
                }
                return response.json()
            }).then(data => {

                setUserInfo((userInfo) => {
                    const id=String(data.shortUrl).split("/").at(-1)
                    const links=[...userInfo.links, id!]
                    userInfo.links = links
                    localStorage.setItem("userLinks",JSON.stringify(links))
                    return userInfo
                })
                setlinkText("")
            })
    }

    if (userInfo.id_token == null) {
        return <Navigate to="/" />
    }
    const totalLinkCount = userInfo.links.length
    return (
        <div className=" flex gap-10 px-20 max-w-6xl ">
            <div className="flex w-full flex-col gap-3">
                <div className=' drop-shadow-lg flex w-full justify-center max-w-4xl'>
                    <input className=' w-full p-4 border rounded-l-md placeholder:text-slate-400 placeholder:text-lg'
                        placeholder='Enter a link to shorten it'
                        value={linkText} onChange={(e) => setlinkText(e.target.value)} >
                    </input>
                    <div className=' p-3 text-white  font-bold flex items-center gap-2 bg-[#284243] hover:bg-[#1a3839] rounded-r-md hover:cursor-pointer '
                        onClick={() => { shortenLink() }}>
                        Shorten <FontAwesomeIcon icon={faAngleRight} />
                    </div>
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
                <div className="flex flex-col w-full">
                    {userInfo.links.map(link => <UrlElement key={link} shortUrl={link} userInfo={userInfo} setUserInfo={setUserInfo} />)}
                </div>
            </div>

            <div className="w-[450px] flex flex-col gap-8">
                <div className="flex flex-col">
                    <div className="h-14 bg-[#284243] flex items-center justify-center text-white">
                        Total Count
                    </div>
                    <div className=" bg-gray-200 p-4 text-center flex flex-col gap-5">
                        <div className="flex">
                            <p className=" font-semibold">Total Clicks: </p>
                            <p className="ml-auto text-orange-500">A lot</p>
                        </div>
                    </div>
                    <div className=" bg-gray-200 p-4 text-center flex flex-col gap-5">
                        <div className="flex">
                            <p className=" font-semibold">Total Links: </p>
                            <p className="ml-auto text-orange-500">{totalLinkCount}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="h-14 bg-[#284243] flex items-center justify-center text-white">
                        About Bitly
                    </div>
                    <div className=" bg-gray-200 p-4 text-center">
                        Creating, sharing, and monitoring your short links is easy with Bitly. We help you work faster and more intelligently with features like branded links and the ability to update the redirect of any link.
                    </div>
                </div>
            </div>

        </div>)
}