import React from 'react';
import { hot } from 'react-hot-loader';
import { TwoDimensionalImage } from 'index';
import './DemoPage.css';


const DemoPage = () => {
    const test = 123;
    return (
        <div>
            {test}
            <TwoDimensionalImage />
        </div>
    );
};

export default hot(module)(DemoPage);
