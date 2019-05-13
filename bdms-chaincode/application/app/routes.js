//SPDX-License-Identifier: Apache-2.0

var papercontract = require('./controller.js'); 

module.exports = function(app){
   
  app.get('/issue/:paper', function(req, res){  // 상업용 용지 발행 
    papercontract.issue(req, res);
  });
  app.get('/buy/:paper', function(req, res){ // 상업용 용지 구매(거래)
    papercontract.buy(req, res);
  });
  app.get('/redeem/:paper', function(req, res){ // 상업용 용지 사용 
    papercontract.redeem(req, res);
  });
  app.get('/get_paper/:id', function(req, res){ // 상업용 용지의 최신상태 가져오기 
    papercontract.get_paper(req, res);
  });
}
 

