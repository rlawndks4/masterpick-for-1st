import axios from "axios";
import { useEffect, useState } from "react";
import { Title, Wrappers } from "../../components/elements/UserContentTemplete";

import MasterSlide from "../../components/MasterSlide";
import MasterCard from "../../components/MasterCard";
import Loading from "../../components/Loading";

const MasterList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true)

            const { data: response } = await axios.get('/api/items?table=master&status=1');
            setPosts(response.data);
            setLoading(false)

        }
        fetchPosts();
    }, [])
    
    return (
        <>
            <Wrappers>
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <MasterSlide status={1} />
                        {posts.map((item, idx) => (
                            <>
                                <MasterCard item={item} />
                            </>
                        ))}
                    </>}
            </Wrappers>
        </>
    )
}
export default MasterList;