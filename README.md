<h1 align="center">planet-cli</h1>

优点：

- 一行命令打包 react 组件库,同时支持 UMD、CJS、ESM 三种规范, 打包方式等同 antd
- 一行命令打包工具库(ts、js)

## Install

use `npm`

```node
npm install @planet-cli --save-dev
```

or use `yarn`

```node
yarn add @planet-cli --dev
```

## Usage

```node
planet build [options]   打包编译库
planet --help            查看帮助信息
```

### Options

- `--entry`
  - CJS 和 ESM 打包入口目录,默认是 src
- `--entry-umd`
  - UMD 打包入口文件,默认是 src/index.ts
- `--mode cjs`
  - 打包成 CJS 规范
- `--mode esm`
  - 打包成 ESM 规范
- `--mode umd`
  - 打包成 UMD 模式
- `--less-to-css`
  - 是否将 Less 文件转换为 CSS 文件,默认是`true`
- `--copy-less`
  - 是否在打包后生成一份 Less 的源文件,默认是`true`
- `-out-dir-umd`
  - 输出 UMD 格式的目录,默认是`./dist`
- `--out-dir-cjs`
  - 输出 CJS 格式的目录,默认`./lib"`
- `--out-dir-esm`
  - 输出 ESM 格式的目录,默认是`./esm`

### Demo

打包成 ESM 格式

```shell
planet build --mode esm
```

打包成 CJS 格式

```shell
planet build --mode cjs
```

打包成 UMD 格式

```shell
planet build --mode umd
```

需要同时编译 Less 文件, 只需要在命令后加上 --less-to-css 即可(默认开启),
CSS 文件的输出目录是 ESM 和 CJS 规范各自的输出目录 

```shell
planet build --mode esm --less-to-css --copy-less
```

打包类型文件
-tp 是 tsconfig.json 文件路径

```shell
planet build -tp ./tsconfig.json
```

完整演示

```javascript
 "scripts": {
    "build:types": "planet build -tp ./tsconfig.json",
    "build:umd": "planet build --mode umd --less-to-css",
    "build:es": "planet build --mode esm --less-to-css --copy-less",
    "build:cjs": "planet build --mode cjs --less-to-css --copy-less",
    "build": "yarn build:umd && yarn build:cjs && yarn build:es && yarn build:types"
  }
```
