import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import { ErrorResponse } from "react-router-dom";

export default function SignIn(){
    const googleLogin = useGoogleLogin({
        onSuccess: codeResponse =>{
            console.log(codeResponse.code);
            fetch('http://localhost:80/auth/google', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: codeResponse.code }),
              })
              .then(response => response.json())
              .then(data => {
                console.log('Backend response:', data);
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