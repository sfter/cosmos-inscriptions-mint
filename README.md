# injs 铭文自动化 Mint 脚本

## 🛠 使用说明

### Step 1: 首先安装 nodejs

先去 Nodejs 官网下载安装自己电脑操作系统对应的版本

```bash
https://nodejs.org/en
```

然后看一下安装的版本，是否安装成功

```bash
node -v
npm -v
```

如果你更喜欢使用 yarn 则安装 yarn
```bash
npm i -g yarn
```

### Step 2: 下载脚本源代码
先用 git clone 源代码到本地
```bash
git clone https://github.com/sfter/cosmos-inscriptions-mint.git

cd cosmos-inscriptions-mint
```
如果是 Windows 电脑没有安装 git，先去下面网站下载安装 git 软件
```bash
https://gitforwindows.org
```

### Step 3: 重命名当前目录下的 config.injs.example.js 为 config.js 文件
```bash
cp config.injs.example.js config.js
```

### Step 4: 修改当前目录下的 config.js 配置文件
主要配置以下几个参数，其它的参数不需要修改，大多数时候其实你只修改 RPC 这个参数，最好使用私人节点。
```javascript
// 这下面的配置根据当前网络情况进行调整
// injective RPC 结点服务器地址
// 可以从 https://cointool.app/rpcServer/cosmos?name=injective 获取
// 节点如果报错，就打开上面网址选择一个可用的 RPC 服务器地址替换
export const RPC = "https://injective-rpc.lavenderfive.com";

// GAS 费修改，根据当前网络情况视频情况调整
export const GAS = 150000;

// 铸造原生代币的交易费用
export const FEE_NATIVE = 0.0003;

// 自己给自己的转帐金额（原来是 0.03，现在免费了，只要转任意金额就行）
export const MINT_AMOUNT_NATIVE = 0.0000000001;

// mint 参数配置
// injs 铭文的 base64 编号，注意一定要保持跟官方一致，具体到 https://docs.injs.ink/mint-injs 查看。
// data:,{"p":"injrc-20","op":"mint","tick":"INJS","amt":"1000"}
// 先前是1张2000个，现在改成了 1000个
export const MEMO =
    "ZGF0YToseyJwIjoiaW5qcmMtMjAiLCJvcCI6Im1pbnQiLCJ0aWNrIjoiSU5KUyIsImFtdCI6IjEwMDAifQ==";
```

### Step 5: 安装依赖包
```bash
npm i
```
or
```bash
yarn install
```

### Step 6: 运行 Mint 脚本程序
```shell
node scripts/mint.js
```
or
```shell
npm run mint
```
or
```shell
yarn mint
```
