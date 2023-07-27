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

# Actions

![flatnet](https://img.shields.io/badge/flatnet-v2.1.0-orange)
![license](https://img.shields.io/npm/l/flatnet)

`{Actions}=require('flatnet')`

Actions are a named list of functions applied to flatnet models

- [New](#new)
- [_CLI](#_cli)

<br/>

## New

- `Actions.New(ptr_count=2)`
- `ptr_count` sets the length of `actions`
- returns a new array of 2D arrays: `[[name,function],...]`

<br/>

## _CLI

- Simple command line functionality
- Also accessed by `node flatnet.js actions`, see [flatnet command line](../flatnet.md#commandline)
- If args = 0, will print and return `actions.length`
- If args > 0, will print names of actions by integer lookup
- `ptr_count=2`	
	- Flag that can be entered any place after the first two arguments
	- Any integer
- Returns action array

<br/>

```
//default ptr_count=2

~> node actions.js
	actions.length: 98

~> node actions.js 0 1 2 3 4
	[0] if_true:o0
	[1] if_true:o1
	[2] if_false:o0
	[3] if_false:o1
	[4] o_increment:o0
```

<br/>

````
//with ptr_count flag

~> node actions.js ptr_count=1
	actions.length: 42

~> node actions.js "0,1,2,3,4" ptr_count=1
	[0] if_true:o0
	[1] if_false:o0
	[2] o_increment:o0
	[3] o_decrement:o0
	[4] o_to_0:o0
````

<br/>