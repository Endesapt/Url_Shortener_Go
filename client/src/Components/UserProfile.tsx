import { UserInfo } from '../Models/UserInfo';

export default function UserProfile({userInfo,setUserInfo}:{
  userInfo:UserInfo,
  setUserInfo:React.Dispatch<React.SetStateAction<UserInfo>>
}){
    function Logout(){
      setUserInfo({} as UserInfo)
      localStorage.removeItem("access_token")
      localStorage.removeItem("email")
      localStorage.removeItem("expires_in")
      localStorage.removeItem("photo_url")
    }
    
    return(<div className='flex items-center ml-auto gap-5'>
        <img className='h-14 w-14  rounded-full' src={userInfo.photo_url}/>
        <div className='bg-[#EE6123] px-4 py-2 rounded-md text-white text-lg font-medium hover:cursor-pointer'
          onClick={()=>{Logout()}}>
            Logout
          </div>
    </div>
        
    )
}