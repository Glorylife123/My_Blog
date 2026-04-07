---
title: 东南网安复试 C++ 笔试题回忆：题型整理和模拟题
date: 2025-04-02 21:40:00
tags:
  - Cpp
  - 考研复试
  - 教程
  - 东南大学
categories:
  - 考研
cover: https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80
---

## 这篇写什么

这篇主要整理我参加东南网安复试时，C++ 笔试的大致题型和我还能记住的内容。

因为考完已经过了一段时间，不可能把原题一字不差还原，所以这里更适合看成：

- 题型回忆
- 高频考点回忆
- 按原卷风格整理出来的一套模拟题

如果后面还有人准备类似复试，这篇至少可以帮忙建立一个范围感。

---

## 我记得比较清楚的几个结论

先说最重要的几个点：

- **明确不考 STL**
- 笔试更偏基础和经典题型
- 类与对象、构造析构、继承、多态、递归、文件读写都很重要
- 题目不偏，但细节很多，尤其是程序输出题

也就是说，这套题不是考你会不会炫技，而是考你基础到底稳不稳。

---

## 我记得的笔试题型

按我现在还能回忆起来的，笔试大概是下面这些：

### 1. 读程序题：6 道

这一部分都是常见题型，但不代表简单。

我印象比较深的是：

- 有一道递归题递了三层
- 最后输出有十几条
- 如果平时只是会写递归，不会按调用过程分析输出，很容易乱

这一类读程序题通常会混着考：

- 构造函数和析构函数调用顺序
- 继承和组合下的输出顺序
- 递归调用过程
- 静态变量或全局变量变化

所以“看懂程序”和“能快速写出输出结果”完全是两回事。

### 2. 程序填空题：2 道

这一部分我记得有一道是**文件读写填空**。

这说明老师至少默认你要会：

- `ifstream`
- `ofstream`
- 文件打开、关闭
- 基本输入输出格式

另一道填空我记不清具体内容了，但整体感觉也是比较基础，不是那种特别偏的题。

### 3. 类设计题：1 道

这个我印象很深，应该是两部分：

- 一个 `String`
- 一个 `Animal`

其中 `Animal` 那题我记得大概是：

- 先设计一个 `Animal` 基类
- 再设计几个具体动物类继承 `Animal`
- 每种动物发出不同的叫声

我印象里好像是 4 个种类。

这题本质上考的是：

- 类设计
- 继承
- 虚函数
- 多态

而 `String` 那题大概率就是考：

- 构造函数
- 拷贝构造
- 析构函数
- 深拷贝

### 4. 简答题：2 道

这一部分不是写大段代码，而是看你对概念和实现思路清不清楚。

我记得其中一道是：

- **C++ 大数存储**
- 还要考虑**正负号**

我当时写的是数组实现，大概思路就是：

- 用数组存每一位
- 低位在前或高位在前都可以，但要统一
- 用额外变量记录符号

这一类题不一定要求你把完整高精度类一行不落写出来，但至少要把数据结构和加减的处理思路说清楚。

---

## 结合回忆，我觉得复习重点应该放在哪

如果按这套题型反推，复试 C++ 笔试最值得优先准备的是这些：

### 第一层：最优先

- 类与对象
- 构造函数、析构函数
- 拷贝构造、赋值运算符
- 继承与多态
- 递归

### 第二层：也要准备

- 文件读写
- 虚函数
- 程序输出题
- 简单类设计题

### 第三层：不用花太多时间

- STL

至少按我这场来看，**STL 明确不考**，那就不要把有限时间大量堆在 `vector`、`map`、算法模板这些地方。

---

## 按这场风格整理的一套模拟题

下面这套不是原题复刻，而是我按当时那张卷子的风格整理的。

---

## 模拟题一：读程序题

### 题目 1：构造、析构和继承

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    Animal() { cout << "Animal ctor" << endl; }
    ~Animal() { cout << "Animal dtor" << endl; }
};

class Dog : public Animal {
public:
    Dog() { cout << "Dog ctor" << endl; }
    ~Dog() { cout << "Dog dtor" << endl; }
};

int main() {
    Dog d;
    return 0;
}
```

### 参考答案

```cpp
Animal ctor
Dog ctor
Dog dtor
Animal dtor
```

### 这题考什么

- 父类先构造
- 子类后构造
- 析构顺序反过来

---

### 题目 2：递归输出

```cpp
#include <iostream>
using namespace std;

void fun(int n) {
    cout << "enter " << n << endl;
    if (n > 0) {
        fun(n - 1);
    }
    cout << "leave " << n << endl;
}

int main() {
    fun(3);
    return 0;
}
```

### 参考答案

```cpp
enter 3
enter 2
enter 1
enter 0
leave 0
leave 1
leave 2
leave 3
```

### 这题考什么

这就是那类很容易“看着简单，写输出时乱掉”的递归题。

判断方法：

- 先看递归调用前输出什么
- 再看递归结束后输出什么
- 进入递归和退出递归是两条线

如果题目再套一层循环或者再多一次递归，输出条数马上就很多。

---

### 题目 3：组合对象顺序

```cpp
#include <iostream>
using namespace std;

class A {
public:
    A() { cout << "A "; }
    ~A() { cout << "~A "; }
};

class B {
public:
    A a1;
    A a2;
    B() { cout << "B "; }
    ~B() { cout << "~B "; }
};

