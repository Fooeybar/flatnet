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
//——————————————————————————————————————————————————————————————————

const Actions={
    PTR_SINGLE:[
        //logic
        (o)=>[
            'if_true:o'+o
            ,(model)=>{if(~~model.out[model.o[o]]!==1)return -1;}
        ]
        ,(o)=>[
            'if_false:o'+o
            ,(model)=>{if(~~model.out[model.o[o]]!==0)return -1;}
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
            ,(model,ptr_count)=>{
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
            ,(model)=>{model.out[model.o[o]]+=Ext.Random.Float(100);}
        ]
        ,(o)=>[
            'add_rand_int:o'+o
            ,(model)=>{model.out[model.o[o]]+=Ext.Random.Integer(100);}
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

    ]
    ,PTR_DUAL:[
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
    ]
    ,New:(ptr_count=2)=>{
        const actions=[];

        for(let a=0;a<Actions.PTR_SINGLE.length;a++){
            for(let o1=0;o1<ptr_count;o1++)actions.push(Actions.PTR_SINGLE[a](o1,ptr_count));
        }
    
        for(let a=0;a<Actions.PTR_DUAL.length;a++){
            for(let o1=0;o1<ptr_count;o1++)
                for(let o2=o1+1;o2<ptr_count;o2++){
                    actions.push(Actions.PTR_DUAL[a](o1,o2));
                    actions.push(Actions.PTR_DUAL[a](o2,o1));
                }
        }
    
        return actions;
    }
    ,_CLI:(args=process.argv.slice(2))=>{
        const ptr_count=Ext.PTRCount(args);
        const actions=Actions.New(ptr_count);    
    
        if(args.length===0)return console.log('   actions.length:',actions.length);
        const map=Ext.ParseInt(args.join(',').split(','));
        let a=0;
        while(a<map.length){
            if(map[a]<0||map[a]>=actions.length)console.log('   ['+map[a]+'] Error: value out of range');
            else console.log('   ['+map[a]+'] '+actions[map[a]][0]);
            a++;
        }
        return actions;
    }
};
//——————————————————————————————————————————————————————————————————

module.exports=Actions;
if(!module.parent)return Actions._CLI();