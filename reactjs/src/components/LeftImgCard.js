import { useState } from "react";
import theme from "../styles/theme";

const LeftImgCard = (props) => {
    const [hash, setHash] = useState("")

    return (
        <>
            <div style={{ display: 'flex', width: '100%', marginTop: '24px', minHeight: '150px', height: '45vw', maxHeight: '200px' }}>
                <img src={props.item?.img??""} alt="#" style={{ width: '37.5%' }} />

                <div style={{ width: 'auto', padding: '16px', background: `${theme.color.background3}`, display: 'flex', flexDirection: 'column', width: '62.5%', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: `${theme.size.font4}`, fontWeight: 'bold' }}>{props.item?.date??""} {props.item?.title??""}</div>
                    <div style={{ fontSize: `${theme.size.font5}` }}>{props.item?.sub_title??""}</div>
                    <div style={{ fontSize: `${theme.size.font5}`, display: 'flex', flexWrap: 'wrap' }}>
                        {props.item?.hash}
                    </div>
                </div>
            </div>
        </>
    )
}
export default LeftImgCard;