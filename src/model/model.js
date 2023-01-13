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

module.exports=(ptr_count=2)=>{
    if(~~ptr_count<=0)ptr_count=2;

    const Model=(map=[],lib=[])=>{
        let model={
            l:lib.length
            ,map:[...lib,...map]
        };
        return Model.Reset(model);
    };

    Model.Reset=(model=New())=>{
        model.fit=0;
        model.i=0;
        model.m=0;
        model.fun=[];
        model.reg=[0];
        for(let p=0;p<ptr_count;p++)model['ptr'+p]=0;
        return model;
    };
    
    Model.Actions=require('../actions/actions')(ptr_count);
    
    Model.Mutate=(model=New(),count=3,ratio=0.45)=>{
        while(count-->0){
            let index=Random.Index(model.map,model.l);
            if(Random.Float(1,0)<=ratio)model.map.splice(index,0,Random.Index(Model.Actions));
            else model.map.splice(index,1);
        }
        return model;
    };
    
    Model.Eval=(model=New(),inputs=[])=>{
        model.m=0;
        while(model.m>=0&&model.m<model.map.length){
            Model.Actions[model.map[model.m]][1](model,inputs);
            model.m++;
        }
        return model;
    };

    Model.LoadMap=(name='model')=>{
        if(!existsSync(`./${name}.fnet`))return;
        return readFileSync(`./${name}.fnet`,{encoding:'utf-8'})
            .split(',')
            .map(ele=>parseInt(ele));
    };

    Model.SaveMap=(model,name='model')=>{
        if(model.map.length-model.l<1)return false;
        writeFileSync(`./${name}.fnet`,model.map.slice(model.l).join(','),{encoding:'utf-8'});
        return true;
    };
    
    return Model;
};

if(module.parent)return;
require('./cli')(module.exports);
