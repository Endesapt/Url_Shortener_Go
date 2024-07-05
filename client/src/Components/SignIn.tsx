import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import { ErrorResponse } from "react-router-dom";
import { UserInfo } from "../Models/UserInfo";

export default function SignIn({setUserInfo}:{
  setUserInfo:React.Dispatch<React.SetStateAction<UserInfo>>
}){
    const googleLogin = useGoogleLogin({
        onSuccess: codeResponse =>{
            fetch('http://localhost:80/api/auth/google', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: codeResponse.code }),
              })
              .then(response => response.json())
              .then(async data => {
                const expiredDate=new Date()
                expiredDate.setSeconds(expiredDate.getSeconds()+data.expires_in)
                localStorage.setItem("id_token",data.id_token)
                localStorage.setItem("email",data.email)
                localStorage.setItem("expires_in",expiredDate.toString())
                localStorage.setItem("photo_url",data.photo_url)

                const linksUrl=new URL("http://localhost:80/api/getLinks")
                linksUrl.searchParams.append("id_token",data.id_token)
                const res=await fetch(linksUrl)
                const linksData=await res.json()
                if(linksData!=null){
                  data.links=linksData
                  localStorage.setItem("userLinks",JSON.stringify(linksData))
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