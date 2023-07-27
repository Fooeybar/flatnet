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

const {writeFileSync,readFileSync,existsSync}=require('fs');
const Path=require('path').join;
const Ext=require('../ext/ext');
const Actions=require('../actions/actions');
//——————————————————————————————————————————————————————————————————

const Model={
    New:(ptr_count=2,map=[])=>Model.Reset({
        map:[...map]
        ,o:[]
        ,out:[]
        ,fit:0
    },ptr_count)
    ,Reset:(model={},ptr_count=2)=>{
        model.fit=0;
        for(let o=0;o<ptr_count;o++){
            model.o[o]=o;
            model.out[o]=0;
        }
        return model;
    }
    ,LoadMap:(name='model')=>{
        if(!existsSync(`./${name}.fnet`)){
            console.log('Flatnet: map file not found: ./'+name+'.fnet');
            return [];
        }
        return readFileSync(`./${name}.fnet`,{encoding:'utf-8'})
            .split(',')
            .map(ele=>parseInt(ele));
    }
    ,SaveMap:(model,name='model')=>{
        if(model.map.length<1)return false;
        writeFileSync(
            Path('./',`/${name}.fnet`)
            ,model.map.join(',')
            ,{encoding:'utf-8'}
        );
        return true;
    }
    ,Mutate:(model={},count=3,ratio=0.45,actions=[])=>{
        while(count-->0){
            let index=Ext.Random.Integer(model.map.length-1);
            if(Ext.Random.Float(1,0)<=ratio)model.map.splice(index,0,Ext.Random.Integer(actions.length-1));
            else model.map.splice(index,1);
        }
        return model;
    }
    ,Eval:(model={},input=0,actions=[])=>{
        for(let m=0;m>=0&&m<model.map.length;m++){
            if(actions[model.map[m]][1](model,input)<0)m++;
        }
        return model;
    }
    ,_CLI:(args=process.argv.slice(2))=>{
        if(args.length===0)return console.log('   Error: missing map : [map] [inputs]');

        const ptr_count=Ext.PTRCount(args);
        const actions=Actions.New(ptr_count);
        
        const int=parseInt(args[0]);
        const map=Ext.ParseInt(int===int?args[0].split(','):Model.LoadMap(args[0]));

        for(let m=0;m<map.length;m++){
            let val=map[m];
            if(val<0||val>=actions.length)console.log('   ['+map.splice(m,1)[0]+'] Warning: map value out of range');
        }
        if(map.length===0)return console.log('   Error: map has no length');
        const model=Model.New(ptr_count,map);
    
        if(args.length===1)console.log('   Error: missing inputs : [map] [inputs]');
        if(args.length===2){
            const inputs=Ext.Flatten(args[1].split(','));
            for(let i=0;i<inputs.length;i++)Model.Eval(model,inputs[i],actions);
            console.log('   model.out:',model.out);
        }

        return model;
    }
};
//——————————————————————————————————————————————————————————————————

module.exports=Model;
if(!module.parent)return Model._CLI();