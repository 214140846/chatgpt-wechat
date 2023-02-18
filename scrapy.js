/*
 * @Author: Cupid.Z
 * @Date: 2022-10-22 10:26:02
 * @LastEditors: Cupid.Z
 * @LastEditTime: 2022-10-23 21:22:35
 * @Description: file content
 */
const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const wecom = require('@wecom/crypto');
var parseString = require('xml2js').parseString;

const{getSignature,decrypt}=wecom;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const TOKEN="Gy1dXK82b4YVaXnX4A9qm4tY"
const EncodingAESKey="4OBN9WkuY66RvwOcMVPt29f9KIXVnEk9NAn7BT7iViO"
const T='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'//chatgptkey
const CORPID='ww1587623f6c0cc539'
const CORPSECRET='QEJ1yT41SUtCqfe7OZVG88UA5qvd7S3_bcnIw0IAo7I'
const AGENID='1000014'


// const return_data=(code,msg,data)=>{return {code:code, msg:msg,data:data}}
//消息校验
app.get('/', async (req, res) => {

    const{msg_signature,timestamp,nonce,echostr}=req.query
    console.log(req.query,'请求参数')
    if(echostr){
        const signature = getSignature(TOKEN, timestamp, nonce, echostr);
        if(!signature===msg_signature)return;
        const sign=decrypt(EncodingAESKey,echostr);
        res.send(sign.message)
    }

});
//接收消息
app.post('/', async (req, res) => {

    handleRequest(req,res);

});
function handleRequest(req, res) {
    console.log('\n-- INCOMING REQUEST AT ' + new Date().toISOString());

    const msg_signature = decodeURIComponent(req.query.msg_signature);
    const timestamp = decodeURIComponent(req.query.timestamp);
    const nonce = decodeURIComponent(req.query.nonce);
    console.log("msg_signature:" + msg_signature)
    console.log("timestamp:" + timestamp)
    console.log("nonce:" + nonce)

    var reqData = [];
    var size = 0;
    req.on('data', function (data) {
        //console.log('>>>req on');
        reqData.push(data);
        size += data.length;
    });
    req.on('end', function () {
        var reqData2 = Buffer.concat(reqData, size);
        console.log("reqData2:" + reqData2)
        parseString(reqData2, function (err, result) {
            if (err) {
                console.log("xml parse failure")
            }
            else {
                console.log("xml parse success")

                // var ToUserName = "" + result.xml.ToUserName;
                var Encrypt = "" + result.xml.Encrypt;
                // var AgentID = "" + result.xml.AgentID;
                //console.log("ToUserName:" + ToUserName);
                //console.log("Encrypt:" + Encrypt);
                //console.log("AgentID:" + AgentID);

                var rand_msg = decrypt(EncodingAESKey, Encrypt)
                var msg = rand_msg["message"]
                parseString("" + msg, function (err1, result1) {
                    if (err1) {
                        console.log("message xml parse failure")
                    }
                    else {
                        console.log("message xml parse success")
                        var fromUserName = "" + result1.xml.FromUserName;
                        var MsgType = "" + result1.xml.MsgType; //text event(菜单)
                        var MsgContent = "" + result1.xml.Content;
                        var EventKey = "" + result1.xml.EventKey; //每个菜单的key
                        console.log("fromUserName:" + fromUserName)
                        console.log("MsgType:" + MsgType)
                        console.log("MsgContent:" + MsgContent)
                        console.log("EventKey:" + EventKey)
                        chatGPTAPI(MsgContent,fromUserName);
                    }
                });

            }

        });
    });
    res.send("ok");
}

const chatGPTAPI=async (msgContent,toUserName)=>{
    let token=''
    axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${CORPID}&corpsecret=${CORPSECRET}`).then((res)=>{token=res.data.access_token})
    const {data}=await axios.post('https://api.openai.com/v1/completions',{
        prompt: msgContent, max_tokens: 2048, model: "text-davinci-003"
    }, {
        headers: {'content-type': 'application/json', 'Authorization': 'Bearer ' + T}
    })
    const {choices}=data;
    console.log(choices,'chatGPT返回内容')
    choices.forEach(item=>{
        megBackPerson(item.text,toUserName,token)
    })
}
const megBackPerson=(chatContent,toPerson,ACCESS_TOKEN)=>{
    console.log(chatContent,'发送以下内容')
    axios.post(`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${ACCESS_TOKEN}`,{
        msgtype:'text',
        agentid:AGENID,
        text:{
            content:chatContent,
        },
        touser:toPerson
    }).then(res=>{console.log(`发送消息给${toPerson}`)}).catch(err=>console.log(err))
}

const port =  80;
app.listen(6666, async () => {
    console.log('Hello world listening on port', port);

});
