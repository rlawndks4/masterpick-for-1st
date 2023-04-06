import theme from "../styles/theme";

const RightImgCard = (props) => {

    return (
        <>
            <div style={{ display: 'flex', width: '100%', maxWidth: '450px', marginTop: '24px', minHeight: '150px', height: '45vw', maxHeight: '200px' }}>

                <div style={{ width: 'auto', padding: '16px', background: `${theme.color.background3}`, display: 'flex', flexDirection: 'column', width: '62.5%', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: `${theme.size.font4}`, fontWeight: 'bold' }}>{props.item.date} {props.item.title}</div>
                    <div style={{ fontSize: `${theme.size.font5}` }}>{props.item.sub_title}</div>
                    <div style={{ fontSize: `${theme.size.font5}`, display: 'flex', flexWrap: 'wrap' }}>
                        {JSON.parse(props.item.hash_list).map((hash, index) => (
                            <>
                                <div>
                                    #{hash}
                                </div>
                            </>
                        ))}
                    </div>
                </div>
                <img src={props.item.img} alt="#" style={{ width: '37.5%' }} />

            </div>
        </>
    )
}
export default RightImgCard;