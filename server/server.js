const popbill = require('popbill');

exports = {
  getTemplateData: async function (props) {
    console.log("Started backend",props);
    console.log("props.iparams.LinkID",props.iparams.linkId)

    popbill.config({
      LinkID: props.iparams.linkId,
      SecretKey: props.iparams.secretKey,
      IsTest: false,
      IPRestrictOnOff: true,
      UseStaticIP: false,
      UseLocalTimeYN: true,
      defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
      }
    });

    function listATSTemplateAsync(businessRegistrationNumber, senderKey, kakaoService) {
      return new Promise((resolve, reject) => {
        console.log("kakaoService:", kakaoService);
        kakaoService.listATSTemplate(
          businessRegistrationNumber,
          senderKey,
          function (response) {
            console.log("Logging template response");
            try {
              const filteredResponse = response.map(res => ({
                templateName: res.templateName,
                template: res.template
              }));
              resolve(filteredResponse);
            } catch (error) {
              reject(error);
            }
          },
          function (error) {
            console.log('Error listing ATS templates:', error);
            reject(error);
          }
        );
      });
    }

    try {
      var kakaoService = popbill.KakaoService();
      const businessRegistrationNumber = props.iparams.businessRegistrationNumber; // Replace with your actual business registration number
      const senderKey = 'GENTLEMONSTER';

      const allTemplates = await listATSTemplateAsync(businessRegistrationNumber, senderKey, kakaoService);
      console.log('ATS Templates:', allTemplates.length);
      renderData(null, allTemplates); // Render or process the data
    } catch (err) {
      console.error("Error processing CRM data:", err);
    }
  },
  sendLMSToPopBill: async function (request) {
    console.log("sendlms to popbill", request)
    popbill.config({
      LinkID: request.iparams.linkId,
      SecretKey: request.iparams.secretKey,
      IsTest: false,
      IPRestrictOnOff: true,
      UseStaticIP: false,
      UseLocalTimeYN: true,
      defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
      }
    });

    function sendLMS(businessRegistrationNumber, Sender, Receiver, ReceiverName, Subject, Contents, SenderName, messageService) {
      return new Promise((resolve, reject) => {
        console.log("kakaoService:", businessRegistrationNumber, Sender, Receiver, ReceiverName, Subject, Contents, false, SenderName);
        // (CorpNum, Sender, Receiver, ReceiverName, Subject, Contents, "20180811161016", false, SenderName, "test", "GENTLMONSTER")
        messageService.sendLMS(businessRegistrationNumber, Sender, Receiver, ReceiverName, Subject, Contents, false, SenderName,
          function (response) {
            console.log("response successfull", response);
            resolve(response)
          }, function (error) {
            console.log(error);
            reject(error)
          })
        // messageService.getMessages(businessRegistrationNumber, "024080121000000002", "GENTLEMONSTER", function (response) {
        //   console.log("response GET MESSAGES successfull", response);
        // }, function (error) {
        //   console.log(error);
        // })
      });
    }

    try {
      var messageService = popbill.MessageService();
      const businessRegistrationNumber = request.iparams.businessRegistrationNumber; // Replace with your actual business registration number
      const Sender = '1644-1246';
      const Receiver = '01041737335';
      const ReceiverName = "TEst"
      const Subject = "Test Subject"
      const Contents = request.templateParagraph
      const SenderName = request.senderName
      // messageService.sendLMS("1198638589", "1644-1246", "01041737335", ReceiverName, Subject, Contents, reserveDT, false, SenderName, success, error)

      const postResponse = await sendLMS(businessRegistrationNumber, Sender, Receiver, ReceiverName, Subject, Contents, SenderName,
        messageService
      );
      console.log('postResponse Templates:', postResponse);
      renderData(null, postResponse); // Render or process the data
    } catch (err) {
      console.error("Error processing CRM data:", err);
    }
  }
}
