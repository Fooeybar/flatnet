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

# Train

![flatnet](https://img.shields.io/badge/flatnet-v2.1.4-orange)
![license](https://img.shields.io/npm/l/flatnet)

`{Train}=require('flatnet')`

Simple training function: Evaluate, Fitness, Save?, End?, Cycle, repeat

- `Train(net,data=[],targets=[],config=CONFIG)`
- `data` array:
	- Elements in the array can be any variable, they will be [Flattened](../ext/README.md#flatten)
	- Each element should contain all the inputs for a single step evaluation
- `targets` array:
	- Elements in the array can be any variable
	- Elements are passed to the user supplied Fitness function
- `config` object:
	- `name`
		- The name used for file saving and loading
		- Default `name = 'model'`
	- `keep_ratio`
		- The % of models that will survive removal, see [Network.Cycle](../network/README.md#cycle)
		- Default `keep_ratio = 0.25`
	- `mut_count`
		- The number of times the model is mutated, see [Network.Mutate](../network/README.md#mutate)
		- Default `mut_count = 3`
	- `mut_ratio`
		- The pivot point for deleting or adding actions in mutation, see [Network.Mutate](../network/README.md#mutate)
		- Default `mut_ratio = 0.4`
	- `logging`
		- Console.log information during training
		- Default `logging = false`
	- `Fitness`
		- The fitness function used after evaluation
		- Default `Fitness = Network._STDFITNESS`, see [Network._STDFITNESS](../network/README.md#_stdfitness)
	- `Save`
		- This function is called after Eval & Fitness have completed, and before `End` and `Cycle`
		- To initiate a map save, must return a valid index position of a model in `net.models[]`
		- See [Model.SaveMap](../model/README.md#savemap)
		- Default `save`:
			```
			Save:func=(net)=>{
				if(func.last>=net.scores.high)return;
				func.last=net.scores.high;
				return net.scores.h;
			}
			```
	- `End`
		- The function to determine end of training
		- Is called after `Save` and before `Cycle`
		- Return === `true` to end
		- Default `End = (net)=>false` (infinite)