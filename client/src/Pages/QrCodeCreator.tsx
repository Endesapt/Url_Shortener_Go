import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { QRCodeSVG } from 'qrcode.react';
import { createRef, useEffect, useState } from 'react';
import ColorPicker from 'react-pick-color';
export default function QrCodeGenerator() {
    const [link, setLink] = useState("http://localhost/")
    const [bgColor, setBgColor] = useState("#ffffff")
    const [fgColor, setFgColor] = useState("#000000")
    const colorBgPicker = createRef<HTMLDivElement>()
    const colorFgPicker = createRef<HTMLDivElement>()
    function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>) {
        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    ref.current.getElementsByClassName("picker")[0].classList.add("hidden")
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    function showColorPicker(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const allPickers = Array.from(document.getElementsByClassName("picker"))
        for (var el of allPickers) {
            el.classList.add("hidden")
        }
        const dropDown = (e.currentTarget as HTMLElement).getElementsByClassName("picker")[0]
        dropDown?.classList?.remove("hidden")
    }

    useOutsideAlerter(colorBgPicker);
    useOutsideAlerter(colorFgPicker);
    return (<>
        <div className=' text-[#284243] text-4xl font-semibold text-center'>
            QR Code Generator
        </div>
        <div className="px-20 w-full max-w-7xl flex flex-col gap-5">
            <div className="pl-6 pr-4 pb-4 pt-10 bg-[#F6F8F9] w-full rounded-md flex  min-w-fit">
                <div className=' mr-8'>
                    <QRCodeSVG id="qr" value={link} bgColor={bgColor} fgColor={fgColor} size={260} />
                </div>
                <div className='w-full flex flex-col gap-5'>
                    <div className='flex flex-col gap-3'>
                        <div className=' text-sm'>
                            QR Code URL
                        </div>
                        <input className=' outline-none border w-full rounded-md p-1 text-slate-400 focus-visible:border-[#284243]'
                            value={link} onChange={(e) => { setLink(e.target.value) }}>
                        </input>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className=' text-sm'>
                            Background Color
                        </div>
                        <div ref={colorBgPicker} className='picker-parent border p-2 relative bg-slate-100' onClick={(e) => showColorPicker(e)}>
                            <div style={{ backgroundColor: bgColor }} className=' p-2 border'></div>
                            <ColorPicker className='picker absolute top-7 hidden z-50'
                                color={bgColor} onChange={color => setBgColor(color.hex)}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className=' text-sm'>
                            Foreground Color
                        </div>
                        <div ref={colorFgPicker} className='picker-parent border p-2 relative bg-slate-100' onClick={(e) => showColorPicker(e)}>
                            <div style={{ backgroundColor: fgColor }} className=' p-2 border'></div>
                            <ColorPicker className='picker absolute top-7 hidden z-50'
                                color={bgColor} onChange={color => setFgColor(color.hex)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className=' p-6 bg-[#F6F8F9] w-full rounded-md flex flex-col gap-4  min-w-fit'>
                <div className='text-slate-800 text-2xl font-medium text-center w-full'>About QR Codes</div>
                <p className='text-slate-800 text-xl font-medium '>History of QR Codes</p> <p className='text-sm'>QR (Quick Response) codes were first developed in 1994 by Denso Wave, a subsidiary of the Japanese company Denso Corporation. The original purpose of QR codes was to track vehicles during the manufacturing process, as they could store much more information than the traditional one-dimensional barcodes.</p>
                <p className='text-slate-800 text-xl font-medium '>Adoption and Expansion</p>
                <p className='text-sm'>Over time, QR codes began to see wider adoption beyond their industrial origins. In the early 2000s, QR codes started appearing in advertising, marketing, and various public spaces, allowing users to quickly access additional information or digital content by simply scanning the code with a smartphone.</p>
                <p className='text-slate-800 text-xl font-medium '>Why You Should Use QR Codes</p> <p className='text-slate-800 text-xl font-medium '>Improve Customer Engagement</p>
                <p className='text-sm'>QR codes can be used to direct customers to your website, social media profiles, or other online content, helping to increase engagement and build stronger connections with your audience.</p> <p className='text-slate-800 text-xl font-medium '>Streamline Information Sharing</p>
                <p className='text-sm'>QR codes can be used to quickly share contact details, event information, or other important data, making it easier for people to access the information they need.</p> <p className='text-slate-800 text-xl font-medium '>Enhance Marketing Campaigns</p> <p className='text-sm'>QR codes can be integrated into various marketing materials, such as print ads, product packaging, or even physical signage, to provide customers with additional information or interactive experiences.</p>
                <p className='text-sm'>Overall, the versatility and convenience of QR codes make them a valuable tool in today's digital landscape. By incorporating QR codes into your communication and marketing strategies, you can unlock new opportunities to connect with your audience and drive meaningful engagement.</p>
            </div>
        </div>

    </>)
}