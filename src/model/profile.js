/*
Copyright [2022] [Robert Medeiros]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const {Random:{Integer},Timer}=require('../ext');
const {New,Reset}=require('./model');

console.log();


const MAPLEN=1000;
const MAP=[];
for(let m=0;m<10000;m++){
    MAP.push(Integer(144,0));
    console.log('\u001b[1A\u001b[2KFilling MAP array:',m+1,'/',MAPLEN);
}
console.log();


const LEN=10000;
const arr1=[];
const arr2=[];
for(let a=0;a<LEN;a++){
    arr1.push(New(MAP));
    arr2.push(New(MAP));
    console.log('\u001b[1A\u001b[2KFilling test arrays:',a+1,'/',LEN);
}
console.log('—————————————————————————————————————\n\n');


let avg1=0;
let avg2=0;
let cycle=0;
let END=parseInt(process.argv[2]);
if(END!==END)END=100;


console.log(
    '\u001b[2A\u001b[2KCycle:',cycle+1,'/',END
    ,'\nReset:',avg1,'ms | New:',avg2,'ms'
);

while(cycle<END){

    const time1S=Timer();
    for(let a=0;a<LEN;a++)Reset(arr1[a]);
    avg1=~~((avg1+(Timer()-time1S))*0.5);
        
    const time2S=Timer();
    for(let a=0;a<LEN;a++)arr2[a]=New(arr2[a].map);
    avg2=~~((avg2+(Timer()-time2S))*0.5);

    console.log(
        '\u001b[1A\u001b[2K\u001b[1A\u001b[2KCycle:',cycle+1,'/',END
        ,'\nReset:',avg1,'ms | New:',avg2,'ms'
    );
    
    cycle++;
}
