import {useRef} from 'react';
import './otp.css';

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
@copyright (c) Nerdtrix LLC 2021
@author Name: Jerry Urena
@author Social links:  @jerryurenaa
@author email: jerryurenaa@gmail.com
@author website: jerryurenaa.com
@license MIT (included with this project)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/

/**
 * @example of how to use the component
 * 
 * 1- Import the component
 * import {OTPInput} from 'mylocation';
 * 
 * 2- implement the component
 * <OTPInput length={6} hasErrors={false} callback={(e)=> sample(e)}/>
 * 
 * lenght is an interger of the amount of boxes that you need
 * hasErrors is a boolean that when enabled it will add a red border to the boxes
 * callback is the function to call when all the boxes are filled. The return is an integer. * 
 */

export function OTPInput(props)
{
    const inputRef = useRef([]);

    const handleNext = (e) => 
    {
        let otp = [];
        let maxInput =  props.length - 1; //arrays start from 0
        let currentInput = parseInt(e.target.name);
        let nextInput = currentInput === maxInput ? maxInput : currentInput + 1;      
        let prevInput = currentInput === 0 ? 0 : currentInput - 1;
        let deleteRequest = e.key == "Backspace" || e.key == "Delete" || e.key == "ArrowLeft";

        //User can only move to the next input if a number is entered.
        if(e.key.match(/^[0-9]+$/))
        {
            inputRef.current[nextInput].focus();
        }
        else
        {
            inputRef.current[currentInput].value = null; //Clear value
        }

        //Delete value
        if(deleteRequest)
        {
            inputRef.current[prevInput].focus();
            inputRef.current[prevInput].value = null;
        }
        
        //When the last box is filled we will get the value and execute the callback function
        if(currentInput === maxInput && !deleteRequest)
        {
            for (let i = 0; i < inputRef.current.length; i++) 
            {
                otp.push(inputRef.current[i].value);
            }

            //Send value to the callback function
            props.callback(parseInt(otp.join('')));
        }
    }

    const handlePaste = (e) => 
    {
        //If paste is being done
        if(e.type == "paste")
        {
            let otp = [];
            let clipboardData = e.clipboardData || window.clipboardData;
            let pastedData = clipboardData.getData('text/plain').trim();

            if(pastedData.length === props.length && pastedData.match(/^[0-9]+$/) != null)
            {
                for (let i = 0; i < pastedData.length; i++) 
                {
                    otp.push(pastedData.charAt(i)); //Add value to the array
                    inputRef.current[i].focus();// focus next
                    inputRef.current[i].value = pastedData.charAt(i); //Add value to the input
                }

                //Send value to the callback function
                props.callback(parseInt(otp.join('')));
            }
        }
    }

    return (
        <div className="otpWrap">
            {Array(props.length).fill("").map((_, i) => (
                <input 
                    key={i} 
                    ref={(e) => inputRef.current[i] = e} 
                    name={i} 
                    className={`otpInput ${!!props.hasErrors ? 'errorBorder' : ''}`} 
                    type="text" 
                    maxLength="1" 
                    onKeyUp={(e) => handleNext(e)} 
                    onPaste={(e) => handlePaste(e)} 
                    autoFocus={i == 0 ? true : false}
                />
            ))}
        </div>
    );
}
