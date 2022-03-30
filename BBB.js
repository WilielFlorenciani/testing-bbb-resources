const bbb = require("bigbluebutton-js");
const axios = require("axios")
const _ = require("lodash/fp");

class BBB {
  constructor(url, secret) {
    this.url = url;
    this.secret = secret;
  }

  

  async bbbApiQuery(url) {
    const response = axios.get(url);
    return Promise.resolve(response);
  }

  getSHA1(urlsum){
    var crypto = require('crypto')
    var shasum = crypto.createHash('sha1')
    shasum.update(urlsum)
    return shasum.digest('hex')
  }

  getBBBURL(method){
    return "http://" + this.url + "/" + method;
  }

  async getMeetings() {
    let call = "getMeetings";
    let sha1 = this.getSHA1(call+params+process.env.BBB_SECRET);
    return this.bbbApiQuery(this.getBBBURL(call+"?"+"checksum="+sha1));
  }

  async getMeetingInfo(meetingId) {
    let call = "getMeetingInfo";
    let params = "meetingID="+meetingId;
    let sha1 = this.getSHA1(call+params+this.secret);
    return this.bbbApiQuery(this.getBBBURL(call+"?"+params+"&checksum="+sha1));
  }

  async getAttendeePassword(meetingId) {
    return this.getMeetingInfo(meetingId).then(_.get("attendeePW"));
  }

  async getModeratorPassword(meetingId) {
    let result = "mp";;
    // console.log("Here comes the moderator password\n\n\n" + result + "\n\n\n")
    return result;
  }

  getJoinUrl(username, meetingID, password) {
    let call = "join";
    let params = "fullName="+username+"&meetingID="+meetingID+"&password="+password;
    let sha1 = this.getSHA1(call+params+this.secret);
    let result = this.getBBBURL(call+"?"+params+"&checksum="+sha1);
    // console.log("Here comes the result\n\n\n" + result + "\n\n\n")
    return result;
  }

  create(meetingName, meetingID, attendeePW, moderatorPW){
    let call = "create";
    let params = "name="+meetingName+"&meetingID="+meetingID+"&attendeePW="+attendeePW+"&moderatorPW="+moderatorPW;
    let sha1 = this.getSHA1(call+params+this.secret);
    return this.getBBBURL(call+"?"+params+"&checksum="+sha1);
  }
}

module.exports = BBB;
