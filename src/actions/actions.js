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

const actions=[];
const ids=[];

{
actions[0]=(model={})=>{model.i=0;};
ids[0]='i_to_0';
actions[1]=(model={})=>{model.i=(model.i<model.inputs.length)?model.inputs.length-1:0;};
ids[1]='i_to_end';
actions[2]=(model={})=>{if(model.i+1<model.inputs.length)model.i++;};
ids[2]='i_increment';
actions[3]=(model={})=>{if(model.i-1>=0)model.i--;};
ids[3]='i_decrement';
actions[4]=(model={})=>{
    let value=Math.trunc(model.out);
    if(value>=0&&value<model.inputs.length)model.i=value;
};
ids[4]='i_to_value:out';
actions[5]=(model={})=>{
    let value=Math.trunc(model.var);
    if(value>=0&&value<model.inputs.length)model.i=value;
};
ids[5]='i_to_value:var';

actions[6]=(model={})=>{model.out=0;};
ids[6]='set_0:out';
actions[7]=(model={})=>{model.var=0;};
ids[7]='set_0:var';
actions[8]=(model={})=>{model.out=model.inputs[model.i];};
ids[8]='set_equals_in:out';
actions[9]=(model={})=>{model.var=model.inputs[model.i];};
ids[9]='set_equals_in:var';
actions[10]=(model={})=>{model.out=model.var;};
ids[10]='set_equals_var:out';
actions[11]=(model={})=>{model.var=model.out;};
ids[11]='set_equals_out:var';

actions[12]=(model={})=>{model.out+=model.inputs[model.i];};
ids[12]='add_in:out';
actions[13]=(model={})=>{model.out+=model.var;};
ids[13]='add_var:out';
actions[14]=(model={})=>{model.var+=model.inputs[model.i];};
ids[14]='add_in:var';
actions[15]=(model={})=>{model.var+=model.out;};
ids[15]='add_out:var';
actions[16]=(model={})=>{model.out+=1;};
ids[16]='add_1:out';
actions[17]=(model={})=>{model.var+=1;};
ids[17]='add_1:var';
actions[18]=(model={})=>{model.out+=0.1;};
ids[18]='add_0.1:out';
actions[19]=(model={})=>{model.var+=0.1;};
ids[19]='add_0.1:var';

actions[20]=(model={})=>{model.out-=model.inputs[model.i];};
ids[20]='subtract_in:out';
actions[21]=(model={})=>{model.out-=model.var;};
ids[21]='subtract_var:out';
actions[22]=(model={})=>{model.var-=model.inputs[model.i];};
ids[22]='subtract_in:var';
actions[23]=(model={})=>{model.var-=model.out;};
ids[23]='subtract_out:var';
actions[24]=(model={})=>{model.out-=1;};
ids[24]='subtract_1:out';
actions[25]=(model={})=>{model.var-=1;};
ids[25]='subtract_1:var';
actions[26]=(model={})=>{model.out-=0.1;};
ids[26]='subtract_0.1:out';
actions[27]=(model={})=>{model.var-=0.1;};
ids[27]='subtract_0.1:var';

actions[28]=(model={})=>{model.out*=model.inputs[model.i];};
ids[28]='multiply_in:out';
actions[29]=(model={})=>{model.out*=model.var;};
ids[29]='multiply_var:out';
actions[30]=(model={})=>{model.var*=model.inputs[model.i];};
ids[30]='multiply_in:var';
actions[31]=(model={})=>{model.out*=2;};
ids[31]='multiply_2:out';
actions[32]=(model={})=>{model.var*=2;};
ids[32]='multiply_2:var';
actions[33]=(model={})=>{model.out*=10;};
ids[33]='multiply_10:out';
actions[34]=(model={})=>{model.var*=10;};
ids[34]='multiply_10:var';
actions[35]=(model={})=>{model.out*=0.1;};
ids[35]='multiply_0.1:out';
actions[36]=(model={})=>{model.var*=0.1;};
ids[36]='multiply_0.1:var';
actions[37]=(model={})=>{model.out*=(-1);};
ids[37]='multiply_-1:out';
actions[38]=(model={})=>{model.var*=(-1);};
ids[38]='multiply_-1:var';

actions[39]=(model={})=>{
    if(model.inputs[model.i]===0)model.out=0;
    else model.out/=model.inputs[model.i];
};
ids[39]='divide_in:out';
actions[40]=(model={})=>{
    if(model.var===0)model.out=0;
    else model.out/=model.var;
};
ids[40]='divide_var:out';
actions[41]=(model={})=>{
    if(model.inputs[model.i]===0)model.var=0;
    else model.var/=model.inputs[model.i];
};
ids[41]='divide_in:var';
actions[42]=(model={})=>{
    if(model.out===0)model.var=0;
    else model.var/=model.out;
};
ids[42]='divide_out:var';
actions[43]=(model={})=>{model.out/=2;};
ids[43]='divide_2:out';
actions[44]=(model={})=>{model.var/=2;};
ids[44]='divide_2:var';

actions[45]=(model={})=>{model.out**=model.inputs[model.i];};
ids[45]='exponent_in:out';
actions[46]=(model={})=>{model.out**=model.out;};
ids[46]='exponent_out:out';
actions[47]=(model={})=>{model.out**=model.var;};
ids[47]='exponent_var:out';
actions[48]=(model={})=>{model.var**=model.inputs[model.i]};
ids[48]='exponent_in:var';
actions[49]=(model={})=>{model.var**=model.out;};
ids[49]='exponent_out:var';
actions[50]=(model={})=>{model.var**=model.var;};
ids[50]='exponent_var:var';
actions[51]=(model={})=>{model.out**=2;};
ids[51]='exponent_2:out';
actions[52]=(model={})=>{model.var**=2;};
ids[52]='exponent_2:var';
actions[53]=(model={})=>{model.out**=(0.5);};
ids[53]='exponent_0.5:out';
actions[54]=(model={})=>{model.var**=(0.5);};
ids[54]='exponent_0.5:var';
actions[55]=(model={})=>{model.out**=(-1);};
ids[55]='exponent_-1:out';
actions[56]=(model={})=>{model.var**=(-1);};
ids[56]='exponent_-1:var';

actions[57]=(model={})=>{model.out=model.out>0?Math.floor(model.out):model.out<0?Math.ceil(model.out):0;};
ids[57]='zero_round:out';
actions[58]=(model={})=>{model.var=model.var>0?Math.floor(model.var):model.var<0?Math.ceil(model.var):0;};
ids[58]='zero_round:var';

//---
actions[59]=(model={})=>{model.out%=2;};
ids[59]='set_is_odd:out';
actions[60]=(model={})=>{model.var%=2;};
ids[60]='set_is_odd:var';
actions[61]=(model={})=>{model.out=model.inputs.length;};
ids[61]='set_input_length:out';
actions[62]=(model={})=>{model.var=model.inputs.length;};
ids[62]='set_input_length:var';
actions[63]=(model={})=>{model.out=(model.out===model.i)?1:0;};
ids[63]='set_is_i_out:out';
actions[64]=(model={})=>{model.var=(model.out===model.i)?1:0;};
ids[64]='set_is_odd:var';
actions[65]=(model={})=>{model.out=(model.out===model.var)?1:0;};
ids[65]='set_is_out_var:out';
actions[66]=(model={})=>{model.var=(model.out===model.var)?1:0;};
ids[66]='set_is_out_var:var';

actions[67]=(model={})=>model.map.length;
ids[67]='end';
actions[68]=(model={})=>{
    let temp=model.out;
    model.out=model.var;
    model.var=temp;
};
ids[68]='swap_out_var';


// actions[]=(model={})=>{};
// ids[]='';
}

actions.ids=ids;

module.exports=actions;

if(module.parent)return;
if(process.argv.length<3)return console.log('actions.length:',actions.length);

let map=require('../ext').Array.ParseInt(process.argv.slice(2).join(',').split(','));

let a=0;
while(a<map.length)console.log('[',map[a],'] '+ids[map[a++]]);
