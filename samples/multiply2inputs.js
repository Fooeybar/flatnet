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

const RandomInteger=(max=1)=>(Math.floor(Math.random()*max));

const {Network,Model}=require('../flatnet')();

const NAME=process.argv[2]||process.argv[1].slice(process.argv[1].lastIndexOf('/')+1,process.argv[1].length-3);

let inputs=[];
let targets=[];

while(inputs.length<100){
    let a=RandomInteger(100,3);
    let b=RandomInteger(100,3);
    inputs.push([a,b]);
    targets.push(a*b);
}

Network({
    size:10000
    ,mut_count:3
    ,mut_ratio:0.2
    ,keep_ratio:0.1
    ,map:Model.LoadMap(NAME)
})
.Train(inputs,targets,{
    logging:true
    ,name:NAME
    ,End:(net)=>{
        if(net.high<inputs.length)return false;
        const x=RandomInteger(99999,11111);
        const y=RandomInteger(99999,11111);
        let model=Model.Eval(Model(net[net.h].map,net.lib),[x,y]);
        return (model.out[0]===(x*y))?true:false;
    }
});
