import './Popup.css';
import { useState } from 'react';

export const Popup = (props) => {
    const [visible, setIsVisible] = useState(false)
    const showPopup = () => {
        setIsVisible((curr) => !curr)
        const popup = document.getElementById('main-popup');
        popup.classList.toggle('show');
    }

    setTimeout(() => {
        if (visible) {
            setIsVisible(false)
            const popup = document.getElementById('main-popup');
            popup.classList.remove('show');
        }
    }, 1000)
    
   
    return <div className='popup-container' onClick={showPopup}> 
        {props.content}
        <span className='popup-text' id='main-popup'>
            {props.tooltipText}
        </span>
    </div>
}