import logo from '../assets/images/test/logo.svg'
export default function PleaseSelectMaster(props) {


  return (
    <>
    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
    <img src={logo} alt="#" style={{width:'6rem',paddingTop:'3rem'}} />
    <div style={{paddingTop:'1rem'}}>{'대가를 선택해 주세요.'}</div>
    </div>
    </>
  );
}