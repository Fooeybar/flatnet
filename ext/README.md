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

# Ext

![flatnet](https://img.shields.io/badge/flatnet-v2.1.4-orange)
![license](https://img.shields.io/npm/l/flatnet)

`{Ext}=require('flatnet')`

Utility functions

- [Timer](#timer)
- [Flatten](#flatten)
- [ParseInt](#parseint)
- [PTRCount](#ptrcount)
- [Random](#randomfloat)
	- [Float](#randomfloat)
	- [Integer](#randominteger)
- [Sort](#sortsort)
	- [Sort](#sortsort)
	- [Reverse](#sortreverse)

<br/>

## Timer

- `Ext.Timer()`
- Unit of measurement = milliseconds
- Returns truncated `('perf_hooks').performance.now()`

<br/>

## Flatten

- `Ext.Flatten(any_var,out=[])`
- Flattens any variable type to a 1D integer array
- Coverts string characters to char codes including object keys
- Returns the optional `out` array parameter

<br/>

## ParseInt

- `Ext.ParseInt(arr=[])`
- Parses string array using `parseInt()` on each element
- Returns a new array of non-NAN integer numbers

<br/>

## PTRCount

- `Ext.PTRCount(args=[])`
- For command line usage
- Searches string args for the flag '`ptr_count=` + integer'
- If found, splices the flag out of the args array
- Returns the parsed integer ptr_count variable

<br/>

## Random.Float

- `Ext.Random.Float(max=1,min=0)`
- Returns float number from max ~ min

<br/>

## Random.Integer

- `Ext.Random.Integer(max=1,min=0)`
- Returns integer number from max ~ min

<br/>

## Sort.Sort

- `Ext.Sort.Sort(arr=[],prop='')`
- Sorts an array of objects into descending order by the property value
- arr[0] = highest value
- Returns existing array

<br/>

## Sort.Reverse

- `Ext.Sort.Reverse(arr=[])`
- Reverses array order in-place
- Returns existing array

<br/>