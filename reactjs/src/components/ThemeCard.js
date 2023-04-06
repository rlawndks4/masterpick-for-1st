import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { backUrl } from "../data/Data";
import { commarNumber, returnMoment } from "../functions/utils";
import theme from "../styles/theme";
import SubType from "./elements/SubType";
import axios from "axios";
const Card = styled.div`
width: 48%; 
display: flex;
margin-bottom: 16px;
height: 220px;
@media screen and (max-width:1000px) {
    height: 24vw;
}
@media screen and (max-width:700px) {
    width: 100%; 
    height: 36vw;
    min-height:180px;
}
`
const Img = styled.div`
width: 125px;
height: 180px;
margin: 10px;
background:#fff;
// border:1px solid #707070;
@media screen and (max-width:1000px) {
    width:12.5vw;
    height: 18vw;
    margin:1vw;
}
@media screen and (max-width:700px) {
    width:25vw;
    height: 36vw;
    margin:auto 2vw;
}
`
const Title = styled.div`
font-size:${theme.size.font2}; 
font-weight: bold;
margin-bottom:auto;
`
const TextContainer = styled.div`
padding: 16px;
display: flex;
flex-direction: column;
align-items:center;
text-align:center;
width:300px;
justify-content: space-between;
@media screen and (max-width:1000px) {
    width:31.2vw;
    padding:1vw;
}
@media screen and (max-width:700px) {
    width:66vw;
    padding:2vw;
}
`
const Hash = styled.div`
font-size: ${theme.size.font3};
display: flex;
flex-wrap: wrap;
align-item:center;
font-weight:bold;
margin:auto;
`
const BottomContent = styled.div` 
display: flex;
flex-direction: column;
margin-top: 4px;
`
const ThemeCard = (props) => {
    const { data } = props;
    const navigate = useNavigate();
    const addSubscribeMaster = async () => {
        if (localStorage.getItem('auth')) {
            if (window.confirm('구독 하시겠습니까?')) {
                const { data: response } = await axios.post('/api/addsubscribe', {
                    user_pk: JSON.parse(localStorage.getItem('auth'))?.pk,
                    master_pk: data.pk
                })
                if (response.result > 0) {
                    alert("구독을 완료하였습니다.")
                } else {
                    alert(response.message);
                }
            }
        } else {
            alert('로그인을 해주세요.');
            navigate('/login');
            return;
        }
    }
    return (
        <>
            <Card>
                <TextContainer>
                    <Img style={{
                        backgroundImage: `url(${backUrl + data?.profile_img ?? ""})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundBlendMode: 'multiply', borderRadius: '50%'
                    }} />
                    <Title>{data?.name ?? ""}</Title>
                </TextContainer>


                <TextContainer>
                    <Title style={{ fontSize: theme.size.font3, margin: '8px 0' }}> {data?.yield_motto ?? ""}</Title>
                    <BottomContent>
                        <Hash>
                            <p style={{ margin: '8px 4px 8px 0' }}>{data.yield_title}</p> <p style={{ color: '#FB0000', margin: '8px 0 8px 4px' }}>{parseInt(data.yield) >= 0 ? '+' : '-'}{commarNumber(data.yield)}%</p>
                        </Hash>
                        <div style={{ display: 'flex', margin: '0 auto' }}>
                            <SubType style={{ background: theme.color.background2 }} onClick={() => navigate(`/master/${data.pk}`)}>투자전략</SubType>
                            <SubType style={{ background: theme.color.background2 }} onClick={addSubscribeMaster}>가입하기</SubType>
                        </div>
                    </BottomContent>
                </TextContainer>
            </Card>
        </>
    )
}
export default ThemeCard;