# react-annotation-tool
A react based video & image annotating tool. See [demo](https://chi-lin.com/projects/react-annotation-tool)

 [![NPM Version](https://img.shields.io/npm/v/react-annotation-tool.svg?branch=master)](https://www.npmjs.com/package/react-annotation-tool) 

## Quick Start

### Installation

Use npm to install the tool into your react project. 
```
npm i react-annotation-tool --save
```

### Usage
Two tools are available now. They are [Image Annotation Tool](#Image-Annotation-Tool) (aka TwoDimensionalImage) and [Video Annotation Tool](#Video-Annotation-Tool) (aka TwoDimensionalVideo) respectively. Import either one into your react component. 
```js
import {TwoDimensionalImage, TwoDimensionalVideo} from "react-annotation-tool"
```

## Image Annotation Tool

### Config Props

| Prop             | Description   | Format | Default |
| -------------    | ------------- | ------------- | -------------| 
| `url`              | Source of annotated image |String||
| `annotationWidth`  | Set the width of image|Number|`400`|
| `dynamicOptions`       | Enable annotators to add/delete menu options |Boolean|`false`|
| `disabledOptionLevels` | The levels which can't be selected. Start from "1". [Detail](#disabledOptionLevels)|[String]|[]|
| `category`  | Category of the image |String|
| `categoryOptions`  |  Options for categories. [Detail](#categoryOptions)| [String]|[]|
| `menu` | A set of options for tagging the image. [Detail](#menu)|Object||
| `annotations` | Default annotations. [Detail](#annotations)|[Object]|[]|
| `labeled` | Label the annotaions on the image |Boolean|`false`|

#### `disabledOptionLevels`
Array of Integer. Start from "1". e.g,
```js
[1, 2]
```
#### `categoryOptions`
Array of String. e.g,
```js
["No Objects", "No Image"]
```
#### `menu`
Nested array of object. Each object has `id`, `value` and `options` properties. Must start from object with "root" `value`. e.g,
```js
{id: "0", value: "root", options: [
   {id: "1", value: "Electronic", options: [
      {id: "1-1", value: "Laptop", options: [
         {id: "1-1-1", value: "Apple", options: []},         
         {id: "1-1-2", value: "Asus", options: []}  
      ]}, 
      {id: "1-2", value: "Charger", options: []},
      {id: "1-3", value: "Watch", options: []}
   ]},
   {id: "2", value: "Stationery", options: [
      {id: "2-1", value: "Pen", options: []},
      {id: "2-2", value: "Eraser", options: []}
   ]}
]}
```
#### `annotations`
```js
[{id: "jlhbb0cr", name: "jlhbb0cr", color: "rgba(227,0,255,1)", vertices:
    [{id: "jlhbb0cr", name: "jlhbb0cr", x: 228.8125, y: 126}, 
     {id: "jlhbb0ng", name: "jlhbb0ng", x: 254.5, y: 131}, 
     {id: "jlhbb0uh", name: "jlhbb0uh", x: 269.5, y: 145}, 
     {id: "jlhbb11f", name: "jlhbb11f", x: 280.5, y: 173},
     {id: "jlhbb17w", name: "jlhbb17w", x: 286.5, y: 215}, 
     {id: "jlhbb1dw", name: "jlhbb1dw", x: 287.5, y: 249},
     {id: "jlhbb360", name: "jlhbb360", x: 220.5, y: 141}],
  selected: [{id: "0", value: "root"}, {id: "1", value: "Electronic"}, {id: "1-1", value: "Laptop"}]},
 {id: "jlhbb6tx", name: "jlhbb6tx", color: "rgba(255,219,0,1)", vertices:    
    [{id: "jlhbb6tx", name: "jlhbb6tx", x: 103.5, y: 345}, 
     {id: "jlhbb7hm", name: "jlhbb7hm", x: 354.5, y: 306},   
     {id: "jlhbb80e", name: "jlhbb80e", x: 385.5, y: 452}, 
     {id: "jlhbb8st", name: "jlhbb8st", x: 116.5, y: 479}],
  selected: [{id: "2", value: "Stationery"}, {id: "2-1", value: "Pen"}]}
]
```

### Callback Props

| Prop           | Description   |
| -------------  | ------------- | 
| `onNextClick`    | Called when Next button is clicked |  
| `onPreviousClick`| Called when Previous button is clicked|        
| `onSkipClick`    | Called when Skip button is clicked|        


### Output

```js
{url: "https://images.pexels.com/photos/57750/pexels-photo-57750.jpeg", 
 category: "Others", 
 annotationScaleFactor: 0.26666666666666666, /* annotation width divided by nature width */
 annotationWidth: 500, 
 annotationHeight: 400, 
 annotations: [{ id: "jluju651", name: "jluju651", color: "rgba(0,4,255,1)", 
                 vertices: [{id:"jluju651", name:"jluju651", x: 124.5625, y: 26}, 
                            {id:"jlujucus", name:"jlujucus", x: 139.296875, y: 22},        
                            {id:"jlujuf07", name:"jlujuf07", x: 148.296875, y: 21},
                            {id:"jlujugpw", name:"jlujugpw", x: 154.296875, y: 11}
                            ...],
                 selected: []},
               { id: "jlujvoym", name: "jlujvoym", color: "rgba(255,219,0,1)", 
                 vertices: [{id:"jlujvoym", name:"jlujvoym", x: 183.25, y: 202},
                            {id:"jlujvrw7", name:"jlujvrw7", x: 314.296875, y: 200.5},
                            {id:"jlujvtwu", name:"jlujvtwu", x: 316.296875, y: 290},
                            {id:"jlujvvhw", name:"jlujvvhw", x: 181.796875, y: 292.5}],
                 selected: [{id: "0", value: "root"}, {id: "1", value: "Electronic"}, {id: "1-1", value: "Laptop"}]}
              ],
 menu: { /*same as menu property*/ }
}
```





## Video Annotation Tool

Coming soon in Dec 2018


