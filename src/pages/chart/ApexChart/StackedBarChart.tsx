import Chart from 'react-apexcharts';
import { Card, Dropdown } from 'react-bootstrap';
import { ApexOptions } from 'apexcharts';

// stacked bar chart
const StackedBarChart = () => {
    // default options
    const apexBarChartStackedOpts: ApexOptions = {
        chart: {
            height: 380,
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
        stroke: {
            show: false,
        },
        xaxis: {
            categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
            labels: {
                formatter: (val: string) => {
                    return val + 'K';
                },
            },
        },
        yaxis: {
            title: {
                text: undefined,
            },
        },
        colors: ['#35b8e0', '#98a6ad', '#10c469', '#ff5b5b', '#f9c851'],
        tooltip: {
            y: {
                formatter: (val: number) => {
                    return val + 'K';
                },
            },
        },
        fill: {
            opacity: 1,
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                },
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
        },
        grid: {
            borderColor: '#f7f7f7',
        },
    };

    // chart data
    const apexBarChartStackedData = [
        {
            name: 'Marine Sprite',
            data: [44, 55, 41, 37, 22, 43, 21],
        },
        {
            name: 'Striking Calf',
            data: [53, 32, 33, 52, 13, 43, 32],
        },
        {
            name: 'Tank Picture',
            data: [12, 17, 11, 9, 15, 11, 20],
        },
        {
            name: 'Bucket Slope',
            data: [9, 7, 5, 8, 6, 9, 4],
        },
        {
            name: 'Reborn Kid',
            data: [25, 12, 19, 32, 25, 24, 10],
        },
    ];

    return (
        <Card>
            <Card.Body>
                <Dropdown className="float-end" align="end">
                    <Dropdown.Toggle as="a" className="cursor-pointer card-drop">
                        {/* <i className="mdi mdi-dots-vertical"></i> */}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>Action</Dropdown.Item>
                        <Dropdown.Item>Anothther Action</Dropdown.Item>
                        <Dropdown.Item>Something Else</Dropdown.Item>
                        <Dropdown.Item>Separated link</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <h4 className="header-title mb-3">Stacked Bar Chart</h4>
                <Chart
                    options={apexBarChartStackedOpts}
                    series={apexBarChartStackedData}
                    type="bar"
                    className="apex-charts"
                />
            </Card.Body>
        </Card>
    );
};

export default StackedBarChart;
