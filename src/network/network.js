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

const TRAIN={
    keep_ratio:0.25
    ,mut_count:3
    ,mut_ratio:0.4
    ,Fitness:(model,target,inputs)=>{if(model.out===target)model.fit++;}
    ,Save:func=(net)=>{
        if(func.last>=net.high)return;
        func.last=net.high;
        return net.h;
    }
    ,End:(net)=>(net.cycles>=10000)?true:false
    ,log:false
    ,name:'model'
};

const ResetScores=(net=New())=>{
    net.high=-1;
    net.h=-1;
    net.avg=0;
    net.low=9007199254740990;
    net.l=-1;
    return net;
};

const New=(size=1000,mut_count=TRAIN.mut_count,mut_ratio=TRAIN.mut_ratio,map=[])=>{
    let net=[Model.New(map)];
    while(size-->1)net.push(Model.Mutate(Model.New(map),mut_count,mut_ratio));
    
    net.cycles=0;
    return ResetScores(net);;
};

const Iterate=(net=New(),inputs=[],target,Fitness=FITNESS)=>{
    for(let n=0;n<net.length;n++){

        Model.Eval(net[n],inputs);
        
        Fitness(net[n],target,inputs);
        
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

const Cycle=(net=New(),keep_ratio=TRAIN.keep_ratio,mut_count=TRAIN.mut_count,mut_ratio=TRAIN.mut_ratio)=>{
    if(keep_ratio>1)keep_ratio=1;
    if(keep_ratio<0)keep_ratio=0;
    
    let net_size=net.length;
    let keep_size=~~(keep_ratio*net_size);
    if(keep_size<1)keep_size=1;
    
    Sort.Reverse(Sort.Property(net,'fit'));
    net.splice(keep_size);
    for(let n=0;n<net.length;n++)Model.Reset(net[n]);
    
    let end=net_size-keep_size;
    for(let i=0;end-->0;){
        net.push(Model.Mutate(Model.New(net[i].map),mut_count,mut_ratio));
        if(++i>=keep_size)i=0;
    }
    
    net.cycles++;
    
    return ResetScores(net);
};

const Train=(net=New(),inputs=[],targets=[],opts=TRAIN)=>{
    net.cycles=0;
    for(let i=0;i<inputs.length;i++)inputs[i]=Flatten(inputs[i]);
    opts={...TRAIN,...opts};
    
    const Time=(Func=>()=>~~Func())(require('perf_hooks').performance.now);
    const train_start=Time();
    
    while(true){
        if(opts.log)console.log('Cycle '+net.cycles+'\n');
        
        for(let i=0;i<inputs.length;i++){
            Iterate(net,inputs[i],targets[i],opts.Fitness);
            if(opts.log)console.log('\u001b[1A\u001b[2K   Iterate: '+(~~(((i/inputs.length)*10000)*0.01)+'%'));
        }
        
        if(opts.log){
            console.log('\u001b[1A\u001b[2K'+`   map[${net.h}].len ${net[net.h].map.length}`);
            console.log(`   high[${net.h}] `+net.high);
            console.log(`   avg[${net.length}] `+net.avg);
            console.log(`   low[${net.l}] `+net.low);
        }
        
        let save=parseInt(opts.Save(net));
        if(save===save&&net[save]){
            Model.SaveMap(net[save].map,opts.name);
            if(opts.log)console.log(`   --Saved [${save}].map`);
        }
        
        if(opts.End(net))break;
        
        Cycle(net,opts.keep_ratio,opts.mut_count,opts.mut_ratio);
    }
    
    const train_end=~~(((Time()-train_start)*0.1)/60)*0.01;
    
    if(opts.log)console.log(`Train time ${train_end}m`);
    
    return net;
};

module.exports={
    New
    ,Iterate
    ,Cycle
    ,Train
};
