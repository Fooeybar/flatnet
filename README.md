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

# flatnet

![flatnet](https://img.shields.io/badge/flatnet-v2.1.4-orange)
![license](https://img.shields.io/npm/l/flatnet)

Flatnet is an attempt to create a machine learning algorithm that reduces a standard model down to a list of actions to execute on the model outputs, rather than a system of nodes and links.

`npm i flatnet`

TLDR: To quickly jump in and start training a network on data, see [Train](train/)

## Module

`{Model,Actions,Network,Train,Ext}=require('flatnet)`

- [Model](model/)
- [Actions](actions/)
- [Network](network/)
- [Train](train/)
- [Ext](ext/)

## Command Line

- Simple command line functionality
- Entering with no args `node flatnet.js` will print command line paths available:
    ```
    ~> node flatnet.js

        Flatnet:
            cli root: 'actions' 'eval'
            flags: 'ptr_count=2'
    ```
- If using the flag `ptr_count=int`, it must be anywhere after the 3rd argument: `actions` or `model`
    - Default `ptr_count=2` if not entered
    - For more info on `ptr_count` flag, see [Actions.New](actions/README.md#new) and [Model.New](model/README.md#new)
    ```
    ~> node flatnet.js actions ptr_count=1 args
    ~> node flatnet.js actions args ptr_count=2

    ~> node flatnet.js model ptr_count=3 arg1 arg2
    ~> node flatnet.js model arg1 ptr_count=4 arg2
    ~> node flatnet.js model arg1 arg2 ptr_count=5
    ```
- `node flatnet.js actions args`
    - Also accessed by `node actions.js`, see [Actions._CLI](actions/README.md#_cli)
    - If args = 0, will print and return `actions.length`
    - If args > 0, will print names of actions by integer lookup
    - Returns action array
- `node flatnet.js model arg1 arg2`
    - Also accessed by `node model.js`, see [Model._CLI](model/README.md#_cli)
	- Accepts arguments as comma separated strings
	    - `node model.js "0,1,2,3,4" "0,1,2,3,4"`
	- Or will accept map argument as a file name without a file extension
	    - `node model.js mymapfile "0,1,2,3,4"`
    - Prints the `model.out` array
    - Returns the model object