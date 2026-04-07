---
title: 半个月速成复试 C++：重点整理构造函数、析构函数和常见题
date: 2025-04-01 22:10:00
updated: 2025-04-01 22:10:00
tags:
  - Cpp
  - 考研复试
  - 教程
  - 类与对象
categories:
  - 技术教程
cover: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80
---

## 这篇主要写什么

这篇主要记录我准备复试 C++ 时最花时间的一块：构造函数、析构函数、拷贝构造、赋值运算符，以及构造和析构顺序。

我当时复习时间不长，整体大概半个月，所以不可能什么都铺开细讲。最后我的做法是抓高频考点，重点把最容易出程序输出题、手写题和概念题的部分彻底理顺。

其中最费时间的就是这类问题：

- 对象什么时候构造？
- 为什么会先调用父类构造函数？
- 拷贝构造和赋值运算符到底有什么区别？
- 析构函数为什么不能重载？
- 为什么有时候程序没报错，但就是会“炸”在析构上？

这篇不追求完整教材式讲法，重点是把复试里最容易考、最容易混、最容易写错的点单独拎出来。

---

## 第一件事：先把四个概念分开

很多人学不明白，不是因为不会写，而是因为一开始就把几个概念搅在一起了。

### 1. 构造函数

构造函数的作用是：**对象创建时完成初始化**。

特点：

- 函数名和类名相同
- 没有返回值，连 `void` 都不能写
- 对象一创建就自动调用

```cpp
#include <iostream>
using namespace std;

class Student {
public:
    string name;
    int age;

    Student() {
        name = "unknown";
        age = 0;
        cout << "调用了无参构造函数" << endl;
    }
};

int main() {
    Student s;
    cout << s.name << " " << s.age << endl;
    return 0;
}
```

这里 `Student s;` 一执行，对象就创建了，所以构造函数会自动执行。

### 2. 析构函数

析构函数的作用是：**对象生命周期结束时做清理工作**。

特点：

- 名字是 `~类名`
- 没有参数
- 不能重载
- 对象销毁时自动调用

```cpp
#include <iostream>
using namespace std;

class Student {
public:
    Student() {
        cout << "构造函数调用" << endl;
    }

    ~Student() {
        cout << "析构函数调用" << endl;
    }
};

int main() {
    Student s;
    return 0;
}
```

输出：

```cpp
构造函数调用
析构函数调用
```

---

## 第二件事：构造函数可以重载，但析构函数不行

这是非常高频的选择题点。

### 构造函数为什么可以重载？

因为你可能想用不同方式初始化对象。

```cpp
#include <iostream>
using namespace std;

class Point {
public:
    int x, y;

    Point() {
        x = 0;
        y = 0;
    }

    Point(int a, int b) {
        x = a;
        y = b;
    }
};
```

这样既可以写：

```cpp
Point p1;
Point p2(3, 4);
```

### 析构函数为什么不能重载？

因为一个对象“死”的方式只有一种。  
系统只需要知道：这个对象结束时该调用哪个清理函数。

所以析构函数只能有一个。

---

## 第三件事：最推荐用初始化列表

刚学的时候大家都喜欢在构造函数函数体里赋值：

```cpp
class Test {
public:
    int x;
    Test(int a) {
        x = a;
    }
};
```

这没错，但复试更喜欢你理解**初始化列表**：

```cpp
class Test {
public:
    int x;
    Test(int a) : x(a) {}
};
```

### 为什么初始化列表更重要？

因为有些成员**必须**用初始化列表：

- 常量成员 `const`
- 引用成员
- 没有默认构造函数的对象成员

例如：

```cpp
class Test {
public:
    const int x;

    Test(int a) : x(a) {}
};
```

如果你写成：

```cpp
Test(int a) {
    x = a;   // 错误
}
```

就不行，因为 `const` 成员必须在对象创建时就初始化，后面不能再赋值。

---

## 第四件事：拷贝构造和赋值运算符，不是一个东西

这真的是复试笔试最爱考的坑。

### 拷贝构造

拷贝构造函数的作用是：**用一个已存在对象，去初始化一个新对象**。

```cpp
class A {
public:
    int x;

    A(int a) : x(a) {}

    A(const A& other) {
        x = other.x;
        cout << "调用拷贝构造" << endl;
    }
};
```

会触发拷贝构造的情况：

```cpp
A a1(10);
A a2 = a1;
A a3(a1);
```

### 赋值运算符重载

赋值运算符的作用是：**两个都已经存在的对象之间做赋值**。

```cpp
A a1(10);
A a2(20);
a2 = a1;
```

注意：

- `A a2 = a1;` 是初始化，走拷贝构造
- `a2 = a1;` 是赋值，走赋值运算符

这一点特别爱出选择题。

---

## 第五件事：为什么深拷贝会和析构函数绑在一起考

因为如果类里面有动态内存，默认拷贝往往会出事。

看这个例子：

```cpp
#include <iostream>
#include <cstring>
using namespace std;

class StringDemo {
public:
    char* data;

    StringDemo(const char* str) {
        data = new char[strlen(str) + 1];
        strcpy(data, str);
    }

    ~StringDemo() {
        delete[] data;
    }
};

int main() {
    StringDemo s1("hello");
    StringDemo s2 = s1;
    return 0;
}
```

这段代码看起来很正常，但其实很危险。

### 问题在哪？

`s2 = s1` 这里如果没有自己写拷贝构造，系统默认做的是**浅拷贝**。

也就是说：

- `s1.data` 指向一块堆内存
- `s2.data` 也指向同一块堆内存

最后 `s1` 析构一次，`s2` 再析构一次，就会对同一块内存 `delete[]` 两次。

这就是经典的 **double free** 问题。

### 正确写法：深拷贝

```cpp
#include <iostream>
#include <cstring>
using namespace std;

class StringDemo {
public:
    char* data;

    StringDemo(const char* str) {
        data = new char[strlen(str) + 1];
        strcpy(data, str);
        cout << "普通构造" << endl;
    }

    StringDemo(const StringDemo& other) {
        data = new char[strlen(other.data) + 1];
        strcpy(data, other.data);
        cout << "拷贝构造" << endl;
    }

    ~StringDemo() {
        delete[] data;
        cout << "析构函数" << endl;
    }
};

int main() {
    StringDemo s1("hello");
    StringDemo s2 = s1;
    return 0;
}
```

现在每个对象都有自己独立的一份 `data`，析构时就不会互相踩了。

---

## 第六件事：构造和析构的调用顺序必须会背

这部分经常直接考程序输出。

### 1. 局部对象：先构造的后析构

```cpp
#include <iostream>
using namespace std;

class A {
public:
    A() { cout << "A构造" << endl; }
    ~A() { cout << "A析构" << endl; }
};

int main() {
    A a1;
    A a2;
    return 0;
}
```

输出：

```cpp
A构造
A构造
A析构
A析构
```

规律：**后创建，先销毁**，像栈一样。

### 2. 继承：先父类构造，再子类构造

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    Base() { cout << "Base构造" << endl; }
    ~Base() { cout << "Base析构" << endl; }
};

class Derived : public Base {
public:
    Derived() { cout << "Derived构造" << endl; }
    ~Derived() { cout << "Derived析构" << endl; }
};

int main() {
    Derived d;
    return 0;
}
```

输出：

```cpp
Base构造
Derived构造
Derived析构
Base析构
```

规律：

- 构造：先父后子
- 析构：先子后父

### 3. 组合：先成员对象构造，再本类构造

```cpp
#include <iostream>
using namespace std;

class A {
public:
    A() { cout << "A构造" << endl; }
    ~A() { cout << "A析构" << endl; }
};

class B {
public:
    A a;
    B() { cout << "B构造" << endl; }
    ~B() { cout << "B析构" << endl; }
};

int main() {
    B b;
    return 0;
}
```

输出：

```cpp
A构造
B构造
B析构
A析构
```

规律：

- 构造：先成员，后自己
- 析构：先自己，后成员

### 4. 我当时最崩溃的点：3-5 个类嵌套时，析构顺序到底怎么看

这一块我当时真的被搞得很烦。

两个类还好，一旦题目开始这样套：

- `A` 里面有 `B`
- `B` 继承 `C`
- `D` 里面又有 `A` 和 `C`

脑子一下就乱了。

后来我总结出一个特别管用的判断方法：

### 判断口诀

**先看“谁里面包含谁”，再看“谁继承谁”，最后把构造顺序整个反过来，就是析构顺序。**

也就是说：

1. 先把构造顺序老老实实写出来
2. 析构顺序直接反着读

因为对象销毁本质上就是“按创建的逆序回收”。

### 再压缩成一句话

**构造一路向里，析构一路向外。**

比如：

- 有父类，先进去父类
- 有成员对象，先进去成员对象
- 最后才到自己

那析构时就反过来：

- 先析构自己
- 再析构成员
- 最后析构父类

这句话看起来土，但考试的时候真有用。

---

## 第六点五件事：专门讲析构顺序，尤其是多层嵌套

下面这两道题，特别适合用来练“脑中排顺序”。

### 例题 A：三层嵌套，先写构造，再反推析构

```cpp
#include <iostream>
using namespace std;

class A {
public:
    A() { cout << "A构 "; }
    ~A() { cout << "A析 "; }
};

class B {
public:
    A a;
    B() { cout << "B构 "; }
    ~B() { cout << "B析 "; }
};

class C {
public:
    B b;
    A a;
    C() { cout << "C构 "; }
    ~C() { cout << "C析 "; }
};

int main() {
    C c;
    return 0;
}
```

### 第一步：先看构造顺序

创建 `C c;` 时：

1. 先构造成员 `b`
2. 构造 `b` 时，先构造 `b` 里面的 `a`
3. 然后才构造 `B`
4. 再构造 `C` 自己的成员 `a`
5. 最后构造 `C`

所以构造顺序是：

```cpp
A构 B构 A构 C构
```

### 第二步：析构顺序直接反着来

析构顺序就是：

```cpp
C析 A析 B析 A析
```

### 最终输出

```cpp
A构 B构 A构 C构 C析 A析 B析 A析
```

这个题特别适合帮你建立一个感觉：

- 成员对象的析构顺序和构造顺序相反
- 同一个类里的多个成员，也是**按声明顺序构造，按逆序析构**

注意这里 `C` 里的成员声明顺序是：

```cpp
B b;
A a;
```

所以析构时一定是：

1. 先 `C`
2. 再 `a`
3. 再 `b`

不是你想当然的谁看着顺眼先析构谁。

---

### 例题 B：继承 + 组合一起套，最容易把人绕晕

```cpp
#include <iostream>
using namespace std;

class A {
public:
    A() { cout << "A构 "; }
    ~A() { cout << "A析 "; }
};

class B {
public:
    B() { cout << "B构 "; }
    ~B() { cout << "B析 "; }
};

class C : public B {
public:
    A a;
    C() { cout << "C构 "; }
    ~C() { cout << "C析 "; }
};

class D {
public:
    C c;
    B b;
    D() { cout << "D构 "; }
    ~D() { cout << "D析 "; }
};

int main() {
    D d;
    return 0;
}
```

### 先别急着看答案，先拆

创建 `D d;`，先看 `D` 的成员：

```cpp
C c;
B b;
```

所以一定先构造 `c`，再构造 `b`，最后构造 `D`。

然后展开 `c`：

- `C` 继承 `B`，所以先构造父类 `B`
- `C` 里还有成员 `A a`，所以再构造 `A`
- 最后构造 `C`

所以 `c` 的构造顺序是：

```cpp
B构 A构 C构
```

接着构造 `D` 自己的另一个成员 `b`：

```cpp
B构
```

最后构造 `D`：

```cpp
D构
```

### 所以总构造顺序

```cpp
B构 A构 C构 B构 D构
```

### 析构顺序直接倒着写

先析构 `D` 自己：

```cpp
D析
```

然后按成员逆序析构：

1. 先析构 `b`
2. 再析构 `c`

析构 `c` 时，又要按 `C` 的规则：

1. 先析构 `C`
2. 再析构成员 `A`
3. 最后析构父类 `B`

所以总析构顺序是：

```cpp
D析 B析 C析 A析 B析
```

### 最终输出

```cpp
B构 A构 C构 B构 D构 D析 B析 C析 A析 B析
```

---

### 例题 C：五个类嵌套时，我是怎么不让自己乱掉的

这个例子更像考试里真正会把人整懵的题。

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
    B() { cout << "B "; }
    ~B() { cout << "~B "; }
};

class C {
public:
    A a2;
    C() { cout << "C "; }
    ~C() { cout << "~C "; }
};

class D : public B {
public:
    C c;
    D() { cout << "D "; }
    ~D() { cout << "~D "; }
};

class E {
public:
    D d;
    A a3;
    E() { cout << "E "; }
    ~E() { cout << "~E "; }
};

int main() {
    E e;
    return 0;
}
```

### 这种题我建议你这样打草稿

不要试图一眼秒。

直接在草稿纸上写树：

```text
E
|- D
|  |- B
|  |  |- A(a1)
|  |- C
|     |- A(a2)
|- A(a3)
```

然后构造时一路往里走：

1. 构造 `E`
2. 先构造成员 `d`
3. 构造 `d` 的父类 `B`
4. 构造 `B` 的成员 `a1`
5. 构造 `B`
6. 构造 `D` 的成员 `c`
7. 构造 `C` 的成员 `a2`
8. 构造 `C`
9. 构造 `D`
10. 构造 `E` 的成员 `a3`
11. 最后构造 `E`

所以构造顺序：

```cpp
A B A C D A E
```

析构顺序就反过来：

```cpp
~E ~A ~D ~C ~A ~B ~A
```

### 这里最容易错的地方

1. **把继承关系和成员关系混着看**
   一定先区分：谁是父类，谁是成员。

2. **忽略成员声明顺序**
   成员构造顺序看的是声明顺序，不看初始化列表顺序。

3. **析构时忘记“自己先析构”**
   比如 `D` 析构时，不是先析构父类 `B`，而是：
   `D自己 -> 成员 -> 父类`

---

### 最后一个实用技巧：看到 4 层以上嵌套，别心算

我当时最痛苦的地方就在这儿。

题目一复杂，我总想在脑子里硬排，结果经常把自己绕进去。

后面我强制自己这样做：

1. 先画结构
2. 先写构造顺序
3. 再把构造顺序反过来得到析构顺序

这三步虽然笨，但极其稳。

复试笔试不是比谁快，是比谁不出低级错误。  
尤其这种 3-5 个类嵌套的题，你只要顺序不乱，分基本就稳了。

---

## 例题 1：判断输出顺序

```cpp
#include <iostream>
using namespace std;

class A {
public:
    A() { cout << "1"; }
    ~A() { cout << "2"; }
};

class B {
public:
    A a;
    B() { cout << "3"; }
    ~B() { cout << "4"; }
};

int main() {
    B b;
    return 0;
}
```

### 解析

对象 `b` 是 `B` 类对象，而 `B` 里面有一个成员对象 `a`。

所以：

1. 先构造成员对象 `a`，输出 `1`
2. 再构造 `b` 自己，输出 `3`
3. 程序结束，先析构 `b` 自己，输出 `4`
4. 再析构成员对象 `a`，输出 `2`

答案：

```cpp
1342
```

---

## 例题 2：下面哪一句会调用拷贝构造？

```cpp
A a1(10);
A a2(20);
```

四个选项：

```cpp
1. A a3 = a1;
2. a2 = a1;
3. A a4(a1);
4. func(a1);   // 假设按值传参
```

### 解析

会调用拷贝构造的是：

- `A a3 = a1;`
- `A a4(a1);`
- `func(a1);` 按值传参时也会拷贝一份临时对象

不会调用拷贝构造的是：

- `a2 = a1;` 这是赋值

所以如果是多选，答案一般是：**1、3、4**。

---

## 例题 3：为什么这个类会出问题？

```cpp
class Demo {
public:
    int* p;

    Demo(int x) {
        p = new int(x);
    }

    ~Demo() {
        delete p;
    }
};
```

如果写：

```cpp
Demo d1(5);
Demo d2 = d1;
```

### 解析

问题在于默认拷贝构造是浅拷贝。  
两个对象里的 `p` 指向同一块内存。

最终析构时会 `delete` 两次。

### 该怎么改？

要么自己写深拷贝的拷贝构造函数，要么进一步把赋值运算符也一起重载。

这其实就是复试里经常提到的那套东西：

- 析构函数
- 拷贝构造函数
- 赋值运算符重载

如果一个类自己管理资源，这三者通常要成套考虑。

---

## 例题 4：手写一个最简版类，考构造、拷贝、析构

这是很像复试手写题的风格。

### 题目

设计一个 `Book` 类，包含书名（动态申请字符数组）和价格，要求实现：

- 普通构造函数
- 拷贝构造函数
- 析构函数

### 参考答案

```cpp
#include <iostream>
#include <cstring>
using namespace std;

class Book {
private:
    char* title;
    double price;

public:
    Book(const char* t = "", double p = 0) {
        title = new char[strlen(t) + 1];
        strcpy(title, t);
        price = p;
    }

    Book(const Book& other) {
        title = new char[strlen(other.title) + 1];
        strcpy(title, other.title);
        price = other.price;
    }

    ~Book() {
        delete[] title;
    }

    void show() {
        cout << title << " " << price << endl;
    }
};

int main() {
    Book b1("C++ Primer", 88.0);
    Book b2 = b1;
    b1.show();
    b2.show();
    return 0;
}
```

### 这题老师想看什么？

不是看你能不能背整段代码，而是看你是否真的知道：

- 动态内存要自己释放
- 有指针成员时不能只靠默认拷贝
- 拷贝构造必须重新申请空间

---

## 复试时这部分最容易被问的口头题

我把这类问题总结成几句最常见的话。

### 1. 构造函数能不能是虚函数？

不能。

因为虚函数机制依赖对象已经存在，而构造函数本身就是在“创建对象”。

### 2. 析构函数能不能是虚函数？

能，而且**父类析构函数在多态场景下经常应该写成虚函数**。

比如：

```cpp
Base* p = new Derived;
delete p;
```

如果父类析构函数不是虚函数，可能只调用父类析构，不调用子类析构，资源释放就不完整。

### 3. 为什么拷贝构造参数一般写成 `const A&`？

因为：

- 不加引用会再次调用拷贝构造，死循环
- 加 `const` 表示不会修改源对象，也能接收常对象

标准写法就是：

```cpp
A(const A& other)
```

---

## 我最后是怎么把这部分理顺的

我后面不再死记定义，而是强迫自己每次都问三个问题：

1. **对象是什么时候被创建的？**
2. **对象里面有没有资源需要自己管理？**
3. **对象结束时谁来释放资源？**

只要围着这三个问题转，构造、拷贝、析构其实就顺起来了。

比如看到一个类里有 `new`，我脑子里就会立刻响警报：

- 构造函数里申请了资源
- 析构函数里大概率要释放
- 拷贝构造不能偷懒
- 赋值运算符也得小心

这样就不容易被题目绕进去。

---

## 最后给复试突击一个建议

如果你时间很紧，类的构造与析构至少要保证下面这些会：

- 构造函数、析构函数的定义与特点
- 初始化列表
- 拷贝构造与赋值的区别
- 浅拷贝、深拷贝
- 继承和组合下的构造/析构顺序
- 虚析构函数的意义

这几块真的太常考了。

我自己卡了很久，尤其是“为什么析构会出错”和“拷贝构造到底什么时候触发”这两个点。后来一旦顺过来，很多看似复杂的题一下就通了。

如果你复试时间也不长，这一块我建议至少把文中的程序输出题和深拷贝题自己手写一遍。只看不写，考场上还是容易乱。
