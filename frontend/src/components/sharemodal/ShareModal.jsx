import React from 'react'
import { FacebookShareButton, LinkedinShareButton, TelegramShareButton, WhatsappShareButton, } from "react-share";

import { MdEmail } from "react-icons/md";
import { FaWhatsappSquare, FaTelegram, FaRegCopy } from "react-icons/fa";
import { FaSquareFacebook, FaLinkedin } from "react-icons/fa6";

import "./style.scss";
import useShowToast from '../../hooks/useShowToast';

function ShareModal({ show, setShow, data, media }) {
    const hidePopup = (e) => {
        e.preventDefault()
        setShow(false);
    };
    const showToast = useShowToast();

    const url = `https://moviesverse.vercel.app/${media}/${data}`;

    const handleCopy = (e) => {
        e.preventDefault()
        navigator.clipboard.writeText(url);
        showToast("success", "Text copied to clipboard successfully.", "success");
    };
    return (
        <div className={`videoPopupshare ${show ? "visible" : ""}`}>
            <div className="opacityLayershare" onClick={hidePopup}></div>
            <div className="videoPlayesharer">
                <span className="closeBtn" onClick={hidePopup}>
                    Close
                </span>
                <div className="sharemodalitems">
                    <FaRegCopy className='shareicon0' onClick={handleCopy} />

                    <WhatsappShareButton url={url} ><FaWhatsappSquare className='shareicon0' />
                    </WhatsappShareButton>

                    <TelegramShareButton url={url}  ><FaTelegram className='shareicon0' />
                    </TelegramShareButton>

                    <FacebookShareButton url={url} quote="Gossip" hashtag="#Gossip #bd"><FaSquareFacebook className='shareicon0' />
                    </FacebookShareButton>

                    <LinkedinShareButton
                        url={url}
                    ><FaLinkedin className='shareicon0' />
                    </LinkedinShareButton>
                </div >
            </div >
        </div >
    )
}

export default ShareModal