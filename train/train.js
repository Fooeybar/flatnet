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
const Network=require('../network/network');
//——————————————————————————————————————————————————————————————————

const CONFIG={
    name:'model'
    ,keep_ratio:0.25
    ,mut_count:3
    ,mut_ratio:0.4
    ,logging:false
    ,Fitness:Network._STDFITNESS
    ,Save:func=(net)=>{
        if(func.last>=net.scores.high)return;
        func.last=net.scores.high;
        return net.scores.h;
    }
    ,End:(net)=>false
};

const Train=(net={},data=[],targets=[],config=CONFIG)=>{
        if(config!==CONFIG)config={...CONFIG,...config};
        const train_start=Ext.Timer();

        while(true){
            if(config.logging)console.log('Cycle '+net.scores.cycles+'\n');

            for(let d=0;d<data.length;d++){
                Network.Eval(net,data[d]);
                Network.Fitness(net,targets[d],config.Fitness,data[d]);
                if(config.logging)console.log('\u001b[1A\u001b[2K   Eval + Fitness: '+(~~(((d/data.length)*10000)*0.01)+'%'));
            }

            if(config.logging){
                console.log('\u001b[1A\u001b[2K'+`   high[${net.scores.h}].len ${net.models[net.scores.h].map.length}`);
                console.log(`   high[${net.scores.h}].fit `+net.scores.high);
                console.log(`   avg[${net.models.length}].fit `+net.scores.avg);
                console.log(`   low[${net.scores.l}].fit `+net.scores.low);
            }

            let save=parseInt(config.Save(net));
            if(save===save&&net.models[save]){
                Model.SaveMap(net.models[save],config.name);
                if(config.logging)console.log(`   --Saved [${save}]`);
            }

            if(config.End(net))break;
            Network.Cycle(net,config.keep_ratio,config.mut_count,config.mut_ratio);
        }

        const train_end=~~(((Ext.Timer()-train_start)*0.1)/60)*0.01;
        if(config.logging)console.log(`Train time ${train_end}m`);

        return net;

};
//——————————————————————————————————————————————————————————————————

module.exports=Train;