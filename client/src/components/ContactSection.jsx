const ContactSection = () => {
    return (
        <div
            id="contact"
            className="relative w-full overflow-hidden bg-[#120c08] py-16 md:py-20 px-6 border-b border-[#8a3c1b]/20"
        >
            <div className="absolute bottom-0 left-0 right-0 h-[280px] bg-gradient-to-t from-[#8a3c1b]/40 via-[#5c2711]/15 to-transparent blur-[70px] pointer-events-none" />

            <div className="relative z-10 w-full px-4 md:px-8 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div>
                    <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase block mb-3">
                        ติดต่อสอบถาม
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tight">
                        มีคำถามหรือต้องการความช่วยเหลือ?
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button className="btn btn-outline text-white border-[#8a3c1b]/40 bg-[#2d1b13]/80 hover:bg-[#3d251a] hover:border-[#8a3c1b]/60 backdrop-blur-md rounded-xl font-medium h-auto py-3.5 px-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 opacity-75"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="text-sm">hello@digishop.co.th</span>
                    </button>

                    <button className="btn btn-outline text-white border-[#8a3c1b]/40 bg-[#2d1b13]/80 hover:bg-[#3d251a] hover:border-[#8a3c1b]/60 backdrop-blur-md rounded-xl font-medium h-auto py-3.5 px-6">
                        <span className="text-sm">LINE Official</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 opacity-75"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;
