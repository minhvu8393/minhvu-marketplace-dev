import queryString from 'query-string';
import React from 'react';

const FacebookLogin = () => {
    const stringParams = queryString.stringify({
        client_id: '992260077922450',
        redirect_uri: 'https://localhost:8080/facebookauth',
        scope: 'email',
        response_type: 'code',
        display: 'page',
    })
    
    const facebookLoginUrl = `https://www.facebook.com/v3.2/dialog/oauth?${stringParams}`
    return (
        <div className='login__facebook'>
            <a href={facebookLoginUrl}>
                Login with Facebook
            </a>
        </div>
    )
}

export default FacebookLogin;