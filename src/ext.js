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

{//Flatten
const Flatten=(any,out=[])=>{
    let type=typeof(any);
    
    if(type==='number')out.push(any);
    else if(type==='boolean')out.push(any?1:0);
    
    else if(type==='string'){
        let num=parseFloat(any);
        if(num===num)out.push(num);
        else for(let a=0;a<any.length;a++)out.push(any.charCodeAt(a));
    }
    
    else if(Array.isArray(any))for(let a=0;a<any.length;a++)Flatten(any[a],out);
    
    else if(type==='object')for(let keys=Object.keys(any),k=0;k<keys.length;k++){
        for(let n=0;n<keys[k].length;n++)out.push(keys[k].charCodeAt(n));
        Flatten(any[keys[k]],out);
    }
    return out;
};
module.exports.Flatten=Flatten;
}

{//Shuffle
const Shuffle=(arr=[])=>{
    let out=[];
    let temp=[];
    for(let i=0;i<arr.length;i++)temp.push(i);
    while(temp.length>0){
        let i=~~(Math.random()*(temp.length-1));
        out.push(arr[temp.splice(i,1)[0]]);
    }
    return out;
};

module.exports.Shuffle=Shuffle;
}

{//Random
const Float=(max=1,min=0)=>(Math.random()*(max-min)+min);

const Integer=(max=1,min=0)=>(Math.floor(Float(max+1,min)));

const Element=(arr=[])=>(arr[Integer(arr.length-1)]);

const Index=(arr=[])=>(Integer(arr.length-1));

const Property=(obj={})=>(obj[Element(Object.keys(obj))]);

module.exports.Random={Float,Integer,Element,Index,Property};
}

{//Sort
const Swap=(arr=[],a=0,b=1)=>{
    let t=arr[a];
    arr[a]=arr[b];
    arr[b]=t;
};

const PartitionProperty=(arr=[],low=0,high=arr.length-1,prop='')=>{
  let pivot=arr[high][prop];
  let i=low;
  for(let j=low;j<high;j++){
    if(arr[j][prop]<=pivot){      
        Swap(arr,i,j);
        i++;
    }
  }
  Swap(arr,i,high);
  return i;
};

const Property=(arr=[],prop='')=>{
  let stack=[];
  stack.push({x:0,y:arr.length-1});
  while(stack.length){
    const {x,y}=stack.shift();
    const part=PartitionProperty(arr,x,y,prop);
    if(part-1>x)stack.push({x:x,y:part-1});
    if(part+1<y)stack.push({x:part+1,y:y});
  }
  return arr;
};

const PropertyR=(arr=[],prop='',low=0,high=arr.length-1)=>{
    if(low<high){
        let pivot=arr[high][prop];
        let i=low-1;
        for(let j=low;j<high;j++)if(arr[j][prop]<=pivot)Swap(arr,++i,j);
        Swap(arr,i+1,high);
        Property(arr,prop,low,i);
        Property(arr,prop,i+2,high);
    }    
    return arr;
};

const PartitionValue=(arr=[],low=0,high=arr.length-1)=>{
  let pivot=arr[high];
  let i=low;
  for(let j=low;j<high;j++){
    if(arr[j]<=pivot){      
        Swap(arr,i,j);
        i++;
    }
  }
  Swap(arr,i,high);
  return i;
};

const Value=(arr=[])=>{
  let stack=[];
  stack.push({x:0,y:arr.length-1});
  while(stack.length){
    const {x,y}=stack.shift();
    const part=PartitionValue(arr,x,y);
    if(part-1>x)stack.push({x:x,y:part-1});
    if(part+1<y)stack.push({x:part+1,y:y});
  }
  return arr;
};

const ValueR=(arr=[],low=0,high=arr.length-1)=>{
    if(low<high){
        let pivot=arr[high];
        let i=low-1;
        for(let j=low;j<high;j++)if(arr[j]<=pivot)Swap(arr,++i,j);
        Swap(arr,i+1,high);
        Value(arr,low,i);
        Value(arr,i+2,high);
    }
    return arr;
};

const ReverseNew=(arr=[])=>{
    let temp=[];
    for(let t=arr.length-1,a=0;a<arr.length;t--,a++)temp[t]=arr[a];
    return temp;
};

const Reverse=(arr=[])=>{
    let i=0;
    let e=arr.length;
    let mid=~~(e*0.5);
    let temp;
    for(;i<mid;i++){
        temp=arr[i];
        arr[i]=arr[e-1-i];
        arr[e-1-i]=temp;
    }
    return arr;
};

module.exports.Sort={
    Property
    ,PropertyR
    ,Value
    ,ValueR
    ,Reverse
    ,ReverseNew
};
}

{//Delay
const Time=require('perf_hooks').performance.now;
const Delay=(milliseconds=0)=>{
    let time=Time();
    while(milliseconds>~~(Time()-time)){}
};    

module.exports.Delay=Delay;
}

{//Math
const ZeroRound=(x)=>(x>0?Math.floor(x):x<0?Math.ceil(x):0);

const IsPrime=(num)=>{
    for(let i=2,s=Math.sqrt(num);i<=s;i++)if(num%i===0)return 0;
    return (num>1)?1:0;
};

module.exports.Math={ZeroRound,IsPrime};
}

{//CSV
//parse arr of objs to csv
const ToCSV=(rows=[])=>{
    let file='';
    let headers=Object.keys(rows[0]);
    for(let i=0;i<headers.length;i++){
        file+=headers[i];
        if(i+1<headers.length)file+=',';
    }
    file+='\n';
    for(let i=0;i<rows.length;i++){
        for(let h=0;h<headers.length;h++){
            file+=rows[i][(typeof(rows[i]))?headers[h]:h];
            if(h+1<headers.length)file+=',';
        }
        if(i+1<rows.length)file+='\n';
    }
    return file;
};

//parse CSV to arr of objs
const ToArray=(file='')=>{
    let arr=[];
    //get headers
    let pos=file.indexOf('\n',0);
    let headers=file.substring(0,pos).split(',');
    //format & push rows
    while(++pos<file.length){
        let obj={};
        let end=file.indexOf('\n',pos+1);
        if(end===-1)end=file.length;
        let values=file.substring(pos,end).split(',');
        for(let h=0;h<headers.length;h++)obj[headers[h]]=values[h];
        arr.push(obj);
        pos=end;
    }
    return arr;
};

module.exports.CSV={ToCSV,ToArray};
}

{//Array
const Compare1D=(arr1=[],arr2=[])=>{
    if(arr1.length!==arr2.length)return false;
    for(let i=0;i<arr1.length;i++)if(arr1[i]!==arr2[i])return false;
    return true;
};

const ParseInt=(arr=[])=>{
    let out=[];
    for(let i=0;i<arr.length;i++){
        let int=parseInt(arr[i]);
        if(int===int)out.push(int);
    }
    return out;
};
    
module.exports.Array={
    Compare1D
    ,ParseInt
};
}
