import React, { useState, useEffect, useRef } from 'react';
import { FwFormControl, FwSelect, FwTextarea, FwButton, FwForm } from '@freshworks/crayons/react';

const HelloUser = (props) => {
  const [name, setName] = useState("")
  const [paragraphText, setParagraphText] = useState("")
  const formRef = useRef(null)
  const sendMessageButton = useRef(null);
  const textArea = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {

    try {
      console.info("Fetching CRM data");
      const response = await props.client.request.invoke("getCrmData", {});
      console.log("CRM data response:", response);

      if (response) {
        const nameData = response?.response.map((object, index) => ({
          value: `name-${index}`,
          text: object.templateName,
          paragraph: object.template
        }));
        console.log("nameData", nameData)

        setName(nameData)
        setParagraphText()
      }
    } catch (error) {
      console.error("Error fetching CRM data:", error);
    }
  }
  const onSelectChange = (e) => {
    console.log(e.detail);
    setParagraphText(e.detail.meta.selectedOptions[0].paragraph)
  };

  const handleFormSubmit = async (e) => {
    // console.log(await formRef.current.doSubmit(e))
    const { values, isValid, errors } = await formRef.current.doSubmit(e);
    console.log({ result: values, errors });

    if (values.Template) {
      console.log("values template", values.Template)
      try {
        // Destructure required properties from props if needed
        const { client, ...restProps } = props;
        const { user } = await client.data.get("user");

        console.log(user)
        const finalData = { senderName: `${user.first_name} ${user.last_name}`, templateParagraph: values.Template }
        // Perform the asynchronous request
        const response = await client.request.invoke("sendLMSToPopBill", finalData);

        // Handle the response (e.g., update state, trigger UI changes)
        console.log('Request successful:', response);
        if (sendMessageButton.current) {
          sendMessageButton.current.disabled = true; // Disabling the but ton using the ref
        }
        try {
          let data = await props.client.interface.trigger("showNotify", {
            type: "success",
            message: `The Message has been sent successfully ${response.response}`
            /* The "message" should be plain text */
          });
          console.log(data); // success message
        } catch (error) {
          // failure operation
          console.error(error);
        }
      } catch (error) {
        // Handle any errors that occurred during the request
        console.error('Error during request:', error);
        if (sendMessageButton.current) {
          sendMessageButton.current.disabled = true; // Disabling the but ton using the ref
        }
        try {
          let data = await client.interface.trigger("showNotify", {
            type: "danger",
            message: "Failed to Send Message"
            /* The "message" should be plain text */
          });
          console.log(data); // success message
        } catch (error) {
          // failure operation
          console.error(error);
        }
      }
    }
    // messageService.sendLMS('1234567890', '07043042992', '010111222', '수신자명', '메시지 제목입니닷', 'LMS 단건전송', '20180811161016', true, '발신자명', '20180903141403',
    //   function (response) {
    //     console.log(response);
    //   }, function (error) {
    //     console.log(error);
    //   })
    // messageService.sendLMS(CorpNum, Sender, Receiver, ReceiverName, Subject, Contents, reserveDT, adsYN, SenderName, requestNum, UserID, success, error)
    // messageService.sendLMS("1198638589", "1644-1246", "01041737335", ReceiverName, Subject, Contents, reserveDT, false, SenderName, success, error)
  };

  function onTextAreaChange(){
    console.log("text area",textArea.current)
  }

  return (
    <div style={{
      margin: '0 2px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100vh'
    }}>
      <FwForm ref={formRef}>
        <FwFormControl >
          <FwSelect
            label='Template'
            placeholder='Your choices'
            hintText='Select Your Template'
            name="TemplateName"
            options={name}
            onFwChange={onSelectChange}
          ></FwSelect>
          <FwTextarea rows={21}
            label="Paragraph Text"
            placeholder="Enter Your Paragraph Text Here"
            state="normal" name="Template" value={paragraphText} resize="vertical">
          </FwTextarea>
        </FwFormControl>  
      </FwForm>
      <FwButton color="primary" ref={sendMessageButton} onFwClick={handleFormSubmit}> Send Message </FwButton>
    </div>
  );
}

export default HelloUser;