int main() {
    B b;
    return 0;
}
```

### 参考答案

```cpp
A A B ~B ~A ~A
```

### 这题考什么

- 成员对象按声明顺序构造
- 按逆序析构

---

## 模拟题二：程序填空题

### 题目 4：文件读写填空

补全下面程序，使其把 `input.txt` 中的整数读出来，并写入 `output.txt`，每个整数占一行。

```cpp
#include <iostream>
#include <fstream>
using namespace std;

int main() {
    ______ fin("input.txt");
    ______ fout("output.txt");

    int x;
    while (fin >> x) {
        fout << x << ______;
    }

    fin.______;
    fout.______;
    return 0;
}
```

### 参考答案

```cpp
ifstream
ofstream
endl
close()
close()
```

### 这题考什么

就是基础文件读写，不复杂，但你平时如果没手写过，考场上很容易把类名和成员函数写混。

---

### 题目 5：构造函数初始化列表填空

```cpp
class Point {
private:
    int x;
    int y;
public:
    Point(int a, int b) : ______(a), ______(b) {}
};
```

### 参考答案

```cpp
x
y
```

### 这题考什么

初始化列表是高频点，尤其是类设计题里经常顺手就会用到。

---

## 模拟题三：类设计题

### 题目 6：设计一个简化版 String 类

设计一个 `String` 类，包含一个字符指针成员，要求实现：

- 构造函数
- 拷贝构造函数
- 析构函数
- 输出字符串内容的成员函数

### 参考答案

```cpp
#include <iostream>
#include <cstring>
using namespace std;

class String {
private:
    char* str;
public:
    String(const char* s = "") {
        str = new char[strlen(s) + 1];
        strcpy(str, s);
    }

    String(const String& other) {
        str = new char[strlen(other.str) + 1];
        strcpy(str, other.str);
    }

    ~String() {
        delete[] str;
    }

    void show() {
        cout << str << endl;
    }
};
```

### 这题考什么

- 动态内存申请
- 深拷贝
- 析构释放

这类题和复试笔试风格很接近，属于必会。

---

### 题目 7：设计 Animal 类层次

定义一个 `Animal` 基类，包含虚函数 `speak()`。  
再定义 4 个派生类：`Dog`、`Cat`、`Duck`、`Cow`，每个类输出不同叫声。

### 参考答案

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    virtual void speak() {
        cout << "Animal sound" << endl;
    }
    virtual ~Animal() {}
};

class Dog : public Animal {
public:
    void speak() override {
        cout << "wang wang" << endl;
    }
};

class Cat : public Animal {
public:
    void speak() override {
        cout << "miao miao" << endl;
    }
};

class Duck : public Animal {
public:
    void speak() override {
        cout << "ga ga" << endl;
    }
};

class Cow : public Animal {
public:
    void speak() override {
        cout << "moo moo" << endl;
    }
};

int main() {
    Animal* p[4];
    p[0] = new Dog();
    p[1] = new Cat();
    p[2] = new Duck();
    p[3] = new Cow();

    for (int i = 0; i < 4; i++) {
        p[i]->speak();
        delete p[i];
    }
    return 0;
}
```

### 这题考什么

- 基类和派生类
- 虚函数
- 多态
- 虚析构函数

这就是很标准的复试笔试类设计题。

---

## 模拟题四：简答题

### 题目 8：简述 C++ 中大数存储的基本实现思路，并说明如何处理正负号

### 参考答案思路

可以这样答：

1. 普通整型有范围限制，超出后不能直接存储大整数
2. 可以用数组或字符串逐位存储数字
3. 一般为了方便计算，可以把低位放在数组前面
4. 用一个额外变量记录符号，比如：
   - `1` 表示正数
   - `-1` 表示负数
5. 加减运算时要分情况讨论：
   - 同号相加，结果同号
   - 异号相减，本质转化为绝对值比较后再做减法

如果是我自己在考场上写，我会优先写“数组实现”，因为表达最直观，也容易说明正负号怎么处理。

---

### 题目 9：简述 C++ 多态的实现机制

### 参考答案思路

可以按下面几点写：

1. 多态分为编译时多态和运行时多态
2. 编译时多态主要体现在函数重载和模板
3. 运行时多态主要依靠虚函数实现
4. 含虚函数的类通常会维护一张虚函数表
5. 对象内部通过虚指针关联虚表
6. 当父类指针指向子类对象并调用虚函数时，会在运行时根据实际对象类型找到对应函数

这道题不一定要求你把虚表底层机制说得特别深，但最少要把“虚函数表 + 虚指针 + 运行时绑定”这三件事说清楚。

---

## 如果按这场风格准备，我建议这样分配时间

### 第一优先级

- 构造函数、析构函数
- 拷贝构造、赋值运算符
- 继承和多态
- 程序输出题
- 递归

### 第二优先级

- 文件读写
- 简单类设计
- 虚函数和虚析构

### 可以少花时间的部分

- STL

因为至少按我这次的情况，笔试**明确不考 STL**。

---

## 最后总结

这场复试笔试给我的感觉是：范围不算偏，但基础要很稳。

最容易丢分的地方不是你完全不会的题，而是你“看起来会，其实写不利索”的题，比如：

- 递归输出
- 构造析构顺序
- 深拷贝
- 文件读写
- 多态类设计

所以如果后面还有人准备这类复试，我觉得最有效的方式不是疯狂看新资料，而是把这些经典题型自己动手写几遍。

如果后面我又想起更具体的原题细节，我会继续补在这篇里。
