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

const {writeFileSync,readFileSync,existsSync}=require('fs'); 
const {Random}=require('../ext');
const Actions=require('../actions/actions');

const New=(map=[])=>{
    return {
        map:[...map]
        ,fit:0
        ,i:0
        ,m:0
        ,r0:0
        ,reg:[0]
        ,r1:0
        ,r2:0
        ,r3:0
    };
};

const Reset=(model=New())=>{
    model.fit=0;
    model.i=0;
    model.m=0;
    model.r=0;
    model.reg=[0];
    model.r1=0;
    model.r2=0;
    model.r3=0;
    return model;
};

const Eval=(model=New(),inputs=[])=>{
    model.m=0;
    while(model.m>=0&&model.m<model.map.length){
        Actions[model.map[model.m]][1](model,inputs);
        model.m++;
    }
    return model;
};

const LoadMap=(name='model')=>{
    if(!existsSync(`./${name}.fnet`))return;
    return readFileSync(`./${name}.fnet`,{encoding:'utf-8'})
        .split(',')
        .map(ele=>parseInt(ele));
};

const Mutate=(model=New(),count=3,ratio=0.45)=>{
    while(count-->0){
        let index=Random.Index(model.map);
        if(Random.Float(1,0)<=ratio)model.map.splice(index,0,Random.Index(Actions));
        else model.map.splice(index,1);
    }
    return model;
};

const SaveMap=(map=[],name='model')=>{
    if(map.length<1)return false;
    writeFileSync(`./${name}.fnet`,map.join(','),{encoding:'utf-8'});
    return true;
};

module.exports={
    New
    ,Reset
    ,Eval
    ,Mutate
    ,LoadMap
    ,SaveMap
};

if(module.parent)return;

{
if(process.argv.length<3)return console.log('Model.Eval(): [map] [inputs]');
if(process.argv.length>4)return console.log(`Error: too many arguments : [${process.argv[2]}] [${process.argv[3]}] [${process.argv.slice(4)}]`);

const args=process.argv.slice(2);

let premap=args[0].indexOf(',');
if(premap<0){
    let int=parseInt(args[0]);
    if(int===int)premap=int;
}

const {Array:{ParseInt}}=require('../ext');

let map=ParseInt((premap>-1)?args[0].split(','):LoadMap(args[0]));

if(map.length<1)return console.log('Error: map has no length');

let inputs=(args.length===2)?ParseInt(args[1].split(',')):[];

console.log(`Model.Eval():`,Eval(New(map),inputs));
}
