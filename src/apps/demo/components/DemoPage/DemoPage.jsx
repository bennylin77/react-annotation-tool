import React from 'react';
import { hot } from 'react-hot-loader';
import { TwoDimensionalImage } from 'apps/index';
import './DemoPage.css';

const DemoPage = () => {
    const handleSubmit = r => console.log(r);
    const imageAnnotation = [{
        id: 'jlyjm4py',
        name: 'jlyjm4py',
        type: 'Polygon',
        color: 'rgba(227,0,255,1)',
        vertices: [{
            id: 'jlyjm4py', name: 'jlyjm4py', x: 353.36249923706055, y: 258.8999938964844,
        }, {
            id: 'jlyjm5em', name: 'jlyjm5em', x: 444.79999923706055, y: 255.89999389648438,
        }, {
            id: 'jlyjm5v2', name: 'jlyjm5v2', x: 444.79999923706055, y: 269.8999938964844,
        }, {
            id: 'jlyjm6ci', name: 'jlyjm6ci', x: 477.79999923706055, y: 269.8999938964844,
        }, {
            id: 'jlyjm6ul', name: 'jlyjm6ul', x: 480.79999923706055, y: 285.8999938964844,
        }, {
            id: 'jlyjm7r8', name: 'jlyjm7r8', x: 356.79999923706055, y: 289.8999938964844,
        }],
        selected: [{ id: '0', value: 'root' }, { id: '2', value: 'Text' }, { id: '2-15', value: 'Suspicious' }],
    }];
    const menu = {
        id: '0',
        value: 'root',
        options: [
            {
                id: '1',
                value: 'Object',
                options: [
                    {
                        id:
                        '1-1',
                        value: 'Face',
                        options: [],
                    },
                    { id: '1-2', value: 'Face Reflection', options: [] },
                    { id: '1-3', value: 'Framed Photo', options: [] },
                    { id: '1-4', value: 'Tattoo', options: [] },
                    { id: '1-5', value: 'Suspicious', options: [] },
                    { id: '1-6', value: 'Other', options: [] },
                ],
            },
            {
                id: '2',
                value: 'Text',
                options: [
                    { id: '2-1', value: 'Letter', options: [] },
                    { id: '2-2', value: 'Computer Screen', options: [] },
                    { id: '2-3', value: 'Pill Bottle/Box', options: [] },
                    { id: '2-4', value: 'Miscellaneous Papers', options: [] },
                    { id: '2-5', value: 'Menu', options: [] },
                    { id: '2-6', value: 'Credit Card', options: [] },
                    { id: '2-7', value: 'Business Card', options: [] },
                    { id: '2-8', value: 'Poster', options: [] },
                    { id: '2-9', value: 'Clothing', options: [] },
                    { id: '2-10', value: 'Book', options: [] },
                    { id: '2-11', value: 'Receipt', options: [] },
                    { id: '2-12', value: 'Street Sign', options: [] },
                    { id: '2-13', value: 'License Plate', options: [] },
                    { id: '2-14', value: 'Newspaper', options: [] },
                    { id: '2-15', value: 'Suspicious', options: [] },
                    { id: '2-16', value: 'Other', options: [] },
                ],
            },
        ],
    };
    return (
        <div>
            <TwoDimensionalImage
                onNextClick={ handleSubmit }
                onPreviousClick={ handleSubmit }
                onSkipClick={ handleSubmit }
                annotationWidth={ 500 }
                menu={ menu }
                category='Others'
                categoryOptions={ ['No Objects', 'No Image'] }
                annotations={ imageAnnotation }
                disabledOptionLevels={ [] }
                dynamicOptions
                labeled
                url='https://www.gtice.is/wp-content/uploads/2015/06/Snaefellsnes_Tour_Kirkjufell_by_KateI.jpg'
            />
        </div>
    );
};

export default hot(module)(DemoPage);
