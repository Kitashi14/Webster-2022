
import "./Modal.css";
const Modal = (props) =>{

    if(props.show === false){
        return null;
    }

    return <div className="modal">
        <p>{props.header}</p>
        {props.children}<br />
        <button className='btn btn--alt' onClick={props.onOk}>OK</button>
        <button className='btn btn--alt' onClick={props.onCancel}>Cancel</button>
    </div>;
}

export default Modal;