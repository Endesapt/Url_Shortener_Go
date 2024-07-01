import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UrlInfo } from "../Models/UrlInfo";
import { faCaretDown, faGear, faQrcode } from "@fortawesome/free-solid-svg-icons";

export default function UrlElement({shortUrl}:{
    shortUrl:string
}){
    return(<div className="p-2 border-b border-b-gray-400 flex items-center w-full">
        <div className="flex flex-col gap-3">
            <div className="flex gap-2">
                <FontAwesomeIcon icon={faQrcode} className="h-5"/>
                <p className="text-orange-500 hover:cursor-pointer">
                    {shortUrl}
                </p>
            </div>
            <p className="text-gray-400 text-sm">
            </p>
        </div>
        <div className=" ml-auto rounded-md bg-stone-500 text-white hover:bg-stone-600 hover:cursor-pointer p-2 flex gap-2">
            <FontAwesomeIcon icon={faGear}/>
            <FontAwesomeIcon icon={faCaretDown}/>
        </div>
    </div>
    )
}