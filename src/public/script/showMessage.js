const showSuccessMessage = () => {
    const getMessageText = getCookies('message');
    const getMessageType = getCookies('type');

    if (getMessageText && getMessageType) {
        const messageE = document.querySelector('.showMessage');
        const messageText = document.querySelector('.message');

        messageText.innerText = getMessageText;
        messageE.style.display = 'block';

        if (getMessageType == 'red') {
            messageE.style.backgroundColor = 'crimson'; // màu vàng nâu để thông áo
        } else messageE.style.backgroundColor = '#4CAF50'; // màu xanh khi tạo mới

        setTimeout(() => {
            messageE.style.display = 'none';
            deleteCookie('message');
            deleteCookie('type');
        }, 3000);
    }
};

showSuccessMessage();
