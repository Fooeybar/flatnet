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

module.exports=(ModelExp)=>{
    const Model=ModelExp();//////////////////////////
    if(process.argv.length<3)return console.log('Model.Eval(): [map] [inputs]');
    if(process.argv.length>4)return console.log(`Error: too many arguments : [${process.argv[2]}] [${process.argv[3]}] [${process.argv.slice(4)}]`);

    const args=process.argv.slice(2);

    let premap=args[0].indexOf(',');
    if(premap<0){
        let int=parseInt(args[0]);
        if(int===int)premap=int;
    }

    const {Array:{ParseInt}}=require('../ext');

    let map=ParseInt((premap>-1)?args[0].split(','):Model.LoadMap(args[0]));

    for(let m=0;m<map.length;m++){
        let val=map[m];
        if(val<0||val>=Model.Actions.length)console.log('[',map.splice(m,1)[0],'] Error: value out of range');
    }

    if(map.length<1)return console.log('Error: map has no length');

    let inputs=(args.length===2)?ParseInt(args[1].split(',')):[];

    console.log(`Model.Eval():`,Model.Eval(Model(map),inputs));
};
