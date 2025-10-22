import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MessageBubble({ message }) {
    const isUser = message.sender === 'user';

    return (
        <div className={`flex pt-5 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            {isUser ?
                <>
                    <div className={`max-w-lg px-4 py-2 rounded-xl ${isUser ? 'bg-neutral-200/75 text-black' : 'bg-neutral-800/70 text-neutral-200'}`}>
                        <p>{message.text}</p>
                    </div>
                    <div className="p-2 relative -top-3 bg-neutral-700 h-min rounded-full">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                </>
                :
                <>
                    <div className="p-2 relative -top-3 bg-neutral-200/75 text-black h-min rounded-full">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className={`max-w-lg px-4 py-2 rounded-xl ${isUser ? 'bg-neutral-200/75 text-black' : 'bg-neutral-800/70 text-neutral-200'}`}>
                        <p>{message.text}</p>
                    </div>
                </>
            }
        </div>
    );
}
