# TIC俱乐部2019年自动邮件发送脚本

## Usage
在根目录下创建`configure.js`，各字段含义如下：

```
module.exports = {
    user: 发件邮箱地址,
    pw: 发件邮箱密码,
    replyTo: 对方直接回复的转发邮箱地址,
    wenjuanURL: 邮件中的“面试确认回执”的腾讯问卷地址,
    group: q群之类的信息
}
```
## data

数据的结构应该如同2019年问卷的格式一致，即第10项为对方的邮箱地址。
详见：[`data-example/data.csv`](/data-example/data.csv)。

## run
在根目录下创建`data.csv`，仿造[`data-example/data.csv`](/data-example/data.csv)填补数据。

- 运行 `node ./main.js`，自动发送邮件。

> 注意，文件需要以UTF8编码。