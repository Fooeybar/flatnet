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

const {Flatten,Sort}=require('../ext');
const Model=require('../model/model');
 
const STD={
    size:1000
    ,mut_count:3
    ,mut_ratio:0.4
    ,keep_ratio:0.25
    ,Fitness:(model,target,inputs)=>{
        if(model.reg[model.r0]===target)model.fit++;
    }
    ,map:[]
};

const TRAIN={
    logging:false
    ,name:'model'
    ,Save:func=(net)=>{
        if(func.last>=net.high)return;
        func.last=net.high;
        return net.h;
    }
    ,End:(net)=>(net.cycles>=10000)?true:false
};

const Network=(config=STD)=>{
    let net=[];
    
    for(let i in STD)net[i]=(config[i]!==undefined)?config[i]:STD[i];
    
    net.push(Model.New(net.map));
    while(net.length<net.size)net.push(
        Model.Mutate(Model.New(net.map),net.mut_count,net.mut_ratio)
    );

    net.cycles=0;
    net.high=0;
    net.h=0;
    net.avg=0;
    net.low=9007199254740990;
    net.l=0;
    
    net.Iterate=(inputs=[],target)=>{
        for(let n=0;n<net.length;n++){
            Model.Eval(net[n],inputs);
            net.Fitness(net[n],target,inputs);
            
            //do scoring
            if(net[n].fit>net.high){
                net.high=net[n].fit;
                net.h=n;
            }
            else if(net[n].fit<net.low){
                net.low=net[n].fit;
                net.l=n;
            }
            net.avg=~~(((net.avg+net[n].fit)*0.5)*10000)*0.0001;
        }
        return net;
    };
    
    net.Cycle=()=>{
        if(net.keep_ratio>1)net.keep_ratio=1;
        if(net.keep_ratio<0)net.keep_ratio=0;
        
        let net_size=net.length;
        let keep_size=~~(net.keep_ratio*net_size);
        if(keep_size<1)keep_size=1;
        
        Sort.Reverse(Sort.Property(net,'fit'));
        net.splice(keep_size);
        for(let n=0;n<net.length;n++)Model.Reset(net[n]);
        
        let end=net_size-keep_size;
        for(let i=0;end-->0;){
            net.push(
                Model.Mutate(Model.New(net[i].map),net.mut_count,net.mut_ratio)
            );
            if(++i>=keep_size)i=0;
        }

        net.cycles++;
        
        net.high=-1;
        net.h=-1;
        net.avg=0;
        net.low=9007199254740990;
        net.l=-1;
        
        return net;
    };
    
    net.Train=(inputs=[],targets=[],opts=TRAIN)=>{
        for(let i=0;i<inputs.length;i++)inputs[i]=Flatten(inputs[i]);
        opts={...TRAIN,...opts};
        net.cycles=0;
        
        const Time=((Func)=>()=>~~Func())(require('perf_hooks').performance.now);
        const train_start=Time();

        while(true){
            if(opts.logging)console.log('Cycle '+net.cycles+'\n');
            
            for(let i=0;i<inputs.length;i++){
                net.Iterate(inputs[i],targets[i]);
                if(opts.logging)console.log('\u001b[1A\u001b[2K   Iterate: '+(~~(((i/inputs.length)*10000)*0.01)+'%'));
            }
            
            if(opts.logging){
                console.log('\u001b[1A\u001b[2K'+`   map[${net.h}].len ${net[net.h].map.length}`);
                console.log(`   high[${net.h}] `+net.high);
                console.log(`   avg[${net.length}] `+net.avg);
                console.log(`   low[${net.l}] `+net.low);
            }
            
            let save=parseInt(opts.Save(net));
            if(save===save&&net[save]){
                Model.SaveMap(net[save].map,opts.name);
                if(opts.logging)console.log(`   --Saved [${save}].map`);
            }
            
            if(opts.End(net))break;
            net.Cycle();
        }
        
        const train_end=~~(((Time()-train_start)*0.1)/60)*0.01;
        if(opts.logging)console.log(`Train time ${train_end}m`);
        
        return net;
    };
    
    return net;
};

module.exports=Network;

if(module.parent)return;

