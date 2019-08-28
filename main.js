const fs = require('fs');
const nodemailer = require('nodemailer');
const chalk = require('chalk');
const configure = require('./configure.js'); // {configure.user, configure.pw, replyTo = configure.replyTo}

console.log(chalk.blue('请确保data.csv文件存在且以UTF8编码\n'), configure);

let time = '2019年08月31日(周六)下午14:00'; // 面试时间

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
const wenjuanURL = configure.wenjuanURL; // 面试确认问卷的地址

// ------------------- //

const html =
  `同学您好：<br/>
  &nbsp;&nbsp;您的简历已通过筛选，现邀请您于<u>${time}</u>到俱乐部活动室参与面试。你可以携带任何补充材料/简历来参与面试。<br/><br/>
  &nbsp;&nbsp;活动室地址：北校区计算机学院(主楼IV区)西边的楼，从一楼东侧门进入(乒乓球场正北)——<i>你可以在下方的回执问卷末尾获取相应的校园地图</i>。<br/><br/>
  &nbsp;&nbsp;<b>请务必填写</b>以下的表单确认、修改面试时间及告知我们您是否参加面试。<br/><br/>
  ★&nbsp;<a href="${wenjuanURL}" target="_blank" ref="noopener noreferrer">点此打开</a>腾讯问卷填写面试确认回执。<br/>
  <br/>
  <hr/>
  <ul>
    <li>您收到此邮件是因为您填写了TIC的报名表。</li>
    <li>本邮件由可爱的小机器人自动发送，请不要直接进行回复。 o(*￣▽￣*)ブ</li>
    <li>若有任何问题，请联系：<code>${replyTo}</code> 或在招新群中联系部长/管理员。</li>
    <li>如果不是您本人操作请忽略此邮件，您的邮箱不会再受到任何打扰，同时我们对此表示歉意。 <(__)> </li>
  </ul>`;


(function(){
  let data = fs.readFileSync('./data.csv').toString();
  for(let u of data.split('\n')){

    let email = u.split(',')[9];
    if(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/gi.test(email)){
      send(email)
        .then(()=>{
          console.log(chalk.green(`Success:${email} | ${u}`));
        })
        .catch(err => {
          console.error(chalk.red(`Fail:${u} \n ${err}`));
        });
    } else{
      console.error(chalk.yellow(`Email Invalid:${u}`));
    }
  }
})();


async function send(email) {
  let info = await transporter.sendMail({
    from: '"西电TIC俱乐部" <xdtic@noreply.whiterobe.top>',
    to: email,
    subject: '西电TIC俱乐部面试通知',
    html,
    replyTo,
  });

  return info.messageId;
}