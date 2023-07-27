<!--
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
-->

# Network

![flatnet](https://img.shields.io/badge/flatnet-v2.1.4-orange)
![license](https://img.shields.io/npm/l/flatnet)

`{Network}=require('flatnet')`

A network is an object type containing scores, an action list, models, and a ptr_count getter

- [New](#new)
- [Mutate](#mutate)
- [Eval](#eval)
- [Fitness](#fitness)
- [Cycle](#cycle)
- [_STDFITNESS](#_stdfitness)

<br/>

## New

- `Network.New(ptr_count=2,size=1000,map=[]||'map')`
- `ptr_count`
	- Sets the length of `actions`
	- Sets the length of `model.o`
	- Sets pointer actions between output variables: `model.out[]`
- `size` sets the model count
- Include `map` as the initial map to copy & mutate model maps
	- May be an integer array
	- Or a file name without extension
- Returns a new network object

```
net={
	scores:{
		high:0                 	 highest model fitness score
		,h:0				   	 highest model index position
		,avg:0				   	 average fitness score of all models
		,low:9007199254740990  	 lowest model fitness score (max integer init)
		,l:0				   	 lowest model index position
		,cycles:0			   	 count of cycles net has performed
	}
	,PTRCNT:()=>ptr_count	   	 ptr_count getter
	,actions:[]					 actions list
	,models:[]				   	 models array
}
```

</br>

## Mutate

- `Network.Mutate(net,mut_count=3,mut_ratio=0.4)`
- Mutates `net.models[].map` according to `mut_count` and `mut_ratio`
- `mut_count` is the number of times the model is mutated
- `mut_ratio` is the pivot point for deleting or adding actions in mutation
	- A random float (max=1,min=0) is compared to `mut_ratio` during each mutation `mut_count`
	- If `float <= mut_ratio`, an action will be added
	- If `float > mut_ratio`, an action will be deleted
- Returns the net object

</br>

## Eval

- `Network.Eval(net,inputs=[])`
- Runs the net models against a set of inputs
- Flattens the input array before use; see [Flatten](../ext/README.md#flatten)
- Returns the net object

</br>

## Fitness

- `Network.Fitness(net,target=0,Func=Network._STDFITNESS,input=0)`
- Scores the fitness of `net.models`
- Calculates scores for the net, including higest, lowest, average
- `target` & `input` are both single integers
- Default fitness function is [_STDFITNESS](#_stdfitness)
- Returns the net object

</br>

## Cycle

- `Network.Cycle(net,keep_ratio=0.25,mut_count=3,mut_ratio=0.4)`
- Also known as the 'crossover' function
- Sorts models descending from highest fitness score
- `keep_ratio` is the % of models that will survive removal
- The removed models are replaced:
	- Replaced by new models mutated from existing models
	- Infinitely loops through existing models until net size is reached
	- `mut_count` is the number of times the model is mutated
	- `mut_ratio` is the pivot point for deleting or adding actions in mutation
	- A random float (max=1,min=0) is compared to `mut_ratio` during each mutation `mut_count`
	- If `float <= mut_ratio`, an action will be added
	- If `float > mut_ratio`, an action will be deleted
- Resets all `model.fit` values
- Resets `net.scores`
- Returns the net object

This crossover function is intended as a simple default and not expected to provide the same results as speciation, point-crossover, or any other more complex crossover function.

</br>

## _STDFITNESS

- `Network._STDFITNESS(model,target=0,input=0)`
- Default fitness function
- Simple absolute error distance formula
- If `model.out[0]` is within 10% of the target value:
	- Fitness is scored using incremental integers starting at 1
	- Fit score is increased on each distance integer percent decrease
	- Ex: error distance % = 7, fit score = 3
	- Ex: error distance % = 2, fit score = 8
- Returns the model object

```
_STDFITNESS:(model={},target=0,input=0)=>{
	let err=Math.abs(target-model.out[0]);
	if(err===0)model.fit+=10;
	else if(err<=target*0.01)model.fit+=9;
	else if(err<=target*0.02)model.fit+=8;
	else if(err<=target*0.03)model.fit+=7;
	else if(err<=target*0.04)model.fit+=6;
	else if(err<=target*0.05)model.fit+=5;
	else if(err<=target*0.06)model.fit+=4;
	else if(err<=target*0.07)model.fit+=3;
	else if(err<=target*0.08)model.fit+=2;
	else if(err<=target*0.09)model.fit+=1;
	return model;
}
```