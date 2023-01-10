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

module.exports=(Actions)=>{
    if(process.argv.length<3)return console.log('Actions.length:',Actions.length);

    const [map,rej]=require('../ext').Array.ParseInt(process.argv.slice(2).join(',').split(','),true);

    let to_string=false;
    
    for(let r=0;r<rej.length;r++){
        let str=rej[r].toLowerCase();
        if(str==='string'||str==='tostring')to_string=true;
    }
    
    let a=0;
    while(a<map.length){
        if(map[a]<0||map[a]>=Actions.length)console.log('[',map[a],'] Error: value out of range');
        else {
            let msg=(to_string)?
                Actions[map[a]][1].toString()
                :Actions[map[a]][0];
            
            console.log('[',map[a],'] '+msg);
        }
        a++;
    }
};
