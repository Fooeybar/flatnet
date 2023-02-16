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

const {Network,Model}=require('../flatnet')();

const NAME=process.argv[2]||process.argv[1].slice(process.argv[1].lastIndexOf('/')+1,process.argv[1].length-3);

let data=[
    'hello'
    ,'hiya'
    ,'yo'
    ,'hi'
    ,'hallo'
    ,'helo'
    ,'hey'
    ,'howdy'
    ,'greetings'
    ,'whats up'
    ,'sup'
    ,'aye'
    ,'whats happening'
    ,'whats good'
    ,'yallow'
    ,'hola'
    ,'ciao'
    ,'bonjour'
    ,'heyo'
    ,'good day'
];

Network({
    size:10000
    ,mut_count:3
    ,mut_ratio:0.35
    ,keep_ratio:0.1
    ,map:Model.LoadMap(NAME)
    ,Fitness:(model)=>{
        model.fit=0;
        if(model.out[0]===104)model.fit++;
        if(model.out[1]===101)model.fit++;
        if(model.out[2]===108)model.fit++;
        if(model.out[3]===108)model.fit++;
        if(model.out[4]===111)model.fit++;
    }
})
.Train(data,[],{
    logging:true
    ,name:NAME
    ,End:(net)=>{
        if(net[net.h].fit<5)return false;
        let model=Model.Eval(Model(net[net.h].map),['heya']);
        let word='';
        for(let w=0;w<model.out.length;w++)word+=String.fromCharCode(model.out[w]);
        console.log(word);
        return (word==='hello')?true:false;
    }
});
