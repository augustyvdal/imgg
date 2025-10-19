import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";




const InfoButton = () => {
    const [showInfo, setShowInfo] = useState(false);    
    
    return (

        <div>
            <button
            className="text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer transition-colors"
            title="How to play"
            >
                <FontAwesomeIcon icon={faInfoCircle} size="lg" />
            </button>
        </div>
    );
};

export default InfoButton;
