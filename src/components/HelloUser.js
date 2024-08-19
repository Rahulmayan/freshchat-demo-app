import React, { useState, useEffect, useRef } from 'react';
import { FwFormControl, FwSelect, FwTextarea, FwButton, FwForm } from '@freshworks/crayons/react';

const HelloUser = (props) => {
  const [templates, setTemplates] = useState([]);
  const [paragraphText, setParagraphText] = useState("");
  const formRef = useRef(null);
  const sendMessageButtonRef = useRef(null);
  const textAreaRef = useRef(null);
  const FwSelectOption = useRef(null)

  useEffect(() => {
    const handleFwInput = () => {
      if (sendMessageButtonRef.current) {
        sendMessageButtonRef.current.disabled = false;
      }
    };

    if (textAreaRef.current) {
      textAreaRef.current.addEventListener("fwInput", handleFwInput);
      return () => {
        if (textAreaRef.current) {
          textAreaRef.current.removeEventListener("fwInput", handleFwInput);
        }
      };
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.info("Fetching CRM data");
      const { requests } = props.client.iparams
      // console.log("client",requests)
      const response = await props.client.request.invoke("getTemplateData", {requests});
      // console.log("CRM data response:", response);
  
      if (response) {
        const nameData = response.response.map((object, index) => ({
          value: `name-${index}`,
          text: object.templateName,
          paragraph: object.template
        }));
        // console.log("nameData", nameData);

        setTemplates(nameData);
        setParagraphText("");
      }
    } catch (error) {
      console.error("Error fetching CRM data:", error);
    }
  };

  const onSelectChange = (e) => {
    const selectedOption = e.detail.meta.selectedOptions[0];
    console.log("🚀 ~ onSelectChange ~ selectedOption:", selectedOption)
    sendMessageButtonRef.current.disabled = false;
    selectedOption === undefined ? setParagraphText(null) :  setParagraphText(selectedOption.paragraph)
  };

  const handleFormSubmit = async (e) => {
    const { values, isValid, errors } = await formRef.current.doSubmit(e);
    // console.log({ result: values, errors });

    if (sendMessageButtonRef.current) sendMessageButtonRef.current.disabled = true;  

    if(!FwSelectOption.current.value){
      await props.client.interface.trigger("showNotify", {
        type: "danger",
        message: "Please select any values. Note that choosing a template is mandatory."
      });
      sendMessageButtonRef.current.disabled = false;
    }

    if (isValid && values.Template) {
      try {
        const { user } = await props.client.data.get("user");
        const finalData = {
          senderName: `${user.first_name} ${user.last_name}`,
          templateParagraph: values.Template
        };

        const response = await props.client.request.invoke("sendLMSToPopBill", finalData);
        console.log('Request successful:', response);

        await props.client.interface.trigger("showNotify", {
          type: "success",
          message: `The message was sent successfully. The response ID is ${response.response}.`
        });
      } catch (error) {
        console.error('Error during request:', error);

        await props.client.interface.trigger("showNotify", {
          type: "danger",
          message: "Failed to Send Message"
        });
        sendMessageButtonRef.current.disabled = false;
      }
    }
  };

  return (
    <div style={{
      margin: '0 2px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100vh'
    }}>
      <FwForm ref={formRef}>
        <FwFormControl>
          <FwSelect
            label='Template'
            placeholder='Your choices'
            hintText='Select Your Template'
            name="TemplateName"
            options={templates}
            ref={FwSelectOption}
            onFwChange={onSelectChange}
            allowDeselect={true}
            required
          />
          <FwTextarea
            rows={21}
            label="Paragraph Text"
            placeholder="Enter Your Paragraph Text Here"
            state="normal"
            name="Template"
            ref={textAreaRef}
            value={paragraphText}
            resize="vertical"
          />
        </FwFormControl>
      </FwForm>
      <FwButton color="primary" ref={sendMessageButtonRef} onFwClick={handleFormSubmit}> Send Message </FwButton>
    </div>
  );
};

export default HelloUser;
