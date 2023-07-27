/*
——————————————————————————————————————————————————————————————————
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
——————————————————————————————————————————————————————————————————
SDG.JN
*/

const NAME=process.argv[1].slice(
    process.argv[1].lastIndexOf(require('path').sep)+1
    ,process.argv[1].length-3
);

const {Ext,Model,Network,Train}=require('../flatnet');

let data=[];
let targets=[];

while(data.length<1000){
    let a=Ext.Random.Integer(100,3);
    let b=Ext.Random.Integer(100,3);
    data.push([a,b]);
    targets.push(a+b);
}

Train(
    Network.New(2,10000,NAME)
    ,data
    ,targets
    ,{
        name:NAME
        ,keep_ratio:0.15
        ,mut_ratio:0.25
        ,logging:true
        ,End:(net)=>{
            if(net.scores.cycles>=10000)return true;
            let a=Ext.Random.Integer(99999,11111);
            let b=Ext.Random.Integer(99999,11111);
            let model=Model.New(net.PTRCNT(),net.models[net.scores.h].map);
            Model.Eval(model,a,net.actions);
            Model.Eval(model,b,net.actions);
            return (model.out[0]===a+b);
        }
    }
);