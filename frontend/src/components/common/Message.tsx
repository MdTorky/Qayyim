interface MessageProps {
    variant?: 'info' | 'success' | 'danger' | 'warning';
    children: React.ReactNode;
}

const Message = ({ variant = 'info', children }: MessageProps) => {
    let bgColor = 'bg-blue-100';
    let textColor = 'text-blue-800';
    let borderColor = 'border-blue-200';

    switch (variant) {
        case 'success':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            borderColor = 'border-green-200';
            break;
        case 'danger':
            bgColor = 'bg-red-50';
            textColor = 'text-red-600';
            borderColor = 'border-red-200';
            break;
        case 'warning':
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            borderColor = 'border-yellow-200';
            break;
        default:
            break;
    }

    return (
        <div className={`p-4 rounded-md border ${bgColor} ${textColor} ${borderColor} mb-4 flex items-center gap-2 animate-fade-in`}>
            {/* Icon could go here */}
            <span className="font-medium text-sm">{children}</span>
        </div>
    );
};

export default Message;
