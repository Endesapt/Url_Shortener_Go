import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import { ErrorResponse } from "react-router-dom";
import { UserInfo } from "../Models/UserInfo";

export default function SignIn({setUserInfo}:{
  setUserInfo:React.Dispatch<React.SetStateAction<UserInfo>>
}){
    const googleLogin = useGoogleLogin({
        onSuccess: codeResponse =>{
            fetch('http://localhost:80/auth/google', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: codeResponse.code }),
              })
              .then(response => response.json())
              .then(data => {
                console.log(data)
                localStorage.setItem("access_token",data.access_token)
                localStorage.setItem("email",data.email)
                localStorage.setItem("expires_in",data.expires_in)
                localStorage.setItem("photo_url",data.photo_url)
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