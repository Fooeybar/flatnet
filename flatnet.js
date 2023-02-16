/*
Copyright [2023] [Robert Medeiros]

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
const Path=require('path').join;

const Flatten=(any,out=[])=>{
    let type=typeof(any);
    
    if(type==='number')out.push(any);
    else if(type==='boolean')out.push(any?1:0);
    
    else if(type==='string'){
        let num=parseFloat(any);
        if(num===num)out.push(num);
        else for(let a=0;a<any.length;a++)out.push(any.charCodeAt(a));
    }
    
    else if(Array.isArray(any))for(let a=0;a<any.length;a++)Flatten(any[a],out);
    
    else if(type==='object')for(let keys=Object.keys(any),k=0;k<keys.length;k++){
        for(let n=0;n<keys[k].length;n++)out.push(keys[k].charCodeAt(n));
        Flatten(any[keys[k]],out);
    }
    return out;
};

const Flatnet=(ptr_count=2)=>{
    if(ptr_count<1)ptr_count=2;

    const RandomFloat=(max=1,min=0)=>(Math.random()*(max-min)+min);
    const RandomInteger=(max=1,min=0)=>(Math.floor(RandomFloat(max+1,min)));
    const RandomIndex=(arr=[])=>(RandomInteger(arr.length-1));
    const Timer=((Func)=>()=>~~Func())(require('perf_hooks').performance.now);
    const Reverse=(arr=[])=>{
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
    };
    const _Swap=(arr=[],a=0,b=1)=>{
        let t=arr[a];
        arr[a]=arr[b];
        arr[b]=t;
    };
    const Sort=(arr=[],prop='')=>{
      let stack=[];
      stack.push({x:0,y:arr.length-1});
      while(stack.length){
        const {x,y}=stack.shift();
        let pivot=arr[y][prop];
        let i=x;
        for(let j=x;j<y;j++)if(arr[j][prop]<=pivot)_Swap(arr,i++,j);
        _Swap(arr,i,y);
        if(i-1>x)stack.push({x:x,y:i-1});
        if(i+1<y)stack.push({x:i+1,y:y});
      }
      return arr;
    };

    //——————————————————————————————————————————————————————————————————
    const Actions=[];

    const ptr_actions=[
        //flow
        (o)=>[
            'flow:o'+o
            ,(model)=>~~model.out[model.o[o]]
        ]

        //out index
        ,(o)=>[
            'o_increment:o'+o
            ,(model)=>{if(model.o[o]+1<model.out.length)model.o[o]++;}
        ]
        ,(o)=>[
            'o_decrement:o'+o
            ,(model)=>{if(model.o[o]>=1)model.o[o]--;}
        ]
        ,(o)=>[
            'o_to_0:o'+o
            ,(model)=>{model.o[o]=0;}
        ]
        ,(o)=>[
            'o_to_end:o'+o
            ,(model)=>{model.o[o]=model.out.length-1;}
        ]
        ,(o)=>[
            'o_to_val:o'+o
            ,(model)=>{
                const val=~~model.out[model.o[o]];
                if(val>=0&&val<model.out.length)model.o[o]=val;
            }
        ]

        //out array
        ,(o)=>[
            'out_new:o'+o
            ,(model)=>{model.o[o]=model.out.push(0)-1;}
        ]
        ,(o)=>[
            'out_del:o'+o
            ,(model)=>{
                const val=~~model.out[model.o[o]];
                if(val>=0&&val<model.out.length){
                    model.out.splice(val,1);
                    for(let p=0;p<ptr_count;p++)
                        if(model.o[p]>=model.out.length){
                            model.o[p]=model.out.length-1;
                            if(model.o[p]<0)model.o[p]=0;
                        }
                }
            }
        ]

        //equals
        ,(o)=>[
            'equals_0:o'+o
            ,(model)=>{model.out[model.o[o]]=0;}
        ]
        ,(o)=>[
            'equals_input:o'+o
            ,(model,input)=>{model.out[model.o[o]]=input;}
        ]
        ,(o)=>[
            'equals_fit:o'+o
            ,(model)=>{model.out[model.o[o]]=model.fit;}
        ]

        //add
        ,(o)=>[
            'add_input:o'+o
            ,(model,input)=>{model.out[model.o[o]]+=input;}
        ]
        ,(o)=>[
            'add_1:o'+o
            ,(model)=>{model.out[model.o[o]]+=1;}
        ]
        ,(o)=>[
            'add_10:o'+o
            ,(model)=>{model.out[model.o[o]]+=10;}
        ]
        ,(o)=>[
            'add_rand_flt:o'+o
            ,(model)=>{model.out[model.o[o]]+=RandomFloat(100);}
        ]
        ,(o)=>[
            'add_rand_int:o'+o
            ,(model)=>{model.out[model.o[o]]+=RandomInteger(100);}
        ]

        //subtract
        ,(o)=>[
            'subtract_input:o'+o
            ,(model,input)=>{model.out[model.o[o]]-=input;}
        ]
        ,(o)=>[
            'subtract_1:o'+o
            ,(model)=>{model.out[model.o[o]]-=1;}
        ]
        ,(o)=>[
            'subtract_10:o'+o
            ,(model)=>{model.out[model.o[o]]-=10;}
        ]

        //multiply
        ,(o)=>[
            'multiply_input:o'+o
            ,(model,input)=>{model.out[model.o[o]]*=input;}
        ]
        ,(o)=>[
            'multiply_2:o'+o
            ,(model)=>{model.out[model.o[o]]*=2;}
        ]
        ,(o)=>[
            'multiply_10:o'+o
            ,(model)=>{model.out[model.o[o]]*=10;}
        ]
        ,(o)=>[
            'multiply_0.1:o'+o
            ,(model)=>{model.out[model.o[o]]*=0.1;}
        ]
        ,(o)=>[
            'multiply_-1:o'+o
            ,(model)=>{model.out[model.o[o]]*=-1;}
        ]
        ,(o)=>[
            'multiply_PI:o'+o
            ,(model)=>{model.out[model.o[o]]*=Math.PI;}
        ]

        //divide
        ,(o)=>[
            'divide_input:o'+o
            ,(model,input)=>{
                if(input===0)model.out[model.o[o]]=0;
                else model.out[model.o[o]]/=input;
            }
        ]
        ,(o)=>[
            'divide_2:o'+o
            ,(model)=>{model.out[model.o[o]]/=2;}
        ]
        ,(o)=>[
            'divide_-1:o'+o
            ,(model)=>{model.out[model.o[o]]/=-1;}
        ]
        ,(o)=>[
            'divide_PI:o'+o
            ,(model)=>{model.out[model.o[o]]/=Math.PI;}
        ]
        ,(o)=>[
            'divide_1/out:o'+o
            ,(model)=>{
                if(model.out[model.o[o]]!==0)model.out[model.o[o]]=1/model.out[model.o[o]];
            }
        ]

        //exponent
        ,(o)=>[
            'exponent_input:o'+o
            ,(model,input)=>{model.out[model.o[o]]**=input;}
        ]
        ,(o)=>[
            'exponent_2:o'+o
            ,(model)=>{model.out[model.o[o]]**=2;}
        ]
        ,(o)=>[
            'exponent_0.5:o'+o
            ,(model)=>{model.out[model.o[o]]**=0.5;}
        ]
        ,(o)=>[
            'exponent_-1:o'+o
            ,(model)=>{model.out[model.o[o]]**=-1;}
        ]
        ,(o)=>[
            'exponent_-2:o'+o
            ,(model)=>{model.out[model.o[o]]**=-2;}
        ]

        //ext maths
        ,(o)=>[
            'zero_round:o'+o
            ,(model)=>{
                model.out[model.o[o]]=(model.out[model.o[o]]>=0)?
                    Math.floor(model.out[model.o[o]])
                    :Math.ceil(model.out[model.o[o]]);
            }
        ]
        ,(o)=>[
            'tanh:o'+o
            ,(model)=>{model.out[model.o[o]]=Math.tanh(model.out[model.o[o]]);}
        ]
        ,(o)=>[
            'sinh:o'+o
            ,(model)=>{model.out[model.o[o]]=Math.sinh(model.out[model.o[o]]);}
        ]
        ,(o)=>[
            'cosh:o'+o
            ,(model)=>{model.out[model.o[o]]=Math.cosh(model.out[model.o[o]]);}
        ]
        ,(o)=>[
            'sigmoid:o'+o
            ,(model)=>{
                let denom=1+Math.E**(-model.out[model.o[o]]);
                if(denom===0)model.out[model.o[o]]=0;
                else model.out[model.o[o]]=1/denom;
            }
        ]
        ,(o)=>[
            'truncate:o'+o
            ,(model)=>{model.out[model.o[o]]=~~model.out[model.o[o]];}
        ]

        //logic
        ,(o)=>[
            'if_true:o'+o
            ,(model)=>{if(~~model.out[model.o[o]]!==1)return -1;}
        ]
        ,(o)=>[
            'if_false:o'+o
            ,(model)=>{if(~~model.out[model.o[o]]!==0)return -1;}
        ]

    ];

    const ptr_actions_dual=[
        //equals
        (o1,o2)=>[
            `equals_out:o${o1},o${o2}`
            ,(model)=>{model.out[model.o[o1]]=model.out[model.o[o2]];}
        ]
        ,(o1,o2)=>[
            `equals_o:o${o1},o${o2}`
            ,(model)=>{model.o[o1]=model.o[o2];}
        ]

        //add
        ,(o1,o2)=>[
            `add_out:o${o1},o${o2}`
            ,(model)=>{model.out[model.o[o1]]+=model.out[model.o[o2]];}
        ]

        //subtract
        ,(o1,o2)=>[
            `subtract_out:o${o1},o${o2}`
            ,(model)=>{model.out[model.o[o1]]-=model.out[model.o[o2]];}
        ]

        //multiply
        ,(o1,o2)=>[
            `multiply_out:o${o1},o${o2}`
            ,(model)=>{model.out[model.o[o1]]*=model.out[model.o[o2]];}
        ]

        //divide
        ,(o1,o2)=>[
            `divide_out:o${o1},o${o2}`
            ,(model)=>{
                if(model.out[model.o[o2]]===0)model.out[model.o[o1]]=0;
                else model.out[model.o[o1]]/=model.out[model.o[o2]];
            }
        ]
        
        //exponent
        ,(o1,o2)=>[
            `exponent_out:o${o1},o${o2}`
            ,(model)=>{model.out[model.o[o1]]**=model.out[model.o[o2]];}
        ]


    ];
    
    for(let a=0;a<ptr_actions.length;a++){
        for(let o=0;o<ptr_count;o++)
            Actions.push(ptr_actions[a](o));
    }

    for(let a=0;a<ptr_actions_dual.length;a++){
        for(let o1=0;o1<ptr_count;o1++)
            for(let o2=o1+1;o2<ptr_count;o2++){
                Actions.push(ptr_actions_dual[a](o1,o2));
                Actions.push(ptr_actions_dual[a](o2,o1));
            }
    }

    //——————————————————————————————————————————————————————————————————
    const Model=(map=[],lib=[])=>{
        let model={
            l:lib.length
            ,map:[...lib,...map]
            ,o:[]
            ,out:[]
            ,fit:0
        };
        return Model.Reset(model);
    };

    Model.Reset=(model={})=>{
        model.fit=0;
        for(let o=0;o<ptr_count;o++){
            model.o[o]=o;
            model.out[o]=0;
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
        writeFileSync(
            Path('./',`/${name}.fnet`)
            ,model.map.slice(model.l).join(',')
            ,{encoding:'utf-8'}
        );
        return true;
    };

    Model.Mutate=(model=Model(),count=3,ratio=0.45)=>{
        while(count-->0){
            let index=RandomIndex(model.map,model.l);
            if(RandomFloat(1,0)<=ratio)model.map.splice(index,0,RandomIndex(Actions));
            else model.map.splice(index,1);
        }
        return model;
    };

    Model.Eval=(model=Model(),inputs=[])=>{
        let i=0;
        let m=model.l;
        while(m>=0&&m<model.map.length){
            let flow=Actions[model.map[m++]][1](model,inputs[i]);
            if(m<0||m>=model.map.length)break;

            if(flow!==undefined){
                if(flow<0)m++;
                else if(flow<inputs.length)i=flow;
            }
        }
        return model;
    };

    //——————————————————————————————————————————————————————————————————
    const NETCONFIG={
        size:1000
        ,keep_ratio:0.25
        ,Fitness:(model,target,inputs)=>{if(model.out[0]===target)model.fit++;}
        ,map:[]
        ,lib:[]
        ,mut_count:3
        ,mut_ratio:0.4
    };
    const NETTRAIN={
        logging:true
        ,name:'model'
        ,single_fitness:false
        ,Save:func=(net)=>{
            if(func.last>=net.high)return;
            func.last=net.high;
            return net.h;
        }
        ,End:(net)=>(net.cycles>100000)?true:false
    };

    const Network=(config=NETCONFIG)=>{
        for(let i in NETCONFIG)if(config[i]===undefined)config[i]=NETCONFIG[i];
        if(config.keep_ratio>1)config.keep_ratio=1;
        if(config.keep_ratio<0)config.keep_ratio=0;
        if(config.mut_count<0)config.mut_count=3;
        if(config.mut_ratio<0)config.mut_ratio=0.45;

        let net=[];

        net.push(Model(config.map,config.lib));
        while(net.length<config.size)
            net.push(Model.Mutate(Model(config.map,config.lib),config.mut_count,config.mut_ratio));

        net.cycles=0;
        net.high=0;
        net.h=0;
        net.avg=0;
        net.low=9007199254740990;
        net.l=0;

        net.Eval=(inputs=[],target,do_fitness=true)=>{
            for(let n=0;n<net.length;n++){
                Model.Eval(net[n],inputs);
                if(do_fitness===true){
                    config.Fitness(net[n],target,inputs);
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
            }
            return net;
        };

        net.Cycle=()=>{
            let net_size=net.length;
            let keep_size=~~(config.keep_ratio*net_size);
            if(keep_size<1)keep_size=1;

            Reverse(Sort(net,'fit'));
            net.splice(keep_size);
            for(let n=0;n<net.length;n++)Model.Reset(net[n]);

            let end=net_size-keep_size;
            for(let i=0;end-->0;){
                net.push(Model.Mutate(Model(net[i].map,config.lib),config.mut_count,config.mut_ratio));
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

        net.Train=(data=[],targets=[],opts=NETTRAIN)=>{
            for(let i=0;i<data.length;i++)data[i]=Flatten(data[i]);
            opts={...NETTRAIN,...opts};
            net.cycles=0;

            const train_start=Timer();

            while(true){
                if(opts.logging)console.log('Cycle '+net.cycles+'\n');

                for(let i=0;i<data.length;i++){
                    net.Eval(data[i],targets[i]
                            ,(opts.single_fitness===true&&i+1<data.length)?false:true
                    );
                    if(opts.logging)console.log('\u001b[1A\u001b[2K   Eval: '+(~~(((i/data.length)*10000)*0.01)+'%'));
                }

                if(opts.logging){
                    console.log('\u001b[1A\u001b[2K'+`   map[${net.h}].len ${net[net.h].map.length}`);
                    console.log(`   high[${net.h}].fit `+net.high);
                    console.log(`   avg[${net.length}].fit `+net.avg);
                    console.log(`   low[${net.l}].fit `+net.low);
                }

                let save=parseInt(opts.Save(net));
                if(save===save&&net[save]){
                    Model.SaveMap(net[save],opts.name);
                    if(opts.logging)console.log(`   --Saved [${save}]`);
                }

                if(opts.End(net))break;
                net.Cycle();
            }

            const train_end=~~(((Timer()-train_start)*0.1)/60)*0.01;
            if(opts.logging)console.log(`Train time ${train_end}m`);

            return net;
        };

        return net;
    };

    //——————————————————————————————————————————————————————————————————
    return{
        Actions
        ,Model
        ,Network
    };
};

module.exports=Flatnet;

//——————————————————————————————————————————————————————————————————SDG.JN
if(module.parent)return;
if(process.argv.length<3)return console.log('Flatnet: cli root: [actions,eval]');

const ParseInt=(arr=[])=>{
    let retain=[];
    for(let i=0;i<arr.length;i++){
        let int=parseInt(arr[i]);
        if(int===int)retain.push(int);
    }
    return retain;
};

const args=process.argv.slice(2);

if(args[0]==='actions'){
    args.shift();
    const Actions=Flatnet().Actions;
    if(args.length===0)return console.log('actions.length:',Actions.length);
    const map=ParseInt(args.join(',').split(','));
    let a=0;
    while(a<map.length){
        if(map[a]<0||map[a]>=Actions.length)console.log('[',map[a],'] Error: value out of range');
        else console.log('[',map[a],'] '+Actions[map[a]][0]);
        a++;
    }
}

else if(args[0]==='eval'){
    args.shift();
    if(args.length>2)return console.log(`Error: too many arguments : [${args[0]}] [${args[1]}] [${args.slice(2)}]`);
    if(args.length<2)console.log('Warning: missing arguments : [map] [inputs]');

    const {actions,Model}=Flatnet();

    let is_map=args[0].indexOf(',');
    if(is_map<0){
        let int=parseInt(args[0]);
        if(int===int)is_map=int;
    }

    let map=ParseInt((is_map>-1)?args[0].split(','):Model.LoadMap(args[0]));
    for(let m=0;m<map.length;m++){
        let val=map[m];
        if(val<0||val>=Actions.length)console.log('[',map.splice(m,1)[0],'] Error: value out of range');
    }
    if(map.length<1)return console.log('Error: map has no length');

    let inputs=Flatten(args[1].split(','));

    console.log('model.out:',Model.Eval(Model(map),inputs).out);
}
