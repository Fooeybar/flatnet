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

const Ext={
    Timer:((Func)=>()=>~~Func())(require('perf_hooks').performance.now)
    ,Random:{
        Float:(max=1,min=0)=>(Math.random()*(max-min)+min)
        ,Integer:(max=1,min=0)=>(Math.floor(Ext.Random.Float(max+1,min)))
    }
    ,Flatten:(any_var,out=[])=>{
        let type=typeof(any_var);
        
        if(type==='undefined')out.push(0);
        else if(type==='number')out.push(any_var);
        else if(type==='boolean')out.push(any_var?1:0);
        
        else if(type==='string'){
            let num=parseFloat(any_var);
            if(num===num)out.push(num);
            else for(let a=0;a<any_var.length;a++)out.push(any_var.charCodeAt(a));
        }
        
        else if(Array.isArray(any_var))for(let a=0;a<any_var.length;a++)Ext.Flatten(any_var[a],out);
        
        else if(type==='object')for(let keys=Object.keys(any_var),k=0;k<keys.length;k++){
            for(let n=0;n<keys[k].length;n++)out.push(keys[k].charCodeAt(n));
            Ext.Flatten(any_var[keys[k]],out);
        }
        return out;
    }
    ,Sort:{
        Sort:(arr=[],prop='')=>{
            let stack=[];
            stack.push({x:0,y:arr.length-1});
            while(stack.length){
                const {x,y}=stack.shift();
                let pivot=arr[y][prop];
                let i=x;
                for(let j=x;j<y;j++)if(arr[j][prop]<=pivot)Ext.Sort._Swap(arr,i++,j);
                Ext.Sort._Swap(arr,i,y);
                if(i-1>x)stack.push({x:x,y:i-1});
                if(i+1<y)stack.push({x:i+1,y:y});
            }
            return arr;
        }
        ,_Swap:(arr=[],a=0,b=1)=>{
            let t=arr[a];
            arr[a]=arr[b];
            arr[b]=t;
        }
        ,Reverse:(arr=[])=>{
            let i=0;
            let e=arr.length;
            let mid=~~(e*0.5);
            let temp;
            for(;i<mid;i++){
                temp=arr[i];
                arr[i]=arr[e-1-i];
                arr[e-1-i]=temp;
            }
            return arr;
        }
    }
    ,ParseInt:(arr=[])=>{
        let retain=[];
        for(let i=0;i<arr.length;i++){
            let int=parseInt(arr[i]);
            if(int===int)retain.push(int);
        }
        return retain;
    }
    ,PTRCount:(args=[])=>{
        let ptr_count=2;
        for(let a=args.length-1;a>-1;a--){
            let ptr_flag=args[a].indexOf('ptr_count=');
            if(ptr_flag>-1){
                let int=parseInt(args[a].substring(ptr_flag+10));
                if(int==int)ptr_count=int;
                args.splice(a,1);
            }
        }
        return ptr_count;
    }
};

module.exports=Ext;