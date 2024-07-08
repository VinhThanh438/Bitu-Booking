document.addEventListener('DOMContentLoaded', () => {
    // Function to update the booking status in the database
    const updateBookingStatus = () => {
        return document.addEventListener('beforeunload', () => {
            window.alert('Bạn có chắc chắn muốn rời khỏi trang này ?');
        });
    };

    // Function to redirect to another page
    const redirectToHomePage = () => {
        window.alert(
            'Bạn đã hết thời gian thực hiện thanh toán, hệ thống sẽ tự động hủy vé!'
        );
        window.location.href = '/'; // Replace with your desired URL
    };

    // Set a timeout to trigger after 5 minutes (300000 milliseconds)
    setTimeout(function () {
        updateBookingStatus();
        redirectToHomePage();
    }, 6000); // 6 second
});
