/*
————————————————————————————————————————————————————————————————
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

const Ext=require('./ext/ext');
const Actions=require('./actions/actions');
const Model=require('./model/model');
const Network=require('./network/network');
const Train=require('./train/train');

module.exports={
    Actions
    ,Ext
    ,Model
    ,Network
    ,Train
};
//——————————————————————————————————————————————————————————————————

if(module.parent)return;
if(process.argv.length<3){
    console.log('\nFlatnet:');
    console.log('   cli root: \'actions\' \'eval\'');
    console.log('   flags: \'ptr_count=2\''); 
    return console.log('');
}

const args=process.argv.slice(2);
const cli=args.shift();

if(cli==='actions')return Actions._CLI(args);
if(cli==='model')return Model._CLI(args);