# flatnet

![flatnet](https://img.shields.io/badge/flatnet-v2.0.0-orange)
![license](https://img.shields.io/npm/l/flatnet)

## *flatnet is an evolutionary algorithm with models as action lists*

<br/>

```
npm i flatnet
Flatnet=require('flatnet')
{Network,Model,Actions}=Flatnet()
```

Flatnet is an attempt to create a machine learning algorithm that reduces a standard model down to a list of actions to execute on the model, rather than a system of nodes and links. The argument is this will remove unnecessary structural elements, providing a smaller and faster solution. It is noted, however, this can also potentially increase the solution search time.

<br/>

---

- [Model](#model)
- [Actions](#actions)
- [Network](#network)

---

## Model

Model()=>model

- model.l
- model.map
- model.o
- model.out
- model.fit

Model.Reset(model)

Model.Mutate(model,count,ratio)

Model.Eval(model,inputs)

Model.LoadMap(name)

Model.SaveMap(model,name)

<br/>

---

## Actions

```
Actions=[
	id:''
	,Func:(model,input)=>{}
]
```

<br/>

---

## Network

Network(config)=>net

```
config={
	size:1000
	,keep_ratio:0.25
	,Fitness:(model,target,inputs)=>{if(model.out[0]===target)model.fit++;}
	,map:[]
	,lib:[]
	,mut_count:3
	,mut_ratio:0.4
}
```

- net.cycles
- net.high
- net.h
- net.avg
- net.low
- net.l

net.Eval(inputs,target,do_fitness)

net.Cycle()

net.Train(data,targets,opts)

```
train_config={
	logging:true
	,name:'model'
	,single_fitness:false
	,Save:func=(net)=>{
		if(func.last>=net.high)return;
        func.last=net.high;
        return net.h;
	}
	,End:(net)=>(net.cycles>100000)?true:false
}
```
<br/>

---