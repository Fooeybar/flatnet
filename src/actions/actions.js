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

const STDKEYS=['r0','r1','r2','r3'];

module.exports=(KEYS=STDKEYS)=>{
    
    if(!Array.isArray(KEYS))KEYS=STDKEYS;
    else for(let k=KEYS.length-1;k>=0;k--){
        if(typeof(KEYS[k])!=='string'||KEYS[k].length<1)KEYS.splice(k,1);
    }
    
    const Actions=[
        ['end',(model)=>{
            model.m=-99;
        }]
        
        //model.i
        ,['i_to_0',(model)=>{
            model.i=0;
        }]
        ,['i_to_end',(model,inputs)=>{
            model.i=inputs.length-1;
        }]
        ,['i_decrement',(model)=>{
            if(model.i>=1)model.i--;
        }]
        ,['i_increment',(model,inputs)=>{
            if(model.i+1<inputs.length)model.i++;
        }]
        
        //model.reg
        ,['reg_push_0',(model)=>{
            model.reg.push(0);
        }]
        ,['reg_pop_del',(model)=>{
            if(model.reg.length===1)model.reg[0]=0;
            else{
                model.reg.pop();
                for(let k=0;k<KEYS.length;k++)if(model[KEYS[k]]===model.reg.length)model[KEYS[k]]--;
            }
        }]
        
        //loop flow
        ,['break',(model)=>{
            return {break:true};
        }]
        ,['continue',(model)=>{
            return {continue:true};
        }]
        
    ];

    const ActsKeys=[
        (key='')=>[
            'i_to_reg:'+key,(model,inputs)=>{
                let val=~~model.reg[model[key]];
                if(val>=0&&val<inputs.length)model.i=val;
            }
        ]
        
        //add
        ,(key='')=>[
            'add_in:'+key,(model,inputs)=>{
                model.reg[model[key]]+=inputs[model.i];
            }
        ]
        ,(key='')=>[
            'add_1:'+key,(model)=>{
                model.reg[model[key]]+=1;
            }
        ]
        //add_random_float
        //add_random_int
        
        //subtract
        ,(key='')=>[
            'subtract_in:'+key,(model,inputs)=>{
                model.reg[model[key]]-=inputs[model.i];
            }
        ]
        ,(key='')=>[
            'subtract_1:'+key,(model)=>{
                model.reg[model[key]]-=1;
            }
        ]
        
        //multiply
        ,(key='')=>[
            'multiply_in:'+key,(model,inputs)=>{
                model.reg[model[key]]*=inputs[model.i];
            }
        ]
        ,(key='')=>[
            'multiply_2:'+key,(model)=>{
                model.reg[model[key]]*=2;
            }
        ]
        ,(key='')=>[
            'multiply_10:'+key,(model)=>{
                model.reg[model[key]]*=10;
            }
        ]
        ,(key='')=>[
            'multiply_0.1:'+key,(model)=>{
                model.reg[model[key]]*=0.1;
            }
        ]
        ,(key='')=>[
            'multiply_-1:'+key,(model)=>{
                model.reg[model[key]]*=-1;
            }
        ]
        
        //divide
        ,(key='')=>[
            'divide_in:'+key,(model,inputs)=>{
                if(inputs[model.i]===0)model.reg[model[key]]=0;
                model.reg[model[key]]/=inputs[model.i];
            }
        ]
        ,(key='')=>[
            'divide_2:'+key,(model)=>{
                model.reg[model[key]]/=2;
            }
        ]
        
        //exponent
        ,(key='')=>[
            'exponent_in:'+key,(model,inputs)=>{
                model.reg[model[key]]**=inputs[model.i];
            }
        ]
        ,(key='')=>[
            'exponent_reg:'+key,(model)=>{
                model.reg[model[key]]**=model.reg[model[key]];
            }
        ]
        ,(key='')=>[
            'exponent_2:'+key,(model)=>{
                model.reg[model[key]]**=2;
            }
        ]
        ,(key='')=>[
            'exponent_0.5:'+key,(model)=>{
                model.reg[model[key]]**=0.5;
            }
        ]
        ,(key='')=>[
            'exponent_-1:'+key,(model)=>{
                model.reg[model[key]]**=-1;
            }
        ]
        
        //set
        ,(key='')=>[
            'set_0_reg:'+key,(model)=>{
                model.reg[model[key]]=0;
            }
        ]
        ,(key='')=>[
            'set_equals_in:'+key,(model,inputs)=>{
                model.reg[model[key]]=inputs[model.i];
            }
        ]
        ,(key='')=>[
            'set_is_odd:'+key,(model)=>{
                model.reg[model[key]]%=2;
            }
        ]
        ,(key='')=>[
            'set_to_input_length:'+key,(model,inputs)=>{
                model.reg[model[key]]=inputs.legnth;
            }
        ]
        ,(key='')=>[
            'zero_round:'+key,(model)=>{
                model.reg[model[key]]=(model.reg[model[key]]>=0)?Math.floor(model.reg[model[key]]):Math.ceil(model.reg[model[key]]);
            }
        ]
        //set_random_float
        //set_random_int
        
        //pointers (KEYS)
        ,(key='')=>[
            'pointer_increment:'+key,(model)=>{
                if(model[key]+1<model.reg.length)model[key]++;
            }
        ]
        ,(key='')=>[
            'pointer_decrement:'+key,(model)=>{
                if(model[key]>=1)model[key]--;
            }
        ]
        ,(key='')=>[
            'pointer_to_0:'+key,(model)=>{
                model[key]=0;
            }
        ]
        ,(key='')=>[
            'pointer_to_reg_end:'+key,(model)=>{
                model[key]=model.reg.length-1;
            }
        ]
        
        //repeat
        ,(key='')=>[
            'repeat_next:'+key,(model,inputs)=>{
                let count=~~model.reg[model[key]];
                const START=++model.m;
                let flow={break:false,continue:false};
                
                while(count-->0&&START>=0&&START<model.map.length){
                    flow={...Actions[model.map[START]][1](model,inputs)};
                    if(flow.break||flow.continue||model.m<-1||model.m>=model.map.length-1)break;
                }
                model.m=START;
            }
        ]
        
        //do next if
        ,(key='')=>[
            'do_next_if_true:'+key,(model)=>{
                let val=~~model.reg[model[key]];
                if(val!==1)model.m++;
            }
        ]
        ,(key='')=>[
            'do_next_if_false:'+key,(model)=>{
                let val=~~model.reg[model[key]];
                if(val!==0)model.m++;
            }
        ]
        
        //return (future stuff)
        ,(key='')=>[
            'return_reg_val:'+key,(model)=>{
                return {value:model.reg[model[key]]};
            }
        ]
        
    ];

    
    for(let k=0;k<KEYS.length;k++){
        const KEY=KEYS[k];
        ActsKeys.push((key='')=>[
            `loop:${key},${KEY}`,(model,inputs)=>{
                let count=~~model.reg[model[key]];
                const WIDTH=~~model.reg[model[KEY]];
                const START=model.m+1;

                while(count-->0&&START>=0&&START<model.map.length){
                    let width=WIDTH;
                    model.m=START;
                    let flow={break:false,continue:false};
                    while(width-->0){
                        flow={...Actions[model.map[model.m]][1](model,inputs)};
                        if(flow.break||flow.continue||model.m<-1||model.m>=model.map.length-1)break;
                        model.m++;
                    }
                    if(flow.break)break;
                }
                model.m=(WIDTH>0)?START+WIDTH:START;
            }
        ]);
    }
    
    for(let a=0;a<ActsKeys.length;a++){
        for(let k=0;k<KEYS.length;k++){
            Actions.push(ActsKeys[a](KEYS[k]));
        }
    }
    return Actions;
};

if(module.parent)return;
require('./cli')(module.exports());
