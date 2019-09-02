const fs = require('fs');
const nodemailer = require('nodemailer');
const chalk = require('chalk');
const configure = require('./configure.js'); // {configure.user, configure.pw, replyTo = configure.replyTo}
const qcode = require('./qcodeBase64.js'); // 一个Base64编码的二维码

let apartment = '技术部'; // 面试时间

console.log(chalk.blue('请确保offer.txt文件存在且以UTF8编码\n'), configure, '\n', apartment, '\n');

const transporter = nodemailer.createTransport({
  host: 'smtpdm.aliyun.com',
  port: 80,
  secure: false,
  auth: {
    user: configure.user, // 账户
    pass: configure.pw // 密码
  }
});

const replyTo = configure.replyTo; // 回执邮箱

// ------------------- //

const html =
  `同学您好：<br/><br/>
  &nbsp;&nbsp;我们很高兴地通知您——您的简历和面试结果通过了西电TIC主席团的一致认定，现诚挚地邀请您成为<b>西电TIC${apartment}</b>的一员！<br/><br/>
  &nbsp;&nbsp;我们欢迎您的到来，您可以加入本届的俱乐部技术部成员Q群：<u>${configure.group}</u>(或下方扫码)，以获取更多俱乐部的内部资讯和后期活动通知。<br/><br/>
  &nbsp;&nbsp;我们的俱乐部活动室在北校区，不久后我们将召开第一次见面会；后续的各类活动也主要集中在北校区活动室开展。届时，南校区的同学请注意校车时间和来时安全，如果有特殊问题，可以直接联系各部长。<br/><br/>
  &nbsp;&nbsp;<i>活动室地址：北校区计算机学院(主楼IV区)西边的楼——计算中心(乒乓球场正北)，从一楼东侧门(303室)进入。</i><br/><br/>
  <p align="center">
    <img src="${qcode}"/><br/>
    <i>请信任邮件以显示二维码</i>
  </p>
  <hr/>
  <ul>
    <li>您收到此邮件是因为您填写了TIC的报名表且通过了面试。</li>
    <li>本邮件由可爱的小机器人自动发送，请不要直接进行回复。 o(*￣▽￣*)ブ</li>
    <li>若有任何问题，请联系：<code>${replyTo}</code> 或在招新群中联系部长/管理员。</li>
    <li>如果不是您本人操作请忽略此邮件，您的邮箱不会再受到任何打扰，同时我们对此表示歉意。 <(__)> </li>
  </ul>`;


(function(){
  let data = fs.readFileSync('./offer.txt').toString();
  for(let u of data.split('\n')){
    let email = u.replace('\t', '');
    email = u.replace('\r', '');
    if(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/gi.test(email)){
      send(email)
        .then(()=>{
          console.log(chalk.green(`Success:${email} \n`));
        })
        .catch(err => {
          console.error(chalk.red(`Fail:${email} \n ${err}\n`));
        });
    } else{
      console.error(chalk.yellow(`Email Invalid:${email}\n`));
    }
  }
})();


async function send(email) {
  let info = await transporter.sendMail({
    from: '"西电TIC俱乐部" <tech@noreply.xdtic.club>',
    to: email,
    subject: '西电TIC俱乐部面试结果通知',
    html,
    replyTo
  });

  return info.messageId;
}