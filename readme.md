## 企业微信接入ChatGPT
本项目是一个基于Node.js Express的企业微信接入ChatGPT的示例应用，旨在帮助开发者快速了解如何在企业微信中集成自然语言处理工具ChatGPT。

### 唠在开头
目前只实现了一个企业多个提问只走一个会话，这就导致无法精确读取上下文信息给你更精准的回复。
###### 我也只是最近在找工作，于是开源想收获一些赞，死马当活马医，如果
#### 100✨ star 我就迭代一版多会话版本，做到让chatgpt能正常读取企业微信上下文
### 简介
ChatGPT是一款基于人工智能技术的自然语言处理工具，可以用于文本生成、问答、聊天机器人等应用场景。本项目将演示如何将ChatGPT集成到企业微信中，实现自然语言处理的应用。

### 安装
要使用本项目，您需要在ChatGPT网站上注册账号并获取一个API密钥。同时，您还需要在企业微信中创建一个应用，并获取应用的ID和密钥。另外，您需要为应用配置一个用于接收消息的Token和AES Key。

获取以上信息后，您需要将它们填入到index.js文件中的相应位置。（注意要配置接收消息的API）

示例代码如下：
``` javascript
const TOKEN="xxxxxxxxxxxxxxx" //应用-》接收消息接口配置界面生成的TOKEN
const EncodingAESKey="xxxxxxxxxxxxxxx" //应用-》接收消息接口配置界面生成的密钥
const T='xxxxxxxxxxxxxxx'//chatgpt APIkey
const CORPID='xxxxxxxxxxxxxxx'//企业微信 企业的id
const CORPSECRET='xxxxxxxxxxxxxxx'//企业微信 创建应用的应用密钥
const AGENID='xxxxxxxxxxxxxxx'//企业微信 创建应用的应用id
```

在填写完以上信息后，您可以将index.js文件部署到您的服务器上，并通过npm install安装项目所需的依赖。

### 使用
启动应用后，您需要将应用的URL配置到企业微信中，以便企业微信向应用发送消息。具体步骤如下：

在企业微信后台中，点击“管理工具”->“应用管理”，选择您的应用。
点击“应用信息”->“修改”，在“应用详情”页面中，将“应用地址”设置为您的服务器地址。
在“应用信息”->“基础信息”页面中，记录“Token”和“AES密钥”，并将其填写到index.js文件中。
在配置完成后，您可以向企业微信发送消息，ChatGPT将自动处理消息并返回自然语言处理结果。

### 常见问题
#### 如何获取ChatGPT API密钥？
请访问ChatGPT网站（https://www.chatgpt.com/），注册账号并登录后，即可在用户中心中生成API密钥。

#### 为什么收到的回复是乱码？
请检查index.js文件中AES Key是否正确，确保与企业微信后台中的AES Key一致。

#### 如何部署应用到生产环境？
本项目仅作为示例代码，未考虑安全性、稳定性等方面的问题。如果您需要将本项目部署到生产环境中，请参考Node.js和企业微信的官方文档，确保应用的安全和稳定。
