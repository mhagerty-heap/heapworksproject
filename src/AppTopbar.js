import React, { useState, useRef, useEffect } from "react";
import SignUpInfo from "./components/addAccountForm/SignUpInfo";
import PersonalInfo from "./components/addAccountForm/PersonalInfo";
import OtherInfo from "./components/addAccountForm/OtherInfo";
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';

import { Link } from 'react-router-dom';
import classNames from 'classnames';


export const AppTopbar = (props) => {

  const [displayBasic, setDisplayBasic] = useState(false);
  const [position, setPosition] = useState('center');
  const formSuccessMessage = useRef(null);
  const formFailMessage = useRef(null);

  const dialogFuncMap = {
    'displayBasic': setDisplayBasic,
  }

  const onClick = (name, position) => {
      dialogFuncMap[`${name}`](true);

      if (position) {
          setPosition(position);
      }
  }

  const onHide = (name) => {
      dialogFuncMap[`${name}`](false);
  }

  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    nickname: "",
    birthday: new Date(),
    otherFinancialInterests: "",
  });

  const FormTitles = ["Nickname", "Birth Date", "Interests (Select Multiple)"];

  const PageDisplay = () => {
    if (page === 0) {
      return <SignUpInfo formData={formData} setFormData={setFormData} />;
    } else if (page === 1) {
      return <PersonalInfo formData={formData} setFormData={setFormData} />;
    } else {
      return <OtherInfo formData={formData} setFormData={setFormData} />;
    }
  };

  const formSubmitMessage = (e) => {
    //e.preventDefault(); // prevents page from reloading
    if (formData.nickname) {
      formSuccessMessage.current.show({severity: 'success', summary: 'Success:', detail: ' Personal Details Saved!'});
      const personalizeSettingsString = JSON.stringify(formData); // stringify formData, required for sessionStorage
      const personalizeSettingsLocalCopy = sessionStorage.setItem('personalizeSettingsLocalCopy', personalizeSettingsString); // store ticketsLocalCopy key data in localStorage
    } else {
      formFailMessage.current.show({severity: 'error', summary: 'Error:', detail: 'For Demo purposes, at a minimum, enter the nickname'});
    }
  };

  const clearPersonalizeStorage = () => {
    sessionStorage.removeItem('personalizeSettingsLocalCopy');
  }

    return (
        <div className="layout-topbar">

            <a href="/main.html" className="layout-topbar-logo">
                <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/play-logo-light.png' : 'assets/layout/images/play-logo-dark.png'} alt="logo"/>
                <span>PLAY</span>
            </a>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars"/>
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>


                <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                    <li>
                    <Messages ref={formSuccessMessage} />
                    <Messages ref={formFailMessage} />
                    </li>
                    <li>
                        <Button icon="pi pi-user-edit"  className="p-button-success" onClick={() => setDisplayBasic(true)}></Button>
                    </li>
                    <li>
                        <a href="/helpDocumentation">
                          <button className="p-link layout-topbar-button" >
                              <i className="pi pi-question"/>
                              <span>Help</span>
                          </button>
                        </a>
                        <a href="/signin.html">
                          <button className="p-link layout-topbar-button" >
                              <i className="pi pi-sign-out"/>
                              <span>Help</span>
                          </button>
                        </a>
                    </li>
                </ul>

                <Dialog header="Personalize your Experience" visible={displayBasic} style={{ width: '30vw' }} onHide={() => {console.log("clicked close button"); setDisplayBasic(false);}}>
                  <div className="progressbar">
                    <div style={{ width: page === 0 ? "33.3%" : page == 1 ? "66.6%" : "100%" }}></div>
                  </div>
                  <div className="form-container">
                    <div className="header">
                      <h5>{FormTitles[page]}</h5>
                    </div>
                    <div className="body">{PageDisplay()}</div><h5></h5>
                    <div className="footer">

                      <Button disabled={page == 0} id="Previous" label="Previous" onClick={() => {setPage((currPage) => currPage - 1)}} />
                      &nbsp;&nbsp;
                      <Button id={page === FormTitles.length - 1 ? "Submit" : "Next"} label={page === FormTitles.length - 1 ? "Submit" : "Next"} onClick={() => {
                        if (page === FormTitles.length - 1) {
                          console.log(formData);
                          setDisplayBasic(false);
                          formSubmitMessage();
                        } else {
                          setPage((currPage) => currPage + 1);
                        }

                      }} />
                    </div>
                  </div>
                </Dialog>




        </div>
    );
}
