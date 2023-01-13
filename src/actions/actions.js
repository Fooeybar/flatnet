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

module.exports=(ptr_count=2)=>{
    if(~~ptr_count<=0)ptr_count=2;
    
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
        
        //flow
        ,['break',(model)=>{
            return {break:true};
        }]
        ,['continue',(model)=>{
            return {continue:true};
        }]
        ,['return',(model)=>{
            return {return:true};
        }]
        
    ];

    const ActsKeys=[
        (ptr='')=>[
            'i_to_reg:'+ptr,(model,inputs)=>{
                let val=~~model.reg[model[ptr]];
                if(val>=0&&val<inputs.length)model.i=val;
            }
        ]
        
        //add
        ,(ptr='')=>[
            'add_in:'+ptr,(model,inputs)=>{
                model.reg[model[ptr]]+=inputs[model.i];
            }
        ]
        ,(ptr='')=>[
            'add_1:'+ptr,(model)=>{
                model.reg[model[ptr]]+=1;
            }
        ]
        //add_random_float
        //add_random_int
        
        //subtract
        ,(ptr='')=>[
            'subtract_in:'+ptr,(model,inputs)=>{
                model.reg[model[ptr]]-=inputs[model.i];
            }
        ]
        ,(ptr='')=>[
            'subtract_1:'+ptr,(model)=>{
                model.reg[model[ptr]]-=1;
            }
        ]
        
        //multiply
        ,(ptr='')=>[
            'multiply_in:'+ptr,(model,inputs)=>{
                model.reg[model[ptr]]*=inputs[model.i];
            }
        ]
        ,(ptr='')=>[
            'multiply_2:'+ptr,(model)=>{
                model.reg[model[ptr]]*=2;
            }
        ]
        ,(ptr='')=>[
            'multiply_10:'+ptr,(model)=>{
                model.reg[model[ptr]]*=10;
            }
        ]
        ,(ptr='')=>[
            'multiply_0.1:'+ptr,(model)=>{
                model.reg[model[ptr]]*=0.1;
            }
        ]
        ,(ptr='')=>[
            'multiply_-1:'+ptr,(model)=>{
                model.reg[model[ptr]]*=-1;
            }
        ]
        
        //divide
        ,(ptr='')=>[
            'divide_in:'+ptr,(model,inputs)=>{
                if(inputs[model.i]===0)model.reg[model[ptr]]=0;
                model.reg[model[ptr]]/=inputs[model.i];
            }
        ]
        ,(ptr='')=>[
            'divide_2:'+ptr,(model)=>{
                model.reg[model[ptr]]/=2;
            }
        ]
        
        //exponent
        ,(ptr='')=>[
            'exponent_in:'+ptr,(model,inputs)=>{
                model.reg[model[ptr]]**=inputs[model.i];
            }
        ]
        ,(ptr='')=>[
            'exponent_reg:'+ptr,(model)=>{
                model.reg[model[ptr]]**=model.reg[model[ptr]];
            }
        ]
        ,(ptr='')=>[
            'exponent_2:'+ptr,(model)=>{
                model.reg[model[ptr]]**=2;
            }
        ]
        ,(ptr='')=>[
            'exponent_0.5:'+ptr,(model)=>{
                model.reg[model[ptr]]**=0.5;
            }
        ]
        ,(ptr='')=>[
            'exponent_-1:'+ptr,(model)=>{
                model.reg[model[ptr]]**=-1;
            }
        ]
        
        //set
        ,(ptr='')=>[
            'set_0_reg:'+ptr,(model)=>{
                model.reg[model[ptr]]=0;
            }
        ]
        ,(ptr='')=>[
            'set_equals_in:'+ptr,(model,inputs)=>{
                model.reg[model[ptr]]=inputs[model.i];
            }
        ]
        ,(ptr='')=>[
            'set_is_odd:'+ptr,(model)=>{
                model.reg[model[ptr]]%=2;
            }
        ]
        ,(ptr='')=>[
            'set_to_input_length:'+ptr,(model,inputs)=>{
                model.reg[model[ptr]]=inputs.legnth;
            }
        ]
        ,(ptr='')=>[
            'zero_round:'+ptr,(model)=>{
                model.reg[model[ptr]]=(model.reg[model[ptr]]>=0)?Math.floor(model.reg[model[ptr]]):Math.ceil(model.reg[model[ptr]]);
            }
        ]
        //set_random_float
        //set_random_int
        
        //register
        ,(ptr='')=>[
            'reg_new:'+ptr,(model)=>{
                model[ptr]=model.reg.push(0)-1;
            }
        ]
        ,(ptr='')=>[
            'reg_del:'+ptr,(model)=>{
                const index=~~model.reg[model[ptr]];
                if(index>=0&&index<model.reg.length){
                    model.reg.splice(index,1);
                    for(let p=0;p<ptr_count;p++)if(model['ptr'+p]>=model.reg.length)model['ptr'+p]=model.reg.length-1;
                }
            }
        ]
        
        //pointers
        ,(ptr='')=>[
            'pointer_increment:'+ptr,(model)=>{
                if(model[ptr]+1<model.reg.length)model[ptr]++;
            }
        ]
        ,(ptr='')=>[
            'pointer_decrement:'+ptr,(model)=>{
                if(model[ptr]>=1)model[ptr]--;
            }
        ]
        ,(ptr='')=>[
            'pointer_to_0:'+ptr,(model)=>{
                model[ptr]=0;
            }
        ]
        ,(ptr='')=>[
            'pointer_to_reg_end:'+ptr,(model)=>{
                model[ptr]=model.reg.length-1;
            }
        ]
        
        //repeat
        ,(ptr='')=>[
            'repeat_next:'+ptr,(model,inputs)=>{
                let count=~~model.reg[model[ptr]];
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
        ,(ptr='')=>[
            'do_next_if_true:'+ptr,(model)=>{
                let val=~~model.reg[model[ptr]];
                if(val!==1)model.m++;
            }
        ]
        ,(ptr='')=>[
            'do_next_if_false:'+ptr,(model)=>{
                let val=~~model.reg[model[ptr]];
                if(val!==0)model.m++;
            }
        ]
        
        //return (future stuff)
        ,(ptr='')=>[
            'return_reg_val:'+ptr,(model)=>{
                return {value:model.reg[model[ptr]]};
            }
        ]

        //functions
        ,(ptr='')=>[
            'function_new:'+ptr,(model)=>{
                const width=~~model.reg[model[ptr]];
                if(width>0){
                    model.fun.push([++model.m,width]);
                    model.m+=width;
                }
            }
        ]
        ,(ptr='')=>[
            'function_del:'+ptr,(model)=>{
                const index=~~model.reg[model[ptr]];
                if(index>=0&&index<model.fun.length)model.fun.splice(index,1);
            }
        ]
        ,(ptr='')=>[
            'function_call:'+ptr,(model,inputs)=>{
                const index=~~model.reg[model[ptr]];
                if(index>=0&&index<model.fun.length){
                    model.m=model.fun[index][0];
                    let width=model.fun[index][1];
                    let flow={return:false};
                    while(width-->0){
                        flow={...Actions[model.map[model.m]][1](model,inputs)};
                        if(flow.return||model.m<-1||model.m>=model.map.length-1)break;
                        model.m++;
                    }
                    model.m=model.fun[index][0]+model.fun[index][1];
                }
            }
        ]

        
    ];

    //loops
    for(let p=0;p<ptr_count;p++)ActsKeys.push((ptr='')=>[
        `loop:${ptr},${'ptr'+p}`,(model,inputs)=>{
            let count=~~model.reg[model[ptr]];
            const WIDTH=~~model.reg[model['ptr'+p]];
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
    
    //push all ptr actions
    for(let a=0;a<ActsKeys.length;a++){
        for(let p=0;p<ptr_count;p++){
            Actions.push(ActsKeys[a]('ptr'+p));
        }
    }
    return Actions;
};

if(module.parent)return;
require('./cli')(module.exports());
