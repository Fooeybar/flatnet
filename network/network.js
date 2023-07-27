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

const Ext=require('../ext/ext');
const Model=require('../model/model');
const Actions=require('../actions/actions');
//——————————————————————————————————————————————————————————————————

const Network={
    New:(ptr_count=2,size=1000,map=[]||'map')=>{
        let net={
            scores:{
                high:0
                ,h:0
                ,avg:0
                ,low:9007199254740990
                ,l:0
                ,cycles:0
            }
            ,PTRCNT:()=>ptr_count
            ,actions:Actions.New(ptr_count)
            ,models:[]
        };
        if(typeof(map)==='string')map=Model.LoadMap(map);
        while(net.models.length<size)net.models.push(Model.New(ptr_count,map));
        return net;
    }
    ,Mutate:(net={},mut_count=3,mut_ratio=0.4)=>{
        for(let m=0;m<net.models.length;m++)Model.Mutate(net.models[m],mut_count,mut_ratio,net.actions);
        return net;
    }
    ,Eval:(net={},inputs=[])=>{
        inputs=Ext.Flatten(inputs);
        for(let i=0;i<inputs.length;i++){
            for(let m=0;m<net.models.length;m++)Model.Eval(net.models[m],inputs[i],net.actions);
        }
        return net;
    }
    ,Fitness:(net={},target=0,Func=Network._STDFITNESS,input=0)=>{
        for(let m=0;m<net.models.length;m++){
            Func(net.models[m],target,input);
            //do scoring
            if(net.models[m].fit>net.scores.high){
                net.scores.high=net.models[m].fit;
                net.scores.h=m;
            }
            else if(net.models[m].fit<net.scores.low){
                net.scores.low=net.models[m].fit;
                net.scores.l=m;
            }
            net.scores.avg=~~(((net.scores.avg+net.models[m].fit)*0.5)*10000)*0.0001;
        }
        return net;
    }
    ,Cycle:(net={},keep_ratio=0.25,mut_count=3,mut_ratio=0.4)=>{
        net.scores.cycles++;

        let net_size=net.models.length;
        let keep_size=~~(keep_ratio*net_size);
        if(keep_size<1)keep_size=1;

        Ext.Sort.Sort(net.models,'fit');
        Ext.Sort.Reverse(net.models);
        net.models.splice(keep_size);
        for(let m=0;m<net.models.length;m++)Model.Reset(net.models[m],net.PTRCNT());

        let end=net_size-keep_size;
        for(let i=0;end-->0;){
            net.models.push(
                Model.Mutate(
                    Model.New(net.PTRCNT(),net.models[0].map)
                    ,mut_count,mut_ratio,net.actions
                )
            );
            if(++i>=keep_size)i=0;
        }

        net.scores.high=0;
        net.scores.h=-1;
        net.scores.avg=0;
        net.scores.low=9007199254740990;
        net.scores.l=-1;

        return net;
    }
    ,_STDFITNESS:(model={},target=0,input=0)=>{
        let err=Math.abs(target-model.out[0]);
        if(err===0)model.fit+=10;
        else if(err<=target*0.01)model.fit+=9;
        else if(err<=target*0.02)model.fit+=8;
        else if(err<=target*0.03)model.fit+=7;
        else if(err<=target*0.04)model.fit+=6;
        else if(err<=target*0.05)model.fit+=5;
        else if(err<=target*0.06)model.fit+=4;
        else if(err<=target*0.07)model.fit+=3;
        else if(err<=target*0.08)model.fit+=2;
        else if(err<=target*0.09)model.fit+=1;
        return model;
    }
};
//——————————————————————————————————————————————————————————————————

module.exports=Network;