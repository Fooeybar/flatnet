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
const {Random,Array:{ParseInt}}=require('../ext');
const actions=require('../actions/actions');

const New=(map=[])=>{
    return{
        map:[...map]
        ,i:0
        ,inputs:[]
        ,out:0
        ,var:0
        ,fit:0
    };
};

const Reset=(model=New())=>{
    model.i=0;
    model.inputs=[];
    model.out=0;
    model.var=0;
    model.fit=0;
    return model;
};

const LoadMap=(name='model')=>{
    let map=[];
    if(existsSync(`./${name}.fnet`)){
        map=readFileSync(`./${name}.fnet`,{encoding:'utf-8'}).split(',').map(ele=>parseInt(ele));
    }
    return map;
};

const Eval=(model=New(),inputs=[],m=0)=>{
    model.inputs=inputs;
    const args={m:m,loops:[]};
    
    const COUNT=model.map.length;
    let count=COUNT;
    while(count-->0){
        if(args.m<0||args.m>=COUNT)break;
        
        let ret=actions[model.map[args.m]](model,args);
        if(ret===undefined)args.m++;
        else{
            let int=parseInt(ret);
            args.m=(int===int)?int:args.m+1;
        }
    }
    return model;
};

const Mutate=(model=New(),count=3,ratio=0.45)=>{
    while(count-->0){
        let index=Random.Index(model.map);
        if(Random.Float(1,0)<=ratio)model.map.splice(index,0,Random.Index(actions));
        else model.map.splice(index,1);
    }
    return model;
};

const SaveMap=(map=[],name='model')=>{
    name=''+name;
    if(map.length>0&&name.length>0){
        writeFileSync(`./${name}.fnet`,map.join(','),{encoding:'utf-8'});
    }
    return map;
};

module.exports={
    New
    ,Reset
    ,LoadMap
    ,Eval
    ,Mutate
    ,SaveMap
};

if(module.parent)return;
if(process.argv.length<3)return console.log('Model.Eval(): [map] [inputs]');
if(process.argv.length>4)return console.log(`Error: too many arguments : [${process.argv[2]}] [${process.argv[3]}] [${process.argv.slice(4)}]`);

const args=process.argv.slice(2);

let premap=args[0].indexOf(',');
if(premap<0){
    let int=parseInt(args[0]);
    if(int===int)premap=int;
}

let map=ParseInt((premap>-1)?args[0].split(','):LoadMap(args[0]));

let inputs=(args.length===2)?ParseInt(args[1].split(',')):[];

console.log(`Model.Eval():`,Eval(New(map),inputs).out);
