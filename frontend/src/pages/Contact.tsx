
const Contact = () => {
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-700">
            For any inquiries or support, please reach out to us at
            <a href="mailto:abc@gmail.com" className="text-blue-500 hover:underline">abc@gmail.com</a> or call us at <a href="tel:+1234567890" className="text-blue-500 hover:underline">+1234567890</a>.
        </p>
    </div>
    )
    
}
export default Contact;