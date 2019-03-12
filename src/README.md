**目录结构：**

```
.
├── README.md
├── app-shim.d.ts
├── app.scss
├── app.tsx
├── assets
│   ├── iconfont
│   ├── images
│   └── scss
├── components
├── config
│   ├── index.ts
│   ├── requestConfig.ts
│   └── taroConfig.ts
├── index.html
├── models
│   └── index.ts
├── pages
│   └── index
│       ├── config.ts
│       ├── index.interface.ts
│       ├── index.scss
│       ├── index.tsx
│       ├── model.ts
│       └── service.ts
├── types
└── utils
    ├── common.ts
    ├── dva.ts
    ├── logger.ts
    ├── request.ts
    └── tips.ts

```


-  ```asssets``` : 静态资源，如images、scss、iconfont...
-  ```components``` : 编写共用组件
-  ```config``` : 项目配置文件
-  ```models``` : dva插件```model```函数引用或共用的js
-  ```types``` : 公共typescript类型声明
-  ```utils``` : 封装的插件

---

**如何新建：**

-  ```\pages``` : 在命令行运行 ```npm run tep [your page name]```, 然后再 ```app.tsx``` 中进行声明
-  ```\components``` : 在命令行运行 ```npm run com [your component name]```

---

**如何写接口：**
- 接口及model需要分别在```\config\requestConfig.ts```和```\models\index.ts```中声明
