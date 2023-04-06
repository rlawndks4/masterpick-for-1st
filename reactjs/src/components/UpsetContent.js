import upsetImg from '../assets/images/upset.png'
export default function UpsetContent(props) {


  return (
    <>
    <img src={upsetImg} alt="#" style={{width:'6rem',paddingTop:'3rem'}} />
    <div style={{paddingTop:'1rem'}}>{props.content}</div>
    </>
  );
}