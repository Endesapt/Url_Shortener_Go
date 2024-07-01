import UrlElement from "../Components/UrlElement"
import { UserInfo } from "../Models/UserInfo"

export default function LinkManagment({userInfo}:{
    userInfo:UserInfo
}){
    const totalLinkCount=userInfo.links.length
    return(
    <div className=" flex gap-10 px-20 max-w-6xl ">
        <div className="flex flex-col w-full">
        {userInfo.links.map(link=><UrlElement shortUrl={link}/>)}
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