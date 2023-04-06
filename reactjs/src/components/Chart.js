import ApexCharts from 'react-apexcharts';
import theme from '../styles/theme';
const Chart = (props) => {

    
    const state = {
        series: [{
            name: "접속",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }, {
            name: "가입",
            data: [1, 4, 15, 41, 69, 32, 39, 31, 48]
        }, {
            name: "탈퇴",
            data: [3, 4, 1, 4, 9, 22, 9, 21, 8]
        }],

        options: {
            chart: {
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: '회원 통계 그래프',
                align: 'left'
            },
            grid: {
                row: {
                    colors: [ theme.color.background3, '#fff'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            }
        }
    }
    return (
        <>
            <div style={{width:'95%',height:'500px',margin:'1rem auto',background:'#fff'}}>
                <ApexCharts
                    options={state.options}
                    series={state.series}
                    typs='line'
                    width={'100%'}
                    height={'100%'}
                />
            </div>
        </>
    )
}
export default Chart;