import { Padding } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { useParams } from 'react-router-dom';
import Axios from "../../../Axios";

import './ReportReceipt.css';
import moment from 'moment';
const ReportReceipt = () => {
    const { cart_id } = useParams();
    const bill = {
        receiver_info: {
            "address": "",
            "cart_id": 0,
            "email": "",
            "first_name": "",
            "last_name": "",
            "order_cart_time": "",
            "phone_number": "",
            "status_id": 0,
            "status_name": ""
        },
        list_item: [
            {
                "book_name": "",
                "cart_id": 0,
                "image": "",
                "isbn": "",
                "price": "",
                "quantity": 0
            }
        ],
        total: 0
    }
    const [billDetail, setBillDetail] = useState(bill);
    const container = useRef<HTMLDivElement>(null);
    const pdfExportComponent = useRef<PDFExport>(null);
    const generatePdf = () => {
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();

        }
    }
    useEffect(() => {
        Axios.get(`/staff/get-customer-order/${cart_id}`)
            .then((res) => {
                let billDetailTemp = res.data[0];
                console.log(billDetailTemp);
                setBillDetail(billDetailTemp);
            }).catch(error => {
                console.log(error);
            })
    }, [])
    return (
        <div className='container'>
            <div className='container-receipt'>
                <PDFExport
                    ref={pdfExportComponent}
                    paperSize="auto"
                    margin={50}
                    fileName={`Report for ${new Date().getFullYear()}`}
                    author="KendoReact Team"
                >
                    <table className='table table-borderless' style={{ width: '800px', height: 'auto' }} id='receipt'>
                        <thead>
                            <tr>
                                <td colSpan={5}>
                                    <table className='table table-borderless'>
                                        <tbody>
                                            <tr><td colSpan={5} style={{ textAlign: 'center', fontWeight: '600', fontSize: '24px' }}><span>H??a ????n c???a h??ng s??ch Qu???c B???o</span></td></tr>
                                            <tr style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <td>
                                                    <tr style={{ display: 'flex' }}><h6 style={{ paddingRight: '5px' }}>M?? h??a ????n:</h6><span>{billDetail.receiver_info.cart_id}</span></tr>
                                                    <tr style={{ display: 'flex' }}><h6 style={{ paddingRight: '5px' }}>T??n:</h6><span>{billDetail.receiver_info.last_name + ' ' + billDetail.receiver_info.first_name}</span></tr>
                                                    <tr style={{ display: 'flex' }}><h6 style={{ paddingRight: '5px' }}>Email:</h6><span>{billDetail.receiver_info.email}</span></tr>
                                                </td>
                                                <td>
                                                    <tr style={{ display: 'flex' }}><h6 style={{ paddingRight: '5px' }}>Ng??y ?????t:</h6> <span>{moment(billDetail.receiver_info.order_cart_time).format('hh:mm:ss, DD/MM/YYYY')}</span></tr>
                                                    <tr style={{ display: 'flex' }}><h6 style={{ paddingRight: '5px' }}>S??? ??i???n tho???i:</h6> <span>{billDetail.receiver_info.phone_number}</span></tr>
                                                    <tr style={{ display: 'flex' }}><h6 style={{ paddingRight: '5px' }}>?????a ch???:</h6><span>{billDetail.receiver_info.address}</span></tr>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <table className='table table-bordered' style={{ padding: '0 5px 0 5px' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '5%', textAlign: 'center' }}>#</th>
                                            <th style={{ width: '65%', textAlign: 'center' }}>T??n s??ch</th>
                                            <th style={{ width: '15%', textAlign: 'center' }}>S??? l?????ng</th>
                                            <th style={{ width: '15%', textAlign: 'center' }}>????n gi??</th>
                                            <th style={{ width: '15%', textAlign: 'center' }}>Tr??? gi??</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billDetail.list_item.map((item: any, index: number) => (
                                            <tr>
                                                <td className='table-number'>{index + 1}</td>
                                                <td>
                                                    {item.book_name}
                                                </td>

                                                <td className='table-number'>
                                                    {item.quantity}
                                                </td>
                                                <td className='table-number'><span className='price'>{Intl.NumberFormat().format(item.price)}</span></td>
                                                <td className='table-number'><span className='price'>{Intl.NumberFormat().format(item.price * item.quantity)}</span></td>
                                            </tr>
                                        ))}


                                        <tr>
                                            <td colSpan={4}>
                                                Th??nh ti???n
                                            </td>
                                            <td colSpan={3}>
                                                <span className='price' style={{ width: '100%' }}>{Intl.NumberFormat().format(billDetail.total)}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tr>
                            <tr style={{ display: 'flex', justifyContent: 'right' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ textAlign: 'center' }}>Ng??y: {moment(new Date()).format('DD/MM/YYYY')}</span>
                                    <span style={{ textAlign: 'center', marginBottom: '60px' }}>Nh??n vi??n l???p</span>
                                    <span style={{ textAlign: 'center' }}>{JSON.parse(sessionStorage.getItem("accessToken")!).last_name + " " + JSON.parse(sessionStorage.getItem("accessToken")!).first_name}</span>
                                </div>
                            </tr>
                        </tbody>
                    </table>
                </PDFExport>
            </div>
            <div className='btn-container'>
                <Button variant='outlined' onClick={generatePdf}>Xu???t file</Button>
            </div>
        </div>
    )
}

export default ReportReceipt;