import naverLogo from '../../../assets/images/icon/naver.png'
import { SnsLogo } from '../../../components/elements/AuthContentTemplete'
import NaverLogin from 'react-login-by-naver';
const NaverLoginButton = (props) => {
    const { onLoginBySns, snsLogin } = props;

    const NAVER_CLIENT_ID = 'JnMCDdLSuGCwAxCW8BiF'
    const NAVER_CALLBACK_URL = 'https://masterpick.co.kr/login'

    const onNaverLogin = (obj) =>{
        let objs = {
            id: obj.id,
            profile_nickname: obj.name,
            login_type: 2,
            profile_image_url: obj.profile_image,
        }
        onLoginBySns(objs);
    }

    return (
        <>
        {window && window.flutter_inappwebview?
        <>
        <SnsLogo src={naverLogo} onClick={()=>snsLogin(2)}/>
        </>
        :
        <>
        <NaverLogin
                clientId={NAVER_CLIENT_ID}
                callbackUrl={NAVER_CALLBACK_URL}
                isPopup={false}
                render={(props) => <SnsLogo src={naverLogo} onClick={props.onClick}/>}
                onSuccess={(naverUser) => onNaverLogin(naverUser)}
                onFailure={(result) => console.error(result)}
            />
        </>
        }
            
        </>
    )
}
export default NaverLoginButton;