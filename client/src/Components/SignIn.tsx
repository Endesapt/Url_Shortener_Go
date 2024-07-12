import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import { ErrorResponse } from "react-router-dom";
import { UserInfo } from "../Models/UserInfo";
import { axiosApi } from "../axiosInstance";

export default function SignIn({setUserInfo}:{
  setUserInfo:React.Dispatch<React.SetStateAction<UserInfo>>
}){
    const googleLogin = useGoogleLogin({
        onSuccess: codeResponse =>{
            axiosApi.post(`auth/google`,{ code: codeResponse.code },{
              withCredentials:true
            })
              .then(async response => {
                const data=response.data
                const expiredDate=new Date()
                expiredDate.setSeconds(expiredDate.getSeconds()+data.expires_in)
                localStorage.setItem("id_token",data.id_token)
                localStorage.setItem("email",data.email)
                localStorage.setItem("expires_in",expiredDate.toString())
                localStorage.setItem("photo_url",data.photo_url)


                const res=await axiosApi.get("getLinks",{
                  params:{
                    "id_token":data.id_token,
                  }
                })
                if(res.status==200){
                  data.links=res.data
                  localStorage.setItem("userLinks",JSON.stringify(res.data))
                }
                setUserInfo({...data})
              })
              .catch(error => {
                console.error('Error:', error);
              });
        },
        flow: 'auth-code',
      });
      return (
        <div>
          <div className='bg-[#EE6123] px-4 py-2 rounded-md text-white text-lg font-medium hover:cursor-pointer'
          onClick={()=>googleLogin()}>
            Sing up
          </div>
        </div>
      );
}