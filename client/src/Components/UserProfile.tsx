import { axiosApi } from '../axiosInstance';
import { UserInfo } from '../Models/UserInfo';
import { googleLogout } from '@react-oauth/google';

export default function UserProfile({userInfo,setUserInfo}:{
  userInfo:UserInfo,
  setUserInfo:React.Dispatch<React.SetStateAction<UserInfo>>
}){
    async function Logout(){
      localStorage.clear()
      googleLogout()
      await axiosApi.post("/auth/logout",{},{
        withCredentials:true
      })
      setUserInfo({} as UserInfo)
      
      
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