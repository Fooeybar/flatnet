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

const {Network,Model,Ext:{Random}}=require('../flatnet')();

const NAME=process.argv[2]||process.argv[1].slice(process.argv[1].lastIndexOf('/')+1,process.argv[1].length-3);

let inputs=[];
let targets=[];

while(inputs.length<100){
    let a=Random.Integer(100,3);
    let b=Random.Integer(100,3);
    inputs.push([a,b]);
    targets.push(a*b);
}

const x=Random.Integer(99999,11111);
const y=Random.Integer(99999,11111);

Network({
    size:1000
    ,mut_count:3
    ,mut_ratio:0.25
    ,keep_ratio:0.25
    ,map:Model.LoadMap(NAME)
})
.Train(inputs,targets,{
    logging:true
    ,name:NAME
    ,End:(net)=>{
        if(net.high<inputs.length)return false;
        let model=Model.Eval(Model(net[net.h].map,net.lib),[x,y]);
        return (model.reg[model.ptr0]===(x*y))?true:false;
    }
});
