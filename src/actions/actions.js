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

const Actions=[];

    
Actions.push(['end',(model)=>{model.m=-2;}]);


//model.i
    
Actions.push(['i_to_0',(model)=>{
    model.i=0;
}]);

Actions.push(['i_to_end',(model,inputs)=>{
    model.i=inputs.length-1;
}]);

Actions.push(['i_decrement',(model)=>{
    if(model.i-1>=0)model.i--;
}]);

//4
Actions.push(['i_increment',(model,inputs)=>{
    if(model.i+1<inputs.length)model.i++;
}]);

Actions.push(['i_to_reg:r0',(model,inputs)=>{
    let val=~~model.reg[model.r0];
    if(val>=0&&val<inputs.length)model.i=val;
}]);



//add
//6
Actions.push(['add_in:r0',(model,inputs)=>{
    model.reg[model.r0]+=inputs[model.i];
}]);

Actions.push(['add_1:r0',(model)=>{
    model.reg[model.r0]+=1;
}]);



//subtract
//8
Actions.push(['subtract_in:r0',(model,inputs)=>{
    model.reg[model.r0]-=inputs[model.i];
}]);

Actions.push(['subtract_1:r0',(model)=>{
    model.reg[model.r0]-=1;
}]);



//multiply
//10
Actions.push(['multiply_in:r0',(model,inputs)=>{
    model.reg[model.r0]*=inputs[model.i];
}]);

Actions.push(['multiply_2:r0',(model)=>{
    model.reg[model.r0]*=2;
}]);

Actions.push(['multiply_10:r0',(model)=>{
    model.reg[model.r0]*=10;
}]);

Actions.push(['multiply_0.1:r0',(model)=>{
    model.reg[model.r0]*=0.1;
}]);

Actions.push(['multiply_-1:r0',(model)=>{
    model.reg[model.r0]*=-1;
}]);



//divide

Actions.push(['divide_in:r0',(model,inputs)=>{
    if(inputs[model.i]===0)model.reg[model.r0]=0;
    model.reg[model.r0]/=inputs[model.i];
}]);

Actions.push(['divide_2:r0',(model)=>{
    model.reg[model.r0]/=2;
}]);



//exponent
//17
Actions.push(['exponent_in:r0',(model,inputs)=>{
    model.reg[model.r0]**=inputs[model.i];
}]);

Actions.push(['exponent_reg:r0',(model)=>{
    model.reg[model.r0]**=model.reg[model.r0];
}]);

Actions.push(['exponent_2:r0',(model)=>{
    model.reg[model.r0]**=2;
}]);

Actions.push(['exponent_0.5:r0',(model)=>{
    model.reg[model.r0]**=0.5;
}]);

Actions.push(['exponent_-1:r0',(model)=>{
    model.reg[model.r0]**=-1;
}]);



//extra?

Actions.push(['zero_round:r0',(model)=>{
    model.reg[model.r0]=(model.reg[model.r0]>=0)?Math.floor(model.reg[model.r0]):Math.ceil(model.reg[model.r0]);
}]);



//set

Actions.push(['set_0:r0',(model)=>{
    model.reg[model.r0]=0;
}]);

Actions.push(['set_equals_in:r0',(model,inputs)=>{
    model.reg[model.r0]=inputs[model.i];
}]);

Actions.push(['set_is_odd:r0',(model)=>{
    model.reg[model.r0]%=2;
}]);

Actions.push(['set_input_length:r0',(model,inputs)=>{
    model.reg[model.r0]=inputs.length;
}]);





//Actions.push([':r0',(model,inputs)=>{}]);

// actions[74]=(model={})=>{};
// ids[74]='repeat_next:out';
// actions[75]=(model={})=>{};
// ids[75]='repeat_next:var';
// actions[68]=(model={},args={})=>{};
// ids[68]='do_if:out';
// actions[68]=(model={},args={})=>{};
// ids[68]='do_if:var';
// actions[72]=(model={},args={})=>{};
// ids[72]='do_loop:var';
// actions[73]=(model={},args={})=>{};
// ids[73]='do_all_loops';



module.exports=Actions;

if(module.parent)return;

{
    
if(process.argv.length<3)return console.log('Actions.length:',Actions.length);

let map=require('../ext').Array.ParseInt(process.argv.slice(2).join(',').split(','));

let a=0;
while(a<map.length)console.log('[',map[a],'] '+Actions[map[a++]][0]);

}
