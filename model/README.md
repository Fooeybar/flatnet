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

# Model

![flatnet](https://img.shields.io/badge/flatnet-v2.1.0-orange)
![license](https://img.shields.io/npm/l/flatnet)

`{Model}=require('flatnet')`

A model is an object type containing a map, output pointers and variables, and fitness score

- [New](#new)
- [Reset](#reset)
- [LoadMap](#loadmap)
- [SaveMap](#savemap)
- [Mutate](#mutate)
- [Eval](#eval)
- [_CLI](#_cli)

<br/>

## New

- `Model.New(ptr_count=2,map=[])`
- `ptr_count`
	- Sets the length of `model.o`
	- Sets pointer actions between output variables: `model.out[]`
- Include `map` to copy pre-existing map to a new model
- Returns a new model object

```
model={
	map:[]   	action list
	,o:[]    	output pointers
	,out:[]  	output variables
	,fit:0   	fitness score
}
```

<br/>

## Reset

- `Model.Reset(model,ptr_count=2)`
- Sets `model.fit` to 0
- Sets each pointer `model.o` to an incremental integer
	- `model.o[0]=0`
	- `model.o[1]=1`
	- ...etc
- Sets output variables `model.output` to 0
- Returns the reset model object

<br/>

## LoadMap

- `Model.LoadMap(name='model')`
- Loads a map from a file with extension `name`+`.fnet`
- Returns map array if file found
- Return empty array if no file found

<br/>

## SaveMap

- `Model.SaveMap(model,name='model')`
- Saves a map to a file with extension `name`+`.fnet`
- Returns false if the map has 0 length
- Returns true if file write is attempted

<br/>

## Mutate

- `Model.Mutate(model,count=3,ratio=0.45,actions=[])`
- Mutates `model.map` according to `count` and `ratio`
- `count` is the number of times the model is mutated
- `ratio` is the pivot point for deleting or adding actions in mutation
	- A random float (max=1,min=0) is compared to `ratio` during each mutation `count`
	- If `float <= ratio`, an action will be added
	- If `float > ratio`, an action will be deleted
- `actions` should be initialized with the same `ptr_count` as the model
- Returns the model object

<br/>

## Eval

- `Model.Eval(model,input=0,actions=[])`
- Runs the model map against an input
- Handles control flow returns
	- If map action returns < 0, the next map action is skipped
	- Otherwise the next action is called
- `actions` should be initialized with the same `ptr_count` as the model
- Returns the model object

<br/>

## _CLI

- `Model._CLI(args=[])`
- Simple command line functionality
- Also accessed by `node flatnet.js model`, see [flatnet command line](../flatnet.md#commandline)
- `ptr_count=2`	
	- Flag that can be entered any place after the first two arguments
	- Any integer
- Calling format
	- Accepts arguments as comma separated strings
	- `node model.js "0,1,2,3,4" "0,1,2,3,4"`
	- Or will accept map argument as a file name without a file extension
	- `node model.js mymapfile "0,1,2,3,4"`
- Prints the `model.out` array
- Returns the model object

<br/>

```
//default ptr_count=2

~> node model.js "0,1,2,3,4" "5,6,7,8,9"
	model.out: [ 0, 0 ]


//mymapfile = "0,1,2,3,4"
~> node model.js mymapfile "5,6,7,8,9"
	model.out: [ 0, 0 ]
```