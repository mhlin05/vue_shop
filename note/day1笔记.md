## day1笔记

### axios请求

请求数据的时候，记得参数的名字需要和接口要求的参数名字一致，否则会导致请求失败

### 路由守卫

![image-20210308213917236](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210308213917236.png)

### 登出功能

核心语句：释放token并且路由跳转到login界面



### 主页面布局

display：flex

弹性布局详解https://blog.csdn.net/iefreer/article/details/50775887

margin padding https://www.cnblogs.com/dongh/p/9584962.html



### Iconfont字体图标

https://www.cnblogs.com/hjvsdr/p/6639649.html

vue项目中引入css的方法

import './assets/fonts/iconfont.css'



### 解构语法和箭头函数

##### 解构函数

es6允许从数组中提取值，按照对应位置，对变量赋值

let {name：myName, age：myAge } = person

其中name和age用来匹配person中的属性名字，myName、myAge 是我们的变量名字

##### 箭头函数

箭头函数是用来简化函数定义语法的

const fn = ()=>{}

fn() 这样可以实现箭头函数调用