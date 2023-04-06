import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Title, Wrappers, Card, Img } from "../../components/elements/UserContentTemplete";
import SelectSubType from "../../components/elements/SelectSubType";
import SubType from "../../components/elements/SubType";
import logo from '../../assets/images/test/logo.svg'
import { getIframeLinkByLink, shuffleArray } from '../../functions/utils';
import theme from "../../styles/theme";
import { backUrl } from "../../data/Data";
import VideoCard from "../../components/VideoCard";

const VideoList = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [channels, setChannels] = useState([])
    const [channelNum, setChannelNum] = useState(0)
    const [channelVideoConnectObj, setChannelVideoConnectObj] = useState({});
    useEffect(() => {
        async function fetchPosts() {
            const { data: response0 } = await axios.get('/api/items?table=user&level=30');
            const { data: response1 } = await axios.get('/api/items?table=user&level=25');
            setChannels( [...response0?.data, ...response1?.data ]);
            let obj = {};
            let channel_list = [...response0?.data, ...response1?.data ] ?? [];
            for(var i =0;i<channel_list.length;i++){
                obj[`${channel_list[i].pk}`] = channel_list[i]?.channel_img ?? "";
            }
            setChannelVideoConnectObj(obj);
            const { data: response } = await axios.get('/api/items?table=video&status=1');
            let list = response.data;
            for (var i = 0; i < list.length; i++) {
                list[i].link = getIframeLinkByLink(list[i].link);
            }
            setPosts(list);
        }
        fetchPosts();

    }, [])
    const getVideoListByNum = async (num, pk) => {
        setChannelNum(num);
        let str = '/api/items?table=video&status=1';
        if (num > 0) {
            str += `&user_pk=${pk}`
        }
        const { data: response } = await axios.get(str);
        let list = response.data;
        for (var i = 0; i < list.length; i++) {
            list[i].link = getIframeLinkByLink(list[i].link);
        }
        setPosts(list)
    }
    return (
        <>
            <Wrappers style={{width:'100%',background:`${window.innerWidth>600?'#fff':theme.color.background3}`}}>
                <SelectSubType className='subtype-container' style={{ top: '3rem', height: '4rem', alignItems: 'center', marginBottom: '16px' }}>
                    <SubType onClick={() => { getVideoListByNum(0, 0) }} style={{ backgroundImage: `url(${logo})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: '2rem', height: '2rem', margin: '0.5rem', borderRadius: '50%', border: `1px solid ${theme.color.background1}`, opacity: `${channelNum == 0 ? '1' : '0.4'}` }} />
                    {channels.map((item, index) => (
                        <>
                            <SubType onClick={() => { getVideoListByNum(index + 1, item.pk) }} style={{ backgroundImage: `url(${backUrl + item.channel_img})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', width: '2rem', height: '2rem', margin: '0.5rem', borderRadius: '50%', border: `1px solid ${theme.color.background1}`, opacity: `${index + 1 == channelNum ? '1' : '0.4'}` }} >
                            </SubType>
                        </>
                    ))}

                </SelectSubType>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    {posts.map((item, idx) => (
                        <>
                            <VideoCard item={item} background={window.innerWidth>600?'':'#fff'} isVideoList={true} channelImg={channelVideoConnectObj[`${item?.user_pk}`]} isImgDiv={true} />

                        </>
                    ))}
                </div>
            </Wrappers>
        </>
    )
}
export default VideoList;